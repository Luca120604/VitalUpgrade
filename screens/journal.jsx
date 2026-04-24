// VITAL — Journal (Chat-artige Freitext + Foto Einträge).
// Eintrag-Typ in Storage: type='note', value=text, meta={ photos: [dataUrl], severity?, tags?, bp? }

const { useState: useStateJ, useEffect: useEffectJ, useRef: useRefJ, useMemo: useMemoJ } = React;

// Cloudflare Worker endpoint for blood-pressure OCR via LLaVA/Llama Vision.
const OCR_ENDPOINT = 'https://vital-ocr.luca1206acc.workers.dev/';

// Downscale + compress an image File to a JPEG data URL.
// Max edge 960px, quality 0.75 → typisch 80–200 KB pro Foto.
async function compressImage(file, maxEdge = 960, quality = 0.75) {
  const dataUrl = await new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  const w = img.naturalWidth, h = img.naturalHeight;
  const scale = Math.min(1, maxEdge / Math.max(w, h));
  const cw = Math.round(w * scale), ch = Math.round(h * scale);
  const canvas = document.createElement('canvas');
  canvas.width = cw; canvas.height = ch;
  canvas.getContext('2d').drawImage(img, 0, 0, cw, ch);
  return canvas.toDataURL('image/jpeg', quality);
}

function dataUrlToBlob(dataUrl) {
  const m = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!m) return null;
  const bin = atob(m[2]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: m[1] });
}

function shortModelName(id) {
  if (!id) return '';
  if (id.includes('llava')) return 'LLaVA';
  if (id.includes('llama-3.2') && id.includes('vision')) return 'Llama Vision';
  return id.split('/').pop() || id;
}

function isPlausibleBp(sys, dia) {
  return typeof sys === 'number' && typeof dia === 'number'
    && sys >= 70 && sys <= 230
    && dia >= 40 && dia <= 140
    && sys > dia;
}

async function runOcr(photoDataUrl, timeoutMs = 20000) {
  const blob = dataUrlToBlob(photoDataUrl);
  if (!blob) throw new Error('bad image');
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(OCR_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': blob.type || 'image/jpeg' },
      body: blob,
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function JournalSheet({ open, onClose, mode = 'note' }) {
  // mode: 'note' | 'bp-photo'
  const { Sheet } = window;
  const S = window.Storage;
  const Icon = window.Icon;

  const [text, setText] = useStateJ('');
  const [photos, setPhotos] = useStateJ([]); // data URLs
  const [busy, setBusy] = useStateJ(false);
  const [bp, setBp] = useStateJ({ sys: '', dia: '' });
  const [ocrState, setOcrState] = useStateJ('idle'); // idle | loading | done | error
  const [ocrBadge, setOcrBadge] = useStateJ(null);   // { text, tone, model } | null
  const [ocrError, setOcrError] = useStateJ(null);
  const fileRef = useRefJ(null);

  useEffectJ(() => {
    if (open) {
      setText(''); setPhotos([]); setBp({ sys: '', dia: '' });
      setOcrState('idle'); setOcrBadge(null); setOcrError(null);
    }
  }, [open]);

  const onFiles = async (list) => {
    if (!list || !list.length) return;
    setBusy(true);
    try {
      const next = [...photos];
      for (const f of Array.from(list).slice(0, 3 - photos.length)) {
        if (!f.type.startsWith('image/')) continue;
        const url = await compressImage(f);
        next.push(url);
      }
      setPhotos(next);
    } catch (e) {
      console.error('[journal] photo compress failed', e);
      alert('Foto konnte nicht verarbeitet werden.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removePhoto = (i) => setPhotos(p => p.filter((_, j) => j !== i));

  const onRecognize = async () => {
    if (photos.length === 0) return;
    setOcrState('loading'); setOcrError(null); setOcrBadge(null);
    try {
      // take the most recent (last) photo — OCR quality doesn't improve with multiple
      const photo = photos[photos.length - 1];
      const { parsed, model } = await runOcr(photo);
      if (!parsed || typeof parsed.sys !== 'number' || typeof parsed.dia !== 'number') {
        setOcrState('error');
        setOcrError('Keine Werte erkannt — bitte manuell eintragen.');
        return;
      }
      setBp({ sys: String(parsed.sys), dia: String(parsed.dia) });
      const plausible = isPlausibleBp(parsed.sys, parsed.dia);
      const conf = typeof parsed.confidence === 'string'
        && ['low','medium','high'].includes(parsed.confidence)
        ? parsed.confidence : null;
      const short = shortModelName(model);
      if (!plausible) {
        setOcrBadge({ text: 'Werte wirken ungewöhnlich — bitte prüfen', tone: 'warn', model: short });
      } else if (conf === 'low') {
        setOcrBadge({ text: 'niedrige Confidence — bitte prüfen', tone: 'warn', model: short });
      } else {
        setOcrBadge({ text: conf ? `erkannt · ${conf}` : 'erkannt', tone: 'ok', model: short });
      }
      setOcrState('done');
    } catch (e) {
      console.error('[journal] ocr failed', e);
      setOcrState('error');
      setOcrError(e.name === 'AbortError'
        ? 'Zeitüberschreitung — nochmal versuchen.'
        : 'Erkennung fehlgeschlagen. Werte bitte manuell eintragen.');
    }
  };

  const canSave = mode === 'bp-photo'
    ? (bp.sys && bp.dia && photos.length > 0)
    : (text.trim() || photos.length > 0);

  const save = () => {
    if (!canSave) return;
    if (mode === 'bp-photo') {
      const sys = parseFloat(bp.sys), dia = parseFloat(bp.dia);
      if (isNaN(sys) || isNaN(dia)) return;
      // Speichere als Blutdruck-Entry mit Foto-Beleg
      S.addEntry('bp', sys, { diastolic: dia, unit: 'mmHg', photos, note: text || undefined });
      // Zusätzlich als Notiz im Feed
      S.addEntry('note', text || `Blutdruck ${sys}/${dia}`, { photos, bp: { sys, dia } });
    } else {
      S.addEntry('note', text.trim(), { photos });
    }
    window.dispatchEvent(new Event('vital:changed'));
    onClose();
  };

  const titleText = mode === 'bp-photo' ? 'Blutdruck aus Foto' : 'Was ist dir aufgefallen?';
  const placeholderText = mode === 'bp-photo'
    ? 'Kontext (optional): nach Kaffee, abends …'
    : 'Was hast du bemerkt? Körper, Stimmung, Schlaf, Ernährung, Symptome …';

  return (
    <Sheet open={open} onClose={onClose} title={titleText}
      footer={
        <button onClick={save} disabled={!canSave || busy} className="tap" style={{
          width: '100%', padding: 14,
          background: canSave && !busy ? 'var(--accent)' : 'var(--bg-2)',
          color: canSave && !busy ? '#000' : 'var(--text-3)',
          border: 0, borderRadius: 12, fontSize: 15, fontWeight: 600,
        }}>
          {busy ? 'Foto wird verarbeitet …' : 'Eintrag speichern'}
        </button>
      }
    >
      <div style={{ paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mode === 'bp-photo' && (
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Werte vom Messgerät</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', justifyContent: 'center' }}>
              <input value={bp.sys} onChange={e => setBp({ ...bp, sys: e.target.value })}
                inputMode="numeric" placeholder="120" className="num"
                style={{
                  width: 110, background: 'var(--bg-1)', border: '0.5px solid var(--line)',
                  borderRadius: 10, padding: '14px 10px', textAlign: 'center',
                  fontSize: 40, fontWeight: 300, color: 'var(--text-0)',
                  letterSpacing: '-0.02em', outline: 'none',
                }}
              />
              <span style={{ fontSize: 28, color: 'var(--text-3)' }}>/</span>
              <input value={bp.dia} onChange={e => setBp({ ...bp, dia: e.target.value })}
                inputMode="numeric" placeholder="80" className="num"
                style={{
                  width: 110, background: 'var(--bg-1)', border: '0.5px solid var(--line)',
                  borderRadius: 10, padding: '14px 10px', textAlign: 'center',
                  fontSize: 40, fontWeight: 300, color: 'var(--text-0)',
                  letterSpacing: '-0.02em', outline: 'none',
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', marginTop: 6 }}>
              mmHg · systolisch / diastolisch
            </div>
            {ocrBadge && (
              <div style={{
                marginTop: 10, display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', borderRadius: 10,
                background: ocrBadge.tone === 'ok' ? 'var(--accent-dim)' : 'oklch(0.35 0.10 45 / 0.22)',
                border: '0.5px solid ' + (ocrBadge.tone === 'ok' ? 'var(--accent)' : 'var(--alert)'),
              }}>
                <span style={{
                  fontSize: 13,
                  color: ocrBadge.tone === 'ok' ? 'var(--accent)' : 'var(--alert)',
                }}>{ocrBadge.tone === 'ok' ? '✓' : '!'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-0)', fontWeight: 500 }}>
                    {ocrBadge.text}
                  </div>
                  {ocrBadge.model && (
                    <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>
                      via {ocrBadge.model}
                    </div>
                  )}
                </div>
              </div>
            )}
            {ocrError && (
              <div style={{
                marginTop: 10, padding: '8px 12px', borderRadius: 10,
                background: 'oklch(0.35 0.10 45 / 0.18)',
                border: '0.5px solid var(--alert)',
                fontSize: 12, color: 'var(--alert)',
              }}>{ocrError}</div>
            )}
          </div>
        )}

        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            {mode === 'bp-photo' ? 'Notiz (optional)' : 'Freitext'}
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)}
            rows={mode === 'bp-photo' ? 3 : 6}
            placeholder={placeholderText}
            style={{
              width: '100%', padding: 14, background: 'var(--bg-1)',
              border: '0.5px solid var(--line)', borderRadius: 10,
              color: 'var(--text-0)', fontSize: 14, outline: 'none',
              fontFamily: 'inherit', resize: 'none', lineHeight: 1.5,
            }}
          />
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            {mode === 'bp-photo' ? 'Foto vom Messgerät' : 'Fotos (optional)'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {photos.map((src, i) => (
              <div key={i} style={{
                position: 'relative', aspectRatio: '1', borderRadius: 10,
                background: 'var(--bg-1)', overflow: 'hidden',
                border: '0.5px solid var(--line-soft)',
              }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => removePhoto(i)} className="tap" style={{
                  position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11,
                  background: 'rgba(0,0,0,0.75)', border: 0, color: '#fff',
                  display: 'grid', placeItems: 'center', fontSize: 12,
                }}>×</button>
              </div>
            ))}
            {photos.length < 3 && (
              <button onClick={() => fileRef.current?.click()} className="tap" style={{
                aspectRatio: '1', background: 'var(--bg-1)',
                border: '0.5px dashed var(--line)', borderRadius: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 4, color: 'var(--text-2)',
              }}>
                <span style={{ fontSize: 22, lineHeight: 1 }}>+</span>
                <span style={{ fontSize: 10 }}>Foto</span>
              </button>
            )}
          </div>
          <input
            ref={fileRef} type="file" accept="image/*" multiple
            capture={mode === 'bp-photo' ? 'environment' : undefined}
            onChange={(e) => onFiles(e.target.files)}
            style={{ display: 'none' }}
          />
          {mode === 'bp-photo' && (
            <button
              onClick={onRecognize}
              disabled={photos.length === 0 || ocrState === 'loading'}
              className="tap"
              style={{
                marginTop: 10, width: '100%', padding: '12px 14px',
                background: photos.length === 0 || ocrState === 'loading'
                  ? 'var(--bg-2)' : 'var(--bg-1)',
                color: photos.length === 0 ? 'var(--text-3)' : 'var(--text-0)',
                border: '0.5px solid ' + (photos.length === 0 ? 'var(--line-soft)' : 'var(--accent)'),
                borderRadius: 12, fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              <span style={{ fontSize: 14 }}>{ocrState === 'loading' ? '⏳' : '🔮'}</span>
              {ocrState === 'loading' ? 'erkenne Werte …' : 'Werte aus Foto erkennen'}
            </button>
          )}
          <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 6, lineHeight: 1.4 }}>
            Max 3 Fotos · werden auf 960 px skaliert und lokal im Browser gespeichert.
            {mode === 'bp-photo' && ' Erkennung läuft über Cloudflare Workers AI (LLaVA).'}
          </div>
        </div>
      </div>
    </Sheet>
  );
}

function JournalFeed({ limit = 3, onOpen }) {
  const S = window.Storage;
  const [, setTick] = useStateJ(0);

  useEffectJ(() => {
    const bump = () => setTick(x => x + 1);
    window.addEventListener('vital:changed', bump);
    return () => window.removeEventListener('vital:changed', bump);
  }, []);

  const notes = useMemoJ(() => S.getEntries({ type: 'note' }).slice(0, limit), [limit]);

  if (notes.length === 0) return null;

  const fmt = (ts) => {
    const d = new Date(ts);
    const today = new Date(); today.setHours(0,0,0,0);
    const eday = new Date(d); eday.setHours(0,0,0,0);
    const delta = (today - eday) / 86400000;
    const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    if (delta === 0) return `heute · ${time}`;
    if (delta === 1) return `gestern · ${time}`;
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }) + ' · ' + time;
  };

  return (
    <div style={{ padding: '22px 20px 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span className="eyebrow">Journal</span>
        <button onClick={onOpen} className="tap" style={{
          fontSize: 12, color: 'var(--accent)', background: 'transparent', border: 0, padding: 0,
        }}>+ Notiz</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notes.map(n => (
          <div key={n.id} style={{
            padding: 14, background: 'var(--bg-1)', borderRadius: 14,
            border: '0.5px solid var(--line-soft)',
          }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {fmt(n.ts)}
              {n.meta?.bp && <span style={{ color: 'var(--accent)', marginLeft: 8 }}>
                RR {n.meta.bp.sys}/{n.meta.bp.dia}
              </span>}
            </div>
            {n.value && (
              <div style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--text-0)', whiteSpace: 'pre-wrap' }}>
                {n.value}
              </div>
            )}
            {n.meta?.photos?.length > 0 && (
              <div style={{
                display: 'grid', gridTemplateColumns: `repeat(${Math.min(n.meta.photos.length, 3)}, 1fr)`,
                gap: 6, marginTop: n.value ? 10 : 0,
              }}>
                {n.meta.photos.slice(0, 3).map((src, i) => (
                  <img key={i} src={src} alt="" style={{
                    width: '100%', aspectRatio: '1', objectFit: 'cover',
                    borderRadius: 8, border: '0.5px solid var(--line-soft)',
                  }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

window.JournalSheet = JournalSheet;
window.JournalFeed = JournalFeed;

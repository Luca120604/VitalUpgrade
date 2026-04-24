// VITAL — Lab befund parsing (regex-based).
const REF = {
  testosterone: { low: 2.5,  high: 9.0,  unit: 'ng/ml', label: 'Testosteron gesamt' },
  shbg:         { low: 18,   high: 54,   unit: 'nmol/l', label: 'SHBG' },
  vitamin_d:    { low: 30,   high: 60,   unit: 'ng/ml', label: 'Vitamin D (25-OH)' },
  ferritin:     { low: 30,   high: 300,  unit: 'µg/l', label: 'Ferritin' },
  tsh:          { low: 0.4,  high: 4.0,  unit: 'mU/l', label: 'TSH' },
  b12:          { low: 300,  high: 900,  unit: 'pg/ml', label: 'Vitamin B12' },
  hba1c:        { low: 4.0,  high: 5.6,  unit: '%',    label: 'HbA1c' },
  crp:          { low: 0,    high: 0.5,  unit: 'mg/dl', label: 'CRP' },
  hdl:          { low: 40,   high: 90,   unit: 'mg/dl', label: 'HDL' },
  ldl:          { low: 0,    high: 130,  unit: 'mg/dl', label: 'LDL' },
};

const LAB_PATTERNS = [
  { key: 'testosterone', label: 'Testosteron gesamt', unit: 'ng/ml',
    patterns: [/testosteron(?:\s*gesamt|\s*total)?\s*[:\s]*([\d.,]+)\s*(ng\/ml|nmol\/l)?/i] },
  { key: 'shbg', label: 'SHBG', unit: 'nmol/l',
    patterns: [/shbg\s*[:\s]*([\d.,]+)\s*(nmol\/l)?/i] },
  { key: 'vitamin_d', label: 'Vitamin D (25-OH)', unit: 'ng/ml',
    patterns: [/(?:vitamin\s*d|25[- ]?oh[- ]?d|calcidiol)\s*[:\s]*([\d.,]+)\s*(ng\/ml|nmol\/l)?/i] },
  { key: 'ferritin', label: 'Ferritin', unit: 'µg/l',
    patterns: [/ferritin\s*[:\s]*([\d.,]+)\s*(µg\/l|ug\/l|ng\/ml)?/i] },
  { key: 'tsh', label: 'TSH', unit: 'mU/l',
    patterns: [/tsh\s*(?:basal)?\s*[:\s]*([\d.,]+)\s*(mu\/l|miu\/l|µiu\/ml)?/i] },
  { key: 'b12', label: 'Vitamin B12', unit: 'pg/ml',
    patterns: [/(?:vitamin\s*b[\s-]?12|cobalamin)\s*[:\s]*([\d.,]+)\s*(pg\/ml|pmol\/l)?/i] },
  { key: 'hba1c', label: 'HbA1c', unit: '%',
    patterns: [/hba1c\s*[:\s]*([\d.,]+)\s*(%|mmol\/mol)?/i] },
  { key: 'crp', label: 'CRP', unit: 'mg/dl',
    patterns: [/crp\s*[:\s]*([\d.,]+)\s*(mg\/dl|mg\/l)?/i] },
  { key: 'hdl', label: 'HDL-Cholesterin', unit: 'mg/dl',
    patterns: [/hdl[- ]?(?:cholesterin)?\s*[:\s]*([\d.,]+)\s*(mg\/dl|mmol\/l)?/i] },
  { key: 'ldl', label: 'LDL-Cholesterin', unit: 'mg/dl',
    patterns: [/ldl[- ]?(?:cholesterin)?\s*[:\s]*([\d.,]+)\s*(mg\/dl|mmol\/l)?/i] },
];

function parseBefund(text) {
  if (!text) return [];
  const out = [];
  const seen = new Set();
  for (const def of LAB_PATTERNS) {
    for (const p of def.patterns) {
      const m = text.match(p);
      if (m && !seen.has(def.key)) {
        seen.add(def.key);
        const v = parseFloat(m[1].replace(',', '.'));
        if (isNaN(v)) continue;
        const unit = (m[2] || def.unit).trim();
        const ref = REF[def.key];
        let flag = null;
        if (ref && unit === ref.unit) {
          if (v < ref.low) flag = 'low';
          else if (v > ref.high) flag = 'high';
        }
        out.push({ key: def.key, label: def.label, value: v, unit, flag });
        break;
      }
    }
  }
  return out;
}

window.Parsing = { REF, LAB_PATTERNS, parseBefund };

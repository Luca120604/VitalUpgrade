# Managed Agents

Helper scripts to provision Anthropic Managed Agents for the VitalUpgrade
project. These run against the Anthropic CLI (`ant`) and are not executed
by the Next.js app itself.

## Setup

```bash
brew install anthropics/tap/ant
export ANTHROPIC_API_KEY="your-key"
```

Create an environment once:

```bash
ant beta:environments create --name "env" \
  --config '{type: cloud, networking: {type: unrestricted}}'
```

## Provision agents

```bash
bash agents/data-analyst.sh   # Data analyst (+ Amplitude MCP)
bash agents/api-designer.sh   # API Designer
```

Then start a session with the returned agent id and environment id.

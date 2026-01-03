# n8n Workflow Setup - CV Optimizer Universal

## 🎯 Übersicht

Dieser Workflow implementiert eine **universelle 7-Step CV-Optimierungs-Pipeline** mit Multi-LLM Support (Claude, Grok, Llama).

---

## 📋 Voraussetzungen

1. **n8n Instance**: `https://n8n-production-5303.up.railway.app`
2. **n8n API Key**: Erstellen unter Settings → API → Create API Key
3. **LLM API Keys**:
   - `ANTHROPIC_API_KEY` (für Claude)
   - `GROK_API_KEY` oder `XAI_API_KEY` (für Grok)
   - Optional: Local Llama Endpoint

---

## 🚀 Installation

### Schritt 1: Credentials in n8n erstellen

#### Anthropic Claude:
```bash
curl -X POST "https://n8n-production-5303.up.railway.app/api/v1/credentials" \
  -H "X-N8N-API-KEY: YOUR_N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Anthropic API",
    "type": "anthropicApi",
    "data": {
      "apiKey": "YOUR_ANTHROPIC_API_KEY"
    }
  }'
```

**Speichern Sie die zurückgegebene Credential ID** (z.B. `cred_abc123`)

#### Grok (xAI):
```bash
curl -X POST "https://n8n-production-5303.up.railway.app/api/v1/credentials" \
  -H "X-N8N-API-KEY: YOUR_N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grok API",
    "type": "openAiApi",
    "data": {
      "apiKey": "YOUR_GROK_API_KEY",
      "baseUrl": "https://api.x.ai/v1"
    }
  }'
```

**Speichern Sie die zurückgegebene Credential ID** (z.B. `cred_xyz789`)

---

### Schritt 2: Workflow-Datei anpassen

Öffnen Sie `cv-optimizer-universal-workflow.json` und ersetzen Sie:

```json
"credentials": {
  "anthropicApi": {
    "id": "{{ANTHROPIC_CREDENTIAL_ID}}",  // ← Ersetzen mit cred_abc123
    "name": "Anthropic API"
  }
}
```

und

```json
"credentials": {
  "openAiApi": {
    "id": "{{GROK_CREDENTIAL_ID}}",  // ← Ersetzen mit cred_xyz789
    "name": "Grok API"
  }
}
```

---

### Schritt 3: Workflow importieren

#### Option A: Via n8n UI
1. Öffnen Sie n8n: `https://n8n-production-5303.up.railway.app`
2. Klicken Sie auf **Settings** → **Import Workflow**
3. Laden Sie `cv-optimizer-universal-workflow.json` hoch
4. Überprüfen Sie die Credentials in den LLM-Nodes
5. Klicken Sie auf **Activate** (oben rechts)

#### Option B: Via API
```bash
# Workflow JSON in Variable laden
WORKFLOW_JSON=$(cat cv-optimizer-universal-workflow.json)

# Importieren
curl -X POST "https://n8n-production-5303.up.railway.app/api/v1/workflows" \
  -H "X-N8N-API-KEY: YOUR_N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$WORKFLOW_JSON"
```

---

### Schritt 4: Workflow aktivieren

```bash
# Ersetzen Sie WORKFLOW_ID mit der ID aus dem Import
curl -X PATCH "https://n8n-production-5303.up.railway.app/api/v1/workflows/WORKFLOW_ID" \
  -H "X-N8N-API-KEY: YOUR_N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"active": true}'
```

---

## 🧪 Testing

### Status-Check:
```bash
curl https://n8n-production-5303.up.railway.app/webhook/cv-optimizer-status
```

**Erwartete Response:**
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "workflow": "cv-optimizer-universal",
  "supported_llms": ["claude", "grok", "llama"],
  "features": [
    "7-step optimization pipeline",
    "Multi-LLM support",
    "Detailed step-by-step results",
    "ATS score calculation",
    "Gap analysis",
    "STAR format bullets"
  ]
}
```

### CV Optimization Test:
```bash
curl -X POST https://n8n-production-5303.up.railway.app/webhook/cv-optimizer \
  -F "llm_provider=claude" \
  -F "job_title=Senior AI Engineer" \
  -F "job_description=We are looking for an experienced AI Engineer..." \
  -F "cv_text=John Doe, AI Engineer with 5 years experience..."
```

---

## 📊 Workflow-Struktur

```
┌─────────────────────────────────────────────┐
│  Webhook Trigger (/webhook/cv-optimizer)   │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Parse Input (Extract llm_provider, etc)    │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  LLM Router (If claude → left, else right)  │
└─────┬────────────────────────────────┬──────┘
      │                                │
      ▼                                ▼
┌──────────────┐            ┌──────────────────┐
│ Step 1       │            │ Step 1           │
│ (Claude)     │            │ (Grok/Llama)     │
└──────┬───────┘            └────────┬─────────┘
       │                             │
       └──────────┬──────────────────┘
                  ▼
       ┌────────────────────┐
       │ Merge Step 1       │
       └──────┬─────────────┘
              ▼
       ┌────────────────────┐
       │ Step 2: Gap        │
       └──────┬─────────────┘
              ▼
       ┌────────────────────┐
       │ Step 3: Summary    │
       └──────┬─────────────┘
              ▼
       ┌────────────────────┐
       │ Step 4: Bullets    │
       └──────┬─────────────┘
              ▼
       ┌────────────────────┐
       │ Step 5: Skills     │
       └──────┬─────────────┘
              ▼
       ┌────────────────────┐
       │ Step 6: Assembly   │
       └──────┬─────────────┘
              ▼
       ┌────────────────────┐
       │ Step 7: QA         │
       └──────┬─────────────┘
              ▼
       ┌────────────────────┐
       │ Build Final        │
       │ Response           │
       └──────┬─────────────┘
              ▼
       ┌────────────────────┐
       │ Webhook Response   │
       └────────────────────┘
```

---

## 🔧 Konfiguration

### Unterstützte LLM Provider:

| Provider | Parameter-Wert | Model |
|----------|---------------|-------|
| Anthropic Claude | `claude` | claude-sonnet-4-20250514 |
| Grok (xAI) | `grok` | grok-2-latest |
| Local Llama | `llama` | (to be configured) |

### Request Parameter:

```typescript
{
  llm_provider: 'claude' | 'grok' | 'llama',  // Required
  job_title: string,                          // Required
  job_description: string,                    // Required
  cv_text: string                             // Required (or cv_file)
}
```

### Response Format:

```typescript
{
  success: true,
  jobId: "job_1234567890_abc123",
  llmProvider: "claude",
  timestamp: "2026-01-03T12:00:00.000Z",

  scores: {
    original: 52,
    optimized: 87,
    improvement: "+35%"
  },

  steps: {
    step1_keywords: { keywords: [...], total_count: 28 },
    step2_gap_analysis: { matched_keywords: [...], missing_keywords: [...], ats_score_original: 52 },
    step3_summary: { optimized_summary: "...", keywords_added: [...] },
    step4_bullets: { optimized_bullets: [...] },
    step5_skills: { skills_categories: [...] },
    step6_assembly: { optimized_cv: {...} },
    step7_qa: { ats_score_optimized: 87, strengths: [...], recommendations: [...] }
  },

  optimized_cv: {
    summary: "...",
    experience: [...],
    skills: {...},
    full_text: "..."
  },

  qa_report: {
    strengths: ["Strong technical coverage", ...],
    remaining_gaps: ["Consider cloud certifications"],
    recommendations: ["Add Kubernetes certification"],
    ready_to_submit: true,
    quality_flags: []
  }
}
```

---

## 🐛 Troubleshooting

### "Credential not found"
- Überprüfen Sie die Credential-IDs in den LLM-Nodes
- Stellen Sie sicher, dass die Credentials in n8n vorhanden sind
- Workflow neu importieren

### "Workflow not responding"
- Prüfen Sie ob der Workflow aktiv ist (grüner Toggle)
- Überprüfen Sie die n8n Execution Logs
- Testen Sie den Status-Endpoint

### LLM-Fehler
- Überprüfen Sie die API Keys
- Prüfen Sie die Rate Limits der LLM Provider
- Schauen Sie in die n8n Node-Logs

---

## 📝 Nächste Schritte

1. ✅ Workflow importiert und aktiviert
2. ⏳ Frontend anpassen (React-Integration)
3. ⏳ Deployment-Scripts erstellen
4. ⏳ Testing & QA

---

**Support**: Bei Problemen schauen Sie in die n8n Execution Logs oder kontaktieren Sie den Admin.

# 🚀 Quick Start - CVOptimization

**Ziel**: CVOptimization in unter 10 Minuten zum Laufen bringen!

---

## ✅ Checkliste

- [ ] n8n Instance erreichbar: https://n8n-production-5303.up.railway.app
- [ ] Anthropic API Key vorhanden
- [ ] Grok API Key vorhanden (optional)
- [ ] Node.js 18+ installiert
- [ ] SFTP Zugangsdaten für Strato (für Deployment)

---

## 📋 Schritt für Schritt

### 1. n8n Credentials erstellen (5 Min)

```bash
# Öffne n8n UI
open https://n8n-production-5303.up.railway.app

# Settings → Credentials → Add Credential

# 1. Anthropic API
# Type: Anthropic API
# Name: Anthropic API
# API Key: sk-ant-xxxxx
# [Save]

# 2. Grok API
# Type: OpenAI
# Name: Grok API
# API Key: xai-xxxxx
# Base URL: https://api.x.ai/v1
# [Save]
```

**Wichtig**: Credential-IDs notieren! (z.B. `cred_abc123`)

---

### 2. Workflow importieren & anpassen (3 Min)

```bash
cd /mnt/e/CodelocalLLM/CVOptimization_New/n8n/

# Öffne: cv-optimizer-universal-workflow.json
# Ersetze in allen LLM-Nodes:
#   "id": "{{ANTHROPIC_CREDENTIAL_ID}}"
#   → "id": "cred_abc123"  (deine echte ID)

# In n8n UI:
# Import Workflow → Upload JSON
# Credentials überprüfen
# [Activate] (oben rechts)
```

---

### 3. Frontend starten (2 Min)

```bash
cd /mnt/e/CodelocalLLM/CVOptimization_New/frontend/

# Install
npm install

# Start
npm run dev

# Browser öffnet automatisch: http://localhost:5173
```

---

## 🧪 Testen

### Backend Status prüfen:
```bash
curl https://n8n-production-5303.up.railway.app/webhook/cv-optimizer-status
```

**Erwartete Antwort**:
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "workflow": "cv-optimizer-universal",
  "supported_llms": ["claude", "grok", "llama"]
}
```

### Frontend testen:
1. Öffne http://localhost:5173
2. Paste einen Test-CV in das Textfeld
3. Job Title: "Senior Software Engineer"
4. Job Description: "We need a Python expert with 5+ years..."
5. LLM wählen: Claude
6. **[Optimize]** klicken
7. Warte ~30-60 Sekunden
8. Ergebnisse sollten angezeigt werden!

---

## 🚀 Deployment (Optional)

```bash
cd frontend/

# Build
npm run build

# Deploy zu Strato
./deploy.sh

# Live URL: https://www.dabrock.info/cv-optimization/
```

---

## ❌ Troubleshooting

### "Backend Offline"
→ n8n Workflow aktivieren (siehe Schritt 2)

### "Credential not found"
→ Credential-IDs in workflow.json korrigieren

### LLM antwortet nicht
→ API Keys prüfen (in n8n Credentials)

### Frontend Build Error
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Fertig!

Du solltest jetzt:
- ✅ Frontend laufen haben (http://localhost:5173)
- ✅ n8n Backend erreichbar sein
- ✅ CV Optimierung testen können

**Next Steps**:
- Workflow-Prompts in n8n anpassen
- Weitere LLMs hinzufügen
- PDF Upload implementieren
- Production deployen

---

**Fragen?** Siehe [README.md](./README.md) für Details!

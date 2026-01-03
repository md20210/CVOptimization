# CVOptimization - n8n-powered CV Optimizer

> **AI-gestützte CV-Optimierung mit 7-Step Pipeline, Multi-LLM Support und transparenten Zwischenergebnissen**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://www.dabrock.info/cv-optimization/)
[![n8n](https://img.shields.io/badge/backend-n8n-purple)](https://n8n-production-5303.up.railway.app)
[![React](https://img.shields.io/badge/frontend-React%2018-blue)](https://react.dev/)

---

## 🎯 Features

### ✨ Einzigartige Merkmale
- **7-Step Optimization Pipeline**: Transparenter, schrittweiser Optimierungsprozess
- **Live Progress Tracking**: Echtzeit-Visualisierung jedes Optimierungs-Steps
- **Detailed Step Results**: Vollständige Einsicht in alle Zwischenergebnisse
- **Multi-LLM Support**: Wahl zwischen Claude (Anthropic), Grok (xAI) oder Local Llama
- **n8n Workflow Backend**: Visual workflow engine statt Code-basierter API
- **No Comparison Mode**: Fokus auf optimale Ergebnisse mit dem gewählten Model

### 📊 7-Step Optimization Pipeline

| Step | Name | Beschreibung | Output |
|------|------|--------------|--------|
| **1** | **Keywords** | Job-Description Keywords extrahieren | 28+ kategorisierte Keywords |
| **2** | **Gap Analysis** | CV vs Requirements matchen | ATS Score, Matched/Missing Keywords |
| **3** | **Summary** | Professional Summary optimieren | Optimierter 3-4 Satz Summary |
| **4** | **Bullets** | Experience Bullets (STAR-Format) | Quantifizierte, keyword-optimierte Bullets |
| **5** | **Skills** | Skills nach Relevanz reorganisieren | Kategorisierte Skill-Matrix |
| **6** | **Assembly** | Alle Komponenten zusammenfügen | Kompletter optimierter CV |
| **7** | **QA Check** | Qualitätsprüfung & Final Scoring | ATS Score, Recommendations |

---

## 🏗️ Architektur

```
┌─────────────────────────────────────────┐
│   React Frontend (TypeScript)           │
│   - CV Upload                           │
│   - LLM Model Selection                 │
│   - 7-Step Progress Indicator           │
│   - Step Details Viewer                 │
│   - Results Export                      │
└──────────────┬──────────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────────┐
│   n8n Workflow (Railway)                │
│   /webhook/cv-optimizer                 │
│   ┌──────────────────────────────────┐  │
│   │  Parse Input                     │  │
│   │       ↓                          │  │
│   │  LLM Router (Claude/Grok/Llama)  │  │
│   │       ↓                          │  │
│   │  Step 1: Keywords → Merge       │  │
│   │  Step 2: Gap      → Merge       │  │
│   │  Step 3: Summary  → Merge       │  │
│   │  Step 4: Bullets  → Merge       │  │
│   │  Step 5: Skills   → Merge       │  │
│   │  Step 6: Assembly → Merge       │  │
│   │  Step 7: QA       → Response    │  │
│   └──────────────────────────────────┘  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   LLM Providers                         │
│   - Anthropic (Claude Sonnet 4)         │
│   - xAI (Grok 2)                        │
│   - Local Llama (GDPR)                  │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Voraussetzungen
- **Node.js** 18+
- **n8n Instance**: https://n8n-production-5303.up.railway.app
- **LLM API Keys**: Anthropic, Grok, oder Local Llama

---

### 1️⃣ n8n Workflow Setup

#### Schritt 1: Credentials erstellen
```bash
# In n8n UI:
# Settings → Credentials → Add Credential

# Anthropic API
Type: Anthropic API
Name: Anthropic API
API Key: sk-ant-xxx...

# Grok API (als OpenAI-compatible)
Type: OpenAI
Name: Grok API
API Key: xai-xxx...
Base URL: https://api.x.ai/v1
```

#### Schritt 2: Workflow importieren
```bash
cd n8n/
# In n8n UI: Import Workflow
# Upload: cv-optimizer-universal-workflow.json
# Credentials zuweisen
# Workflow aktivieren
```

Detaillierte Anleitung: [n8n/SETUP_INSTRUCTIONS.md](./n8n/SETUP_INSTRUCTIONS.md)

---

### 2️⃣ Frontend Setup

```bash
cd frontend/

# Dependencies installieren
npm install

# Environment Variables
cp .env.example .env
# Edit .env und setze N8N_URL

# Development starten
npm run dev

# Build für Production
npm run build
```

**Live URL**: http://localhost:5173

---

### 3️⃣ Deployment

#### Frontend zu Strato SFTP:
```bash
cd frontend/
chmod +x deploy.sh
./deploy.sh
```

**Live URL**: https://www.dabrock.info/cv-optimization/

---

## 📁 Projekt-Struktur

```
CVOptimization_New/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CVOptimizer.tsx          # Main component
│   │   │   ├── StepProgress.tsx         # 7-step progress indicator
│   │   │   └── StepDetails.tsx          # Detailed step results
│   │   ├── services/
│   │   │   └── n8nApi.ts                # n8n API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── .env.example
│   └── deploy.sh                        # Strato deployment script
├── n8n/
│   ├── cv-optimizer-universal-workflow.json  # n8n workflow
│   └── SETUP_INSTRUCTIONS.md                 # Setup guide
├── docs/
└── README.md                            # This file
```

---

## 🎨 UI Features

### Input Form
- **CV Upload**: TXT/PDF/DOCX support (TXT aktuell implementiert)
- **Paste CV Text**: Direktes Einfügen möglich
- **LLM Selection**: Claude, Grok oder Llama wählbar
- **Job Details**: Title + Description

### Live Progress View
```
✅──✅──🔄──⏳──⏳──⏳──⏳
Keywords Gap Summary Bullets Skills Assembly QA
        Analysis

Step 3/7: Optimizing professional summary...
Estimated time: ~45 seconds
```

### Results View
- **Score Cards**: Original → Optimized (mit Improvement %)
- **Expandable Step Details**: Alle 7 Steps im Detail
- **Keywords Visualized**: Matched (green), Missing (red), Added (blue)
- **STAR Bullets**: Vorher/Nachher Vergleich
- **Skills Matrix**: Kategorisiert nach Priorität
- **QA Report**: Strengths, Gaps, Recommendations
- **JSON Export**: Vollständige Ergebnisse downloadbar

---

## 🔧 Konfiguration

### Environment Variables

**Frontend (.env)**
```bash
VITE_N8N_URL=https://n8n-production-5303.up.railway.app
```

**n8n Workflow**
- Credentials für Anthropic API
- Credentials für Grok API (OpenAI-compatible)
- Optional: Local Llama Endpoint

---

## 📡 API Endpoints

### Status Check
```bash
GET https://n8n-production-5303.up.railway.app/webhook/cv-optimizer-status

Response:
{
  "status": "healthy",
  "version": "2.0.0",
  "workflow": "cv-optimizer-universal",
  "supported_llms": ["claude", "grok", "llama"],
  "features": [...]
}
```

### CV Optimization
```bash
POST https://n8n-production-5303.up.railway.app/webhook/cv-optimizer

Body (JSON):
{
  "llm_provider": "claude",
  "job_title": "Senior AI Engineer",
  "job_description": "We are looking for...",
  "cv_text": "John Doe..."
}

Response:
{
  "success": true,
  "jobId": "job_xxx",
  "llmProvider": "claude",
  "scores": { "original": 52, "optimized": 87, "improvement": "+35%" },
  "steps": {
    "step1_keywords": {...},
    "step2_gap_analysis": {...},
    ...
  },
  "optimized_cv": {...},
  "qa_report": {...}
}
```

---

## 🔍 Unterschiede zu CV_Matcher

| Feature | **CVOptimization** (neu) | **CV_Matcher** (alt) |
|---------|-------------------------|----------------------|
| **Backend** | n8n Workflows | FastAPI |
| **LLM Auswahl** | Dropdown (1 Model) | Toggle (Local/Grok) |
| **Progress** | Live 7-Step Anzeige | Einfacher Loader |
| **Step Details** | ✅ Alle Zwischenergebnisse | ❌ Nur Endergebnis |
| **Workflow Control** | Visual (n8n UI) | Code (Python) |
| **RAG/Chat** | ❌ (geplant) | ✅ ChromaDB |
| **i18n** | ❌ | ✅ DE/EN/ES |
| **Complexity** | Höher (n8n Setup) | Niedriger (Standard Stack) |
| **Transparency** | ✅ Volle Einsicht | ⚠️ Black Box |
| **Non-Coder Friendly** | ✅ n8n GUI | ❌ Code-only |

---

## 🛠️ Development

### Frontend starten
```bash
cd frontend/
npm run dev
```

### n8n Workflow bearbeiten
1. Öffne n8n UI: https://n8n-production-5303.up.railway.app
2. Finde Workflow "CV Optimizer - Universal"
3. Bearbeite Prompts, füge Steps hinzu, etc.
4. Speichern → automatisch deployed

### Build
```bash
cd frontend/
npm run build
```

---

## 📋 Roadmap

- [ ] **PDF/DOCX Text Extraction** (client-side)
- [ ] **Progress Polling** (n8n Webhooks für Live-Updates)
- [ ] **RAG/Chat Integration** (wie CV_Matcher)
- [ ] **i18n Support** (DE/EN/ES)
- [ ] **PDF Export** (optimierter CV als PDF)
- [ ] **Batch Processing** (mehrere CVs)
- [ ] **Llama Local Integration**

---

## 🐛 Troubleshooting

### Backend offline
```bash
# Check n8n status
curl https://n8n-production-5303.up.railway.app/webhook/cv-optimizer-status

# Restart n8n Workflow
# → n8n UI → Workflow deaktivieren → wieder aktivieren
```

### Build Fehler
```bash
# Dependencies neu installieren
cd frontend/
rm -rf node_modules package-lock.json
npm install
```

### Deployment Fehler
```bash
# SFTP Credentials prüfen
# In deploy.sh: SFTP_USER, SFTP_PASS, SFTP_HOST

# Manueller Upload via FileZilla
# Host: 5018735097.ssh.w2.strato.hosting
# User: su403214
# Pass: deutz16!2000
# Path: /dabrock-info/cv-optimization/
```

---

## 📚 Dokumentation

- **n8n Setup**: [n8n/SETUP_INSTRUCTIONS.md](./n8n/SETUP_INSTRUCTIONS.md)
- **n8n Workflow**: [n8n/cv-optimizer-universal-workflow.json](./n8n/cv-optimizer-universal-workflow.json)
- **API Service**: [frontend/src/services/n8nApi.ts](./frontend/src/services/n8nApi.ts)

---

## 🤝 Contributing

Contributions welcome! Bitte:
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🔗 Links

- **Live Demo**: https://www.dabrock.info/cv-optimization/
- **n8n Instance**: https://n8n-production-5303.up.railway.app
- **GitHub**: (Repository URL einfügen)
- **CV_Matcher (Vergleich)**: https://www.dabrock.info/cv-matcher/

---

**Built with ❤️ by Michael Dabrock**
[dabrock.info](https://dabrock.info) | [LinkedIn](https://linkedin.com/in/michaeldabrock)

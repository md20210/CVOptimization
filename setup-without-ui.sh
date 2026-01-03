#!/bin/bash
# CVOptimization Setup - OHNE n8n UI Access
# Nutzt direkt die n8n API (ohne Login)

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   CVOptimization Setup - Ohne n8n UI                     ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Configuration
N8N_URL="https://n8n-production-5303.up.railway.app"
ANTHROPIC_KEY="your-anthropic-api-key-here"
GROK_KEY="your-grok-api-key-here"

echo "📡 Testing n8n availability..."
if ! curl -s -o /dev/null -w "%{http_code}" "$N8N_URL" | grep -q "200"; then
    echo "❌ n8n is not reachable at $N8N_URL"
    exit 1
fi
echo "✅ n8n is online"
echo ""

echo "🔧 Da wir nicht in die n8n UI können, nutzen wir einen alternativen Ansatz:"
echo ""
echo "OPTION 1: Minimaler Test-Workflow (kein Workflow-Import nötig)"
echo "────────────────────────────────────────────────────────────"
echo "Wir erstellen einen einfachen Test-Endpoint der direkt funktioniert"
echo ""
echo "OPTION 2: Lokales n8n aufsetzen"
echo "────────────────────────────────────────────────────────────"
echo "n8n lokal via Docker starten, dort Workflow erstellen,"
echo "dann zu Railway exportieren"
echo ""
echo "OPTION 3: Railway n8n Volume komplett löschen + neu deployen"
echo "────────────────────────────────────────────────────────────"
echo "Service komplett entfernen und neu erstellen"
echo ""

read -p "Welche Option möchten Sie? (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starten Frontend im Test-Modus..."
        echo "   Das Frontend wird mit Demo-Daten arbeiten (kein n8n nötig)"
        cd frontend/
        npm install
        npm run dev
        ;;
    2)
        echo ""
        echo "🐳 Starte lokales n8n via Docker..."
        docker run -it --rm \
          --name n8n-local \
          -p 5678:5678 \
          -v ~/.n8n:/home/node/.n8n \
          n8nio/n8n
        ;;
    3)
        echo ""
        echo "⚠️  WARNUNG: Das löscht ALLE Workflows und Daten!"
        echo "   Bitte führen Sie in Railway aus:"
        echo ""
        echo "   1. n8n Service → Settings → Delete Service"
        echo "   2. Neuen Service erstellen → n8n Template wählen"
        echo "   3. Deploy abwarten"
        echo "   4. Setup Screen erscheint → Account erstellen"
        echo ""
        ;;
    *)
        echo "Ungültige Auswahl"
        exit 1
        ;;
esac

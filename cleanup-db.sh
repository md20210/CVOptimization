#!/bin/bash
# This script will be deployed as a Railway service to clean n8n tables

echo "🔗 Connecting to database..."
echo "Database: $DATABASE_URL"

# Drop ONLY n8n tables
psql "$DATABASE_URL" <<'SQL'
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "credentials_entity" CASCADE;
DROP TABLE IF EXISTS "workflow_entity" CASCADE;
DROP TABLE IF EXISTS "execution_entity" CASCADE;
DROP TABLE IF EXISTS "settings" CASCADE;
DROP TABLE IF EXISTS "webhook_entity" CASCADE;
DROP TABLE IF EXISTS "tag_entity" CASCADE;
DROP TABLE IF EXISTS "workflows_tags" CASCADE;
DROP TABLE IF EXISTS "shared_workflow" CASCADE;
DROP TABLE IF EXISTS "shared_credentials" CASCADE;
DROP TABLE IF EXISTS "role" CASCADE;
DROP TABLE IF EXISTS "installed_packages" CASCADE;
DROP TABLE IF EXISTS "installed_nodes" CASCADE;
DROP TABLE IF EXISTS "auth_identity" CASCADE;
DROP TABLE IF EXISTS "auth_provider_sync_history" CASCADE;
DROP TABLE IF EXISTS "event_destinations" CASCADE;
DROP TABLE IF EXISTS "migrations" CASCADE;
SQL

echo "✅ n8n tables dropped successfully!"
echo "📊 Remaining tables:"
psql "$DATABASE_URL" -c "\dt"

# Keep container running for 10 seconds so we can see output
sleep 10

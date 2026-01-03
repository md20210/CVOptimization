#!/bin/bash
# Create separate n8n database

echo "🔗 Connecting to database..."
echo "Database: $DATABASE_URL"

echo "📦 Creating separate n8n database..."
psql "$DATABASE_URL" -c "CREATE DATABASE n8n_db;" || echo "Database might already exist"
echo "✅ Database n8n_db created or already exists!"
echo ""
echo "New connection string for n8n:"
echo "postgresql://postgres:QMsZIHABICYpgVtQSIxJgJHoGtptYlFZ@pgvector-railway.railway.internal:5432/n8n_db"
echo ""
exit 0

# OLD CODE BELOW (not executed):
echo "🔗 Connecting to database..."
echo "Database: $DATABASE_URL"

# Drop ALL n8n-related tables (more comprehensive list)
psql "$DATABASE_URL" <<'SQL'
-- Drop ALL n8n tables found in the logs
DROP TABLE IF EXISTS "workflow_statistics" CASCADE;
DROP TABLE IF EXISTS "workflow_history" CASCADE;
DROP TABLE IF EXISTS "workflow_publish_history" CASCADE;
DROP TABLE IF EXISTS "workflow_dependency" CASCADE;
DROP TABLE IF EXISTS "execution_data" CASCADE;
DROP TABLE IF EXISTS "execution_metadata" CASCADE;
DROP TABLE IF EXISTS "execution_annotations" CASCADE;
DROP TABLE IF EXISTS "execution_annotation_tags" CASCADE;
DROP TABLE IF EXISTS "annotation_tag_entity" CASCADE;
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
DROP TABLE IF EXISTS "role_scope" CASCADE;
DROP TABLE IF EXISTS "scope" CASCADE;
DROP TABLE IF EXISTS "installed_packages" CASCADE;
DROP TABLE IF EXISTS "installed_nodes" CASCADE;
DROP TABLE IF EXISTS "auth_identity" CASCADE;
DROP TABLE IF EXISTS "auth_provider_sync_history" CASCADE;
DROP TABLE IF EXISTS "event_destinations" CASCADE;
DROP TABLE IF EXISTS "migrations" CASCADE;
DROP TABLE IF EXISTS "invalid_auth_token" CASCADE;
DROP TABLE IF EXISTS "variables" CASCADE;
DROP TABLE IF EXISTS "user_api_keys" CASCADE;
DROP TABLE IF EXISTS "test_run" CASCADE;
DROP TABLE IF EXISTS "test_case_execution" CASCADE;
DROP TABLE IF EXISTS "folder" CASCADE;
DROP TABLE IF EXISTS "folder_tag" CASCADE;
DROP TABLE IF EXISTS "binary_data" CASCADE;
SQL

echo "✅ All n8n tables dropped successfully!"
echo "📊 Remaining tables:"
psql "$DATABASE_URL" -c "\dt"

# Keep container running for 10 seconds so we can see output
sleep 10

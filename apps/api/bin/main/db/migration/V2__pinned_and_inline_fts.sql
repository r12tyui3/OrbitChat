-- Add 'pinned' column because RuleEngine can pin messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS pinned BOOLEAN NOT NULL DEFAULT FALSE;

-- Replace materialized view with inline generated tsvector
DROP MATERIALIZED VIEW IF EXISTS fts_messages;
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS fts_vector tsvector
GENERATED ALWAYS AS (to_tsvector('english', body)) STORED;

-- Author: Ritika Singh
-- apps/api/src/main/resources/db/migration/V1__init.sql
CREATE TYPE room_type AS ENUM ('dm','group');
CREATE TYPE role_type AS ENUM ('owner','admin','member');
CREATE TYPE canvas_type AS ENUM ('tasks','poll','whiteboard');

CREATE TABLE users (
  id UUID PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT UNIQUE,
  dm_public_key BYTEA,       -- for E2EE DMs (optional)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY,
  type room_type NOT NULL,
  name TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE memberships (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  role role_type NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, room_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  body TEXT,
  body_ciphertext BYTEA,
  attachments JSONB NOT NULL DEFAULT '[]',
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE rules (
  id UUID PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  when_json JSONB NOT NULL,
  then_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE canvases (
  id UUID PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  type canvas_type NOT NULL,
  data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reactions (
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id, emoji)
);

CREATE TABLE time_capsules (
  id UUID PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  payload_json JSONB NOT NULL,             -- message to emit
  unlock_at TIMESTAMPTZ,                   -- time-based
  min_reactions INT,                       -- reaction-based
  message_id UUID,                         -- optional: associated message to watch
  unlocked_at TIMESTAMPTZ
);

-- FTS for searchable (non-E2EE) messages
CREATE MATERIALIZED VIEW fts_messages AS
SELECT id, room_id, to_tsvector('english', coalesce(body,'')) AS tsv
FROM messages WHERE body IS NOT NULL;

CREATE UNIQUE INDEX fts_messages_pk ON fts_messages (id);
CREATE INDEX fts_messages_tsv_idx ON fts_messages USING GIN (tsv);
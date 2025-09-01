# OrbitChat - Slim MVP

OrbitChat is a programmable, offline-first chat. Each room has simple WHEN/THEN rules, plus lightweight canvases (Tasks, Polls, Mini-Whiteboard). Time Capsules unlock by time or reactions. Optional E2EE for 1:1 DMs uses sealed-box in the browser; non-E2EE rooms remain searchable.

**Stack:** Java 21 + Spring Boot WebFlux, React + TS, Postgres, Redis  
**Author:** Ritika Singh

## Architecture

```
+--------------------+     WS/SSE     +----------------------+
| React PWA (Vite)   |<-------------->| Spring Boot WebFlux  |
| - Rooms/Messages   |                | - REST + WebSocket   |
| - Rule Editor      |                | - Rules Engine (MVP) |
| - Canvases (3)     |                | - Time Capsules      |
| - E2EE in browser  |                | - Presign S3         |
| - IndexedDB queue  |                | - Prometheus/Otel    |
+--------------------+                +-----+-----------+----+
                                           |           |
                                           v           v
                                       Postgres      Redis
                                    (core data)   (presence/pubsub)
```

## Features

- **Programmable Rules**: WHEN/THEN automation (e.g., "#todo" → add to task list)
- **Real-time Canvases**: Tasks, Polls, Mini-Whiteboard
- **Time Capsules**: Messages that unlock by time or reaction count
- **Optional E2EE**: Sealed-box encryption for 1:1 DMs
- **Offline-first**: Queue messages when offline, sync on reconnect
- **WebSocket + SSE**: Real-time communication with fallback

## Quick Start

```bash
# Start all services
docker-compose up --build

# Open browser
open http://localhost:5173
```

1. Click "Dev Login" (simple dev auth)
2. Create a room
3. Add rule: "#todo" → add to Task List
4. Send message with "#todo"
5. See Task List update automatically

## Development

- **Backend**: `apps/api` (Spring Boot WebFlux)
- **Frontend**: `apps/web` (React + TypeScript)
- **Database**: PostgreSQL with Flyway migrations
- **Cache**: Redis for presence and pub/sub

## Limits & Future

**Current Limits:**
- Dev auth only (use OAuth/JWT when expanding)
- E2EE is sealed-box (no forward secrecy)
- Whiteboard uses last-write-wins ops; not a full CRDT

**Future Enhancements:**
- JWT + OAuth2, passkeys
- Better S3 presign (AWS SDK)
- Richer rules, true CRDT
- Full search UI
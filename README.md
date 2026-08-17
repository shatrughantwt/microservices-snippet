<!--
	Professional README generated from repository analysis.
	This file documents only features, endpoints, and commands present in the codebase.
-->

# Microservices Project

Short demo microservices system that implements a small snippets + comments example. The repository contains four backend services (express), a simple message broker that fan-outs events, and a Vite + React frontend. The services use in-process SQLite files for persistence where applicable and are intended for learning and demo purposes.

## Short description

This project demonstrates a minimal event-driven microservices pattern: a Snippet service stores snippets, a Comments service stores snippet comments, a Query service keeps a read-model by consuming events, and a simple Broker forwards events to all services. A React frontend (Vite) interacts with the services.

## Overview

- Snippet service: create/list snippets (persists to `snippet.db` using node:sqlite sync API).
- Comments service: add/list comments for a snippet (persists to `comments.db`).
- Query service: in-memory read model that receives `SnippetCreated` and `CommentCreated` events and serves aggregated snippet+comments via `/snippets`.
- Message broker: accepts events and forwards them to configured backend endpoints.
- Client: React + Vite frontend with components under `client/src/components`.

## Key features

- Small event-driven demo architecture (services + broker).
- Persistent storage for snippets and comments using SQLite files.
- Simple read-model service (query) that aggregates events.
- Vite + React frontend for creating snippets and comments.
- Dockerfiles and a `docker-compose.yml` to run all services locally.

## Architecture (high level)

This repository implements a small collection of HTTP microservices plus an HTTP-based message broker. The flow is:

1. The frontend calls the Snippet or Comments service to create resources.
2. The service (Snippet / Comments) persists data locally (SQLite) and POSTs an event to the broker at `/events`.
3. The broker forwards the event to configured targets (Snippet, Comments, Query) so each service can react.
4. The Query service listens for `SnippetCreated` and `CommentCreated` events and updates an in-memory read-model served at `/snippets`.

This demonstrates asynchronous event propagation (fan-out) implemented over simple HTTP POST deliveries.

## Services and responsibilities

- `snippet/`
	- Express service that exposes `POST /api/v1/snippet` and `GET /api/v1/snippet`.
	- Persists snippets to `snippet.db` using synchronous `node:sqlite` API.
	- Emits `SnippetCreated` events to the broker at `http://localhost:8005/events`.

- `comments/`
	- Express service that exposes `POST /api/v1/snippet/:id/comment` and `GET /api/v1/snippet/:id/comment`.
	- Persists comments to `comments.db`.
	- Emits `CommentCreated` events to the broker at `http://localhost:8005/events`.

- `query/`
	- Express service that maintains an in-memory `snippets` map and exposes `GET /snippets`.
	- Accepts `POST /events` and applies `SnippetCreated` and `CommentCreated` to its read-model.

- `message_broker/`
	- Simple forwarder that receives `POST /events` and concurrently POSTs the event body to configured target URLs.
	- Targets are configurable via the `BROKER_TARGETS` environment variable.

- `client/` (frontend)
	- Vite React app (Tailwind classes used) providing UI components under `client/src/components`.
	- Components: `CodeSnippetEditor.jsx`, `CreateSnippet.jsx`, `CreateComment.jsx`, `Navbar.jsx`.

## How the services communicate

- Services send events to the broker (`POST /events`).
- The broker forwards these events to each target URL (defaults to Snippet, Comments, Query endpoints).
- The Query service consumes events to keep the frontend-friendly read-model.

Example event types used by services (as observed in code):
- `SnippetCreated` — data: `{ id, title }`
- `CommentCreated` — data: `{ id, content, snippetId }`

## Tech stack

- Node.js (ES modules)
- Express (HTTP services)
- SQLite (via node:sqlite DatabaseSync for persistence in `snippet` and `comments`)
- React + Vite (frontend)
- Axios (HTTP client between services)
- Tailwind (frontend styling present in client code)

## Project structure

Generated from repository files (top-level entries):

```
Microservices/
├─ client/                 # Vite + React frontend
│  ├─ src/
│  │  ├─ components/       # React components (CodeSnippetEditor, CreateSnippet, CreateComment, Navbar)
│  │  ├─ main.jsx
│  │  └─ App.jsx
│  ├─ package.json
│  └─ Dockerfile
├─ snippet/                # Snippet service (SQLite persistence)
│  ├─ controller/
│  ├─ database/
│  ├─ routes/
│  ├─ index.js
│  ├─ package.json
│  └─ Dockerfile
├─ comments/               # Comments service (SQLite persistence)
│  ├─ controller/
│  ├─ database/
│  ├─ routes/
│  ├─ index.js
│  ├─ package.json
│  └─ Dockerfile
├─ query/                  # Read-model service (in-memory)
│  ├─ index.js
│  ├─ package.json
│  └─ Dockerfile
├─ message_broker/         # HTTP broker that forwards events
│  ├─ index.js
│  ├─ package.json
│  └─ Dockerfile
├─ docker-compose.yml      # Compose file to run all services together
├─ .env.example
└─ tests/                  # small runtime tests
```

## Request / Event flow

1. Frontend calls `POST /api/v1/snippet` on the Snippet service to create a snippet.
2. Snippet service persists the snippet and posts an event `{ type: 'SnippetCreated', data: { id, title } }` to the broker (`http://localhost:8005/events`).
3. Broker forwards the event to its `BROKER_TARGETS` (default includes Query service).
4. Query service receives the event and updates its in-memory `snippets` map for fast reads.
5. When a comment is added via `POST /api/v1/snippet/:id/comment`, a `CommentCreated` event is emitted and processed similarly.

## Prerequisites

- Node.js (v18+ recommended) and npm
- Docker & docker-compose (optional — compose file provided)

## Installation & Setup

Clone the repository and install dependencies for services you intend to run locally.

From repository root (examples):

```bash
# install frontend deps
cd client && npm install

# install backend deps (in each service folder)
cd ../snippet && npm install
cd ../comments && npm install
cd ../query && npm install
cd ../message_broker && npm install
```

Alternatively use Docker Compose (see below).

## Environment variables

Key environment variables used by services (see `.env.example`):

- `CLIENT_ORIGIN` — comma-separated list of allowed origins for CORS (defaults include localhost:5173/5174/5175).
- `AUTH_TOKEN` — optional bearer token; when set, services protect event endpoints and API routes expecting the token in `Authorization: Bearer <token>`.
- `BROKER_TARGETS` — (message broker) comma-separated target event URLs (defaults to `http://localhost:8000/events,http://localhost:3000/events,http://localhost:8002/events`).
- `PORT` — per-service port override.

Frontend environment (client):
- `VITE_AUTH_TOKEN` — token used by frontend Axios `Authorization` header when present.

Note: `.env.example` in the repository root lists the defaults.

## How to run the project

Run services individually (recommended for development):

```bash
# start snippet service
cd snippet
PORT=8000 npm run dev

# start comments service
cd ../comments
PORT=3000 npm run dev

# start query service
cd ../query
PORT=8002 npm run dev

# start broker
cd ../message_broker
PORT=8005 npm run dev

# start frontend
cd ../client
npm run dev
```

Or use Docker Compose to run all services together (Docker must be installed):

```bash
docker compose up --build
```

The compose file maps typical ports: snippet:8000, comments:3000, query:8002, broker:8005, client:5173.

## API Endpoints (summary)

All services expose a `/health` endpoint (GET) for basic liveness.

### Snippet service (`snippet`)

- POST `/api/v1/snippet`
	- Body: `{ "title": "...", "code": "..." }` (JSON)
	- Response: `201` on success, JSON `{ success: true, snippet: { id, title, code, comments: [] }, message }`.
	- Emits event to broker: `{ type: 'SnippetCreated', data: { id, title } }`.

- GET `/api/v1/snippet`
	- Response: `200` JSON map of snippets keyed by id. Example: `{ "<id>": { id, title, code, comments: [] }, ... }`.

### Comments service (`comments`)

- POST `/api/v1/snippet/:id/comment`
	- Body: `{ "text": "..." }`
	- Response: `201` on success, JSON `{ success: true, comment: { id, content }, message }`.
	- Emits event to broker: `{ type: 'CommentCreated', data: { id, content, snippetId } }`.

- GET `/api/v1/snippet/:id/comment`
	- Response: `200` JSON array of comments: `[ { id, content }, ... ]`.

### Query service (`query`)

- GET `/snippets`
	- Response: `200` JSON map of snippets: `{ "<snippetId>": { id, title, comments: [ { id, content } ] } }`.

- POST `/events`
	- Accepts events forwarded by the broker. Supports `SnippetCreated` and `CommentCreated`.

### Broker (`message_broker`)

- POST `/events`
	- Body: single event object with at least `{ type, data }`.
	- Broker forwards the event to each URL in `BROKER_TARGETS` and returns summary `{ success: true, delivered, failed }`.

## Example usage (curl)

Create a snippet (example):

```bash
curl -X POST http://localhost:8000/api/v1/snippet \
	-H "Content-Type: application/json" \
	-d '{"title":"debounce","code":"function debounce(){}"}'
```

Add a comment to a snippet:

```bash
curl -X POST http://localhost:3000/api/v1/snippet/<snippetId>/comment \
	-H "Content-Type: application/json" \
	-d '{"text":"Nice utility"}'
```

Read the query service's current read-model:

```bash
curl http://localhost:8002/snippets
```


## What I learned

- How to structure small, focused services and keep responsibilities separated (write model vs read model).
- Implementing a minimal HTTP-based broker to demonstrate event fan-out without introducing a full message queue.
- Using SQLite via node:sqlite DatabaseSync for simple local persistence in a demo project.




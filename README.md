# Microservices Project

This repository contains a lightweight Node.js microservice prototype for creating and querying code snippets and comments.

## Services

- `snippet`: handles snippet creation and listing
- `comments`: handles comment creation and retrieval for a snippet
- `query`: maintains a read model used by the frontend
- `message_broker`: relays events between microservices
- `client`: Vite React frontend

## Local startup

From the repository root, start the backend services in separate terminals:

- `cd snippet && PORT=8000 npm run dev`
- `cd comments && PORT=3000 npm run dev`
- `cd query && PORT=8002 npm run dev`
- `cd message_broker && PORT=8005 npm run dev`

Then run the frontend:

- `cd client && npm install && npm run dev`

## Environment configuration

A sample configuration file is included at `.env.example`.

Copy it to `.env` in the repo root if you want to override defaults.

## Core APIs

### Snippet service

- `POST /api/v1/snippet`
- `GET /api/v1/snippet`

### Comments service

- `POST /api/v1/snippet/:id/comment`
- `GET /api/v1/snippet/:id/comment`

### Query service

- `GET /snippets`
- `POST /events`

### Broker service

- `POST /events`

## Notes

This project uses in-memory state and is intended as a learning/demo microservice example, not a production persistence layer.

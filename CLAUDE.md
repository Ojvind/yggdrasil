# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (requires Docker)
make dev-up       # Start dev environment (app + MongoDB + MinIO)
make dev-down     # Stop dev environment

# Production
make prod-up      # Start production stack (with Caddy HTTPS)
make prod-down    # Stop production stack

# Tests
yarn test                    # Run full test suite (expects local MongoDB)
yarn test:execute-test       # Run tests with Docker MongoDB

# Database seeding
node -r @babel/register src/seed.js
```

The app runs on port 8000. In dev, the GraphQL playground is available at `http://localhost:8000/graphql`.

## Architecture

GraphQL API backend for a books/writers catalog. Stack: Node.js + Express + Apollo Server 5 + MongoDB (Mongoose) + JWT auth.

```
src/
  index.js          # Server entry: Express + Apollo setup, JWT context, DB connect
  models/           # Mongoose schemas: User, Writer, Book
  schema/           # GraphQL type definitions (SDL), one file per domain
  resolvers/        # GraphQL resolvers, one file per domain + index combiner
  loaders/          # DataLoader instances for batching (user, writer)
  subscription/     # GraphQL subscription setup
  seed.js           # Dev seed data
  minio.js          # MinIO/S3 client config
  test/             # Mocha/Chai tests
```

### GraphQL Context

Every resolver receives:
```js
{ models, me, secret, loaders: { user, writer } }
```
- `models` — Mongoose models (User, Writer, Book)
- `me` — decoded JWT payload of the current user (null if unauthenticated)
- `loaders` — DataLoader instances to avoid N+1 queries

### Authorization

Uses `combineResolvers` from `graphql-resolvers`:
- `isAuthenticated` — requires valid JWT (`x-token` header)
- `isAdmin` — requires `role === 'ADMIN'`

Delete mutations are admin-only; write mutations require authentication.

### Data Model

- **Book** has `writerIds: [ObjectId]` (supports multiple authors)
- **Writer** has optional `name` (supports single-name authors) and required `surname`
- **User** passwords are bcrypt-hashed via a pre-save hook

### Environment Variables

See `.env.example`. Key vars:
- `SECRET` — JWT signing secret
- `ADMIN_SECRET` — required to register an admin account
- `DEV_DATABASE_URL` / `PROD_DATABASE_URL` / `TEST_PROD_DATABASE_URL`
- `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD`

Database URL selection in `src/index.js` is based on the `REACT_APP_ENV` env var (`dev` → dev URL, otherwise prod URL).

### Production Deployment

Runs on a Hetzner server. The entire stack (app + MongoDB + MinIO + Caddy) is defined in `docker-compose-prod.yml`; Caddy reverse proxy handles HTTPS with automatic Let's Encrypt certificates:
- `graphql.otterbjork.se` → app:8000
- `munin.images.otterbjork.se` → minio:9000

One-time server setup:
1. Install Docker (with the compose plugin) and `make`
2. Point DNS A records for both domains at the server IP
3. Open ports 80 and 443 in the firewall
4. Clone the repo and create a `.env` in the repo root with `SECRET`, `ADMIN_SECRET`, `MONGO_USER`, `MONGO_PASSWORD`, `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`
5. Run `make prod-up` (the `minio-init` container creates the images bucket automatically)

Deploying an update — the app code is copied into the image at build time (no source volume mount in prod), so `git pull` alone is not enough:

```bash
git pull
docker compose -f docker-compose-prod.yml up -d --build app
```

MongoDB, MinIO, and Caddy data persist in named Docker volumes (`mongodb`, `minio`, `caddy_data`, `caddy_config`) and survive restarts.

# Angular + FastAPI Accounting SaaS

Monorepo for an Accounting SaaS product with:

- Angular frontend application in `apps/frontend`
- FastAPI backend scaffold in `apps/backend`

This repository currently has a functional frontend scaffold and a backend folder structure prepared for implementation.

## Repository Structure

```text
apps/
  backend/
    main.py
    config.py
    schemas.py
    app/
      core/
      db/
      routes/
      services/
  frontend/
    src/
    public/
    package.json
```

## Current State

- Frontend:
  - Angular 20 app scaffold is present and runnable.
  - Route-based page shells exist (`dashboard`, `invoices`, `expenses`, `reports`, `settings`).
  - Sidebar navigation and tenant-branding JSON API mocks are available under `apps/frontend/public/api`.
- Backend:
  - FastAPI-oriented folder layout exists.
  - `main.py`, `config.py`, and `schemas.py` are currently empty and need implementation.

## Prerequisites

- Node.js 20+ and npm
- Python 3.11+

## Frontend: Local Setup and Run

From repository root:

```bash
cd apps/frontend
npm install
npm run start
```

Open:

- http://localhost:4200

Useful frontend commands:

```bash
npm run build
npm run test
```

## Backend: Suggested Bootstrap

Backend implementation is currently scaffold-only. Once `main.py` is implemented with a FastAPI app instance, a typical local bootstrap is:

```bash
cd apps/backend
python -m venv .venv
.venv\Scripts\activate
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Expected API URL:

- http://localhost:8000

## Configuration Guidance

- Keep environment variables in `apps/backend/.env` for local development.
- Do not commit secrets to source control.
- Introduce typed settings in `apps/backend/config.py` (for example, with Pydantic Settings) when backend implementation starts.

## Recommended Next Milestones

1. Implement backend app startup, health endpoint, and configuration loading.
2. Define Pydantic schemas for core accounting entities.
3. Add first API route group and connect frontend data layer to backend endpoints.
4. Add automated tests for frontend and backend.

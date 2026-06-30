# DevPulse Next.js Frontend

Production-ready Next.js frontend for DevPulse. Connects to the existing Express API (`devpulse-api`) — the backend is unchanged.

## Architecture

- **Frontend:** Next.js App Router on port **3001**
- **Backend:** Express API on port **3000** (`devpulse-api`)
- **Auth:** JWT access token (in-memory) + httpOnly refresh cookie (cross-origin with credentials)

## Prerequisites

- Node.js 20+
- Running `devpulse-api` with PostgreSQL

## Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Start frontend (port 3001)
npm run dev
```

Ensure the backend `.env` includes:

```env
CORS_ORIGIN=http://localhost:3001
FRONTEND_URL=http://localhost:3001
```

Start the API separately:

```bash
cd ../devpulse-api
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on http://localhost:3001 |
| `npm run build` | Production build |
| `npm start` | Serve production build on port 3001 |
| `npm test` | Run Jest tests |
| `npm run test:coverage` | Tests with coverage |

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Express API base URL | `http://localhost:3000/api/v1` |

## Production deployment

Build with standalone output:

```bash
npm run build
npm start
```

Or use Docker:

```bash
docker build -t devpulse-web .
docker run -p 3001:3001 -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1 devpulse-web
```

Set backend production env:

```env
CORS_ORIGIN=https://app.yourdomain.com
FRONTEND_URL=https://app.yourdomain.com
```

## Project structure

```
src/
├── app/           # App Router pages
├── components/    # UI components and dashboard panels
├── context/       # Auth and theme providers
├── hooks/         # Shared hooks
├── lib/api/       # Axios API layer
├── modules/       # Pure business logic
└── styles/        # CSS
```

# Prudential International School — Website v5

## Structure
```
pis-v5/
  frontend/   — React + Vite source (run with npm run dev)
  backend/    — Express + TypeScript API (run with npm run dev)
```

## Running locally

### Frontend
```bash
cd frontend
npm install
npm run dev         # Vite dev server on http://localhost:5173
```

### Backend
```bash
cd backend
cp .env.example .env
# Fill in GMAIL_USER, GMAIL_PASS, NOTIFY_EMAIL in .env
npm install
npm run dev         # API on http://localhost:3001
```

## Environment Variables (backend/.env)
| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Admin dashboard password |
| `ADMIN_JWT_SECRET` | JWT signing secret (change to a long random string) |
| `PORT` | API port (default 3001) |
| `GMAIL_USER` | Gmail address for sending admission PDFs |
| `GMAIL_PASS` | Gmail App Password (16 chars, no spaces) |
| `NOTIFY_EMAIL` | Where admission PDFs are delivered |

## Gmail App Password Setup
1. Go to myaccount.google.com → Security → 2-Step Verification (enable it)
2. Go to myaccount.google.com/apppasswords
3. Create a new App Password → Mail → Other → name it "PIS Admissions"
4. Copy the 16-character password and set it as `GMAIL_PASS`

## Deployment (Railway)
Set the environment variables above in your Railway service's Variables tab, then push this repo — Railway will auto-build and deploy.

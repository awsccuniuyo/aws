# AWS Cloud Club UniUyo — Backend API

FastAPI + PostgreSQL (Supabase) backend for the AWS Student Community UniUyo platform.
Handles events, registrations, QR code generation, email delivery, and admin check-in.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | FastAPI 0.111 |
| Database | PostgreSQL via Supabase |
| ORM | SQLAlchemy 2.0 (async) |
| Migrations | Alembic |
| Emails | Resend |
| QR Codes | python-qrcode |
| Hosting | Railway |

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/events` | List all active events |
| GET | `/api/v1/events/{id}` | Single event detail |
| POST | `/api/v1/registrations` | Register for an event |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/events` | Create event |
| PATCH | `/api/v1/events/{id}` | Update event |
| DELETE | `/api/v1/events/{id}` | Delete event |
| GET | `/api/v1/admin/events/{id}/registrations` | List registrations |
| GET | `/api/v1/admin/events/{id}/stats` | Dashboard stats |
| POST | `/api/v1/admin/checkin/{qr_token}` | Scan & admit attendee |
| POST | `/api/v1/admin/events/{id}/send-qr-emails` | Trigger event-day emails |

---

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd awscc-backend

python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

### 2. Create your `.env` file

```bash
cp .env.example .env
```

Fill in the values:

```env
DATABASE_URL=postgresql+asyncpg://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=noreply@awsccuniuyo.com
FRONTEND_URL=http://localhost:3000
SECRET_KEY=any-random-string
ENVIRONMENT=development
```

### 3. Get your Supabase DATABASE_URL

1. Go to [supabase.com](https://supabase.com) → New Project
2. Settings → Database → Connection String → **URI**
3. Copy the URI and replace `postgresql://` with `postgresql+asyncpg://`
4. Replace `[YOUR-PASSWORD]` with the DB password you set

### 4. Run migrations

```bash
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

### 5. Start the dev server

```bash
uvicorn main:app --reload
```

API docs available at: `http://localhost:8000/docs`

---

## Deploying to Railway

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/awscc-backend.git
git push -u origin main
```

### 2. Create Railway project

1. Go to [railway.app](https://railway.app) → New Project
2. **Deploy from GitHub repo** → select your repo
3. Railway auto-detects Python and uses `railway.toml`

### 3. Set environment variables in Railway

In your Railway project → **Variables** tab, add:

```
DATABASE_URL        = postgresql+asyncpg://...  (from Supabase)
RESEND_API_KEY      = re_xxxxxxxxxxxx
FROM_EMAIL          = noreply@awsccuniuyo.com
FRONTEND_URL        = https://your-nextjs-app.vercel.app
SECRET_KEY          = your-production-secret
ENVIRONMENT         = production
```

### 4. Deploy

Railway deploys automatically on every push to `main`.
The `railway.toml` runs `alembic upgrade head` before starting the server.

Your API will be live at: `https://your-app.railway.app`

---

## Setting up Resend

1. Go to [resend.com](https://resend.com) → Sign up free
2. **Add a domain** → verify DNS (or use the Resend sandbox for testing)
3. API Keys → Create API Key → copy to `RESEND_API_KEY`

> For testing without a domain, use `onboarding@resend.dev` as `FROM_EMAIL`
> and you can only send to your own verified email address.

---

## Event Day Workflow

1. **Morning of event** → Admin hits `POST /api/v1/admin/events/{id}/send-qr-emails`
   - All registrants receive email with QR code attached
2. **At the door** → Admin opens the Next.js admin dashboard
   - Scans QR code with device camera
   - Calls `POST /api/v1/admin/checkin/{qr_token}`
   - Gets instant ✅ or ⚠️ already checked in response

---

## Project Structure

```
awscc-backend/
├── main.py                    # FastAPI app entry point
├── requirements.txt
├── railway.toml               # Railway deployment config
├── alembic.ini
├── alembic/
│   ├── env.py
│   └── versions/
└── app/
    ├── core/
    │   ├── config.py          # Pydantic settings
    │   └── database.py        # Async SQLAlchemy engine
    ├── models/
    │   └── models.py          # Event, Registration models
    ├── schemas/
    │   └── schemas.py         # Pydantic request/response schemas
    ├── routers/
    │   ├── events.py          # GET/POST/PATCH/DELETE events
    │   ├── registrations.py   # POST register
    │   └── admin.py           # Check-in, stats, bulk email
    └── utils/
        ├── qr.py              # QR code generation
        └── email.py           # Resend email templates
```

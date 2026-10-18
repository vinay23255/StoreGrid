# StoreGrid — Voice-of-Store Engine Backend

> **Talent AP Mega Hackathon 2026 R5 Project**  
> *"Turning Store Chatter Into Action: Voice-of-Store Engine"*

StoreGrid is a unified retail feedback intelligence engine that captures omnichannel customer and employee chatter, classifies complaints into actionable categories, detects localized complaint spikes and recurring failures, assigns tasks to operations teams, and tracks resolution SLAs with full audit transparency.

---

## Team & Roles

| Member | Responsibility | Primary Deliverables |
|---|---|---|
| **Vinay (Team Lead)** | Backend, Relational Database, API Contracts & System Integration | Node/Express API, PostgreSQL Schema, SQLite Dev Fallback, Seed & Test Pipelines |
| **Varshit** | Feedback Processing & Multilingual NLP Classification | NLP Pipeline, Telugu-English code-mixed intent extraction |
| **Sanjay** | Priority Scoring, Trend & Recurrence Detection | Urgency scoring algorithms, spike detection, recurrence patterns |
| **Yashwant** | Frontend & Operations Dashboard | React + Vite UI, Kanban triage, real-time analytics graphs |

---

## Technology Stack

- **Runtime:** Node.js (v20+ / v24)
- **Framework:** Express.js 5.x
- **Database:** PostgreSQL (with Prisma ORM schema & raw DDL migration scripts)
- **Development Fallback:** Node 24 native SQLite engine (`DatabaseSync`) for zero-dependency local development
- **File & Stream Processing:** Multer, `csv-parser`
- **Testing:** Native Node.js Test Runner (`node --test`, `node:assert`)

---

## Project Structure

```
storegrid-backend/
├── data/
│   └── synthetic_feedback.csv    # 25 curated fictional records across 5 stores
├── docs/
│   └── api-contracts.md          # Teammate API contracts & JSON payload schemas
├── prisma/
│   ├── schema.prisma             # Full PostgreSQL relational schema with enums & indexes
│   └── migrations/0_init/        # Initial PostgreSQL migration SQL
├── scripts/
│   ├── init-postgres.sql         # Raw PostgreSQL DDL migration
│   ├── migrate.js                # Migration runner
│   └── seed.js                   # Seed runner for stores, feedback, and demo issues
├── src/
│   ├── config/                   # Environment configuration loader
│   ├── constants/                # Categories, Priorities, Statuses, Enums
│   ├── controllers/              # Request handlers (Health, Feedback, Issues, Dashboard, Analytics)
│   ├── db/                       # Unified DB abstraction layer (PostgreSQL + SQLite fallback)
│   ├── middleware/               # Error handler, multer upload, request logger
│   ├── routes/                   # Express routes mounted under /api
│   ├── services/                 # Business logic, query builders, CSV parser
│   ├── validators/               # Input validation for requests and query parameters
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
├── tests/                        # Automated test suites (22 tests, 0 failures)
│   ├── health.test.js
│   ├── feedback.test.js
│   ├── issues.test.js
│   ├── analytics.test.js
│   └── csv_import.test.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Installation & Quickstart

### 1. Clone & Install Dependencies
```bash
git clone <repo-url> storegrid-backend
cd storegrid-backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/storegrid?schema=public
USE_DB_FALLBACK=auto
MAX_FILE_SIZE_MB=5
MAX_CSV_RECORDS=5000
SPIKE_THRESHOLD_FACTOR=2.0
SPIKE_MIN_COUNT=3
NLP_SERVICE_URL=http://127.0.0.1:8000
NLP_TIMEOUT_MS=3000
```

### 3. Database Setup

#### Option A: Local Development Fallback (Automatic)
If PostgreSQL is not installed or unreachable, StoreGrid **automatically activates** the built-in SQLite development database at `data/storegrid_dev.sqlite`.
No additional database software or Docker container is required. You can start developing immediately:
```bash
npm run seed
npm run dev
```

#### Option B: PostgreSQL Production Setup
If running PostgreSQL locally or in Docker:
1. Create the database:
   ```bash
   createdb storegrid
   ```
2. Run migrations:
   ```bash
   npm run db:migrate
   # or with psql:
   psql -d storegrid -f scripts/init-postgres.sql
   # or using Prisma:
   npx prisma db push
   ```

### 4. Seed Synthetic Data
Populate fictional retail stores, 25 synthetic feedback records, and demonstration issues:
```bash
npm run seed
```

### 5. Running the Application

#### Option A: Start Frontend + Backend Together (Fullstack Development)
```bash
npm run dev:all
```
This runs both:
- **Express Backend API** on `http://localhost:5000`
- **React + Vite Frontend** on `http://localhost:5173`

#### Option B: Run Services Individually
- **Backend Only (watch mode):**
  ```bash
  npm run dev:backend
  ```
- **Frontend Only:**
  ```bash
  npm run dev:frontend
  ```
- **Build Frontend Bundle:**
  ```bash
  npm run build:frontend
  ```

### 6. Starting Varshith's FastAPI NLP Microservice
To run the companion Python NLP service locally:
```bash
# Navigate to the bundled NLP service folder
cd storegrid-nlp

# (Optional) Install dependencies if not already installed
pip install -r requirements.txt

# Start FastAPI server on port 8000
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```
- **Service Root:** `http://127.0.0.1:8000`
- **Health Check:** `http://127.0.0.1:8000/health`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`

---

## Testing

StoreGrid includes an end-to-end automated test suite covering health, validation, pagination, filtering, issue resolution, CSV imports, analytics spike detection, and Varshith's NLP microservice integration.

Run all backend tests:
```bash
npm test
```

To run Sanjay's Priority & Trend Detection test suite:
```bash
node priority-trends/tests/runTests.js
```

To run Varshith's Python NLP unit test suite:
```bash
cd storegrid-nlp
python -m pytest tests
```

---

## Core API Endpoints

Consult [`docs/api-contracts.md`](file:///c:/Users/VINAY/.gemini/antigravity-ide/scratch/storegrid-backend/docs/api-contracts.md) for full request/response schemas.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend, database, and NLP service health check |
| `POST` | `/api/feedback` | Submit single feedback record (auto-classified via NLP) |
| `POST` | `/api/feedback/import` | Safe CSV upload or raw JSON import |
| `GET` | `/api/feedback` | List feedback with filtering and pagination |
| `GET` | `/api/feedback/:id` | Retrieve single feedback record |
| `GET` | `/api/issues` | List issues with status, priority, category filters |
| `GET` | `/api/issues/:id` | Issue details with store, linked feedback, and audit history |
| `PATCH` | `/api/issues/:id/assignment` | Reassign owner team or assignee with audit log |
| `PATCH` | `/api/issues/:id/status` | Update issue status (OPEN, IN_PROGRESS, RESOLVED, REOPENED) |
| `GET` | `/api/issues/:id/history` | Chronological audit trail for issue changes |
| `GET` | `/api/dashboard/summary` | Aggregated metrics for Yashwant's operations dashboard |
| `GET` | `/api/analytics/trends` | Daily volume trends, spike detection, recurrence patterns |
| `GET` | `/api/stores` | List registered stores |

---

## Standard Identifiers

Teammates must use these exact strings across all payloads:

- **Categories:**
  - `STOCK_SHORTAGE`
  - `BILLING_DELAY`
  - `STAFF_BEHAVIOUR`
  - `PRODUCT_QUALITY`
  - `EQUIPMENT_FAILURE`
  - `OTHER`
  - `NEEDS_REVIEW`
- **Priorities:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- **Issue Statuses:** `OPEN`, `IN_PROGRESS`, `RESOLVED`, `REOPENED`
- **Data Provenances:** `SYNTHETIC_DEMO`, `OFFICIAL_DATASET`, `MANUAL_ENTRY`, `TEST`

---

## Synthetic Dataset Details

The initial synthetic dataset in [`data/synthetic_feedback.csv`](file:///c:/Users/VINAY/.gemini/antigravity-ide/scratch/storegrid-backend/data/synthetic_feedback.csv) contains 25 realistic feedback records:
- **5 Stores:** Hyderabad Banjara Hills (`STR-HYD-001`), Visakhapatnam Beach Road (`STR-VIZ-002`), Vijayawada Benz Circle (`STR-VJA-003`), Guntur Brodipet (`STR-GNT-004`), Tirupati Alipiri Road (`STR-TPT-005`).
- **Multilingual representation:** Standard English and Telugu-English code-mixed complaints (e.g. *"A/C assalu work avvatledu"*, *"Dairy section lo milk packets stock ledu"*).
- **Representative sources:** Customer reviews, staff notes, kiosk feedback, and phone call transcripts.
- **Intentional Spike:** 5 clustered complaints at `STR-HYD-001` on Oct 15 triggering the spike detection algorithm.
- **Explicit Provenance:** All records are tagged with `provenance: "SYNTHETIC_DEMO"`.

---

## Official 40,000 Dataset Import Instructions

When official access to the 40,000 feedback records is confirmed:
1. Place the official CSV file at `data/official_feedback.csv`.
2. Ensure columns match or map to: `text`, `store_code`, `source_type`, `timestamp`, `rating`, `language`.
3. Set provenance to `OFFICIAL_DATASET`.
4. Run the import via curl or UI:
   ```bash
   curl -X POST http://localhost:5000/api/feedback/import \
     -F "file=@data/official_feedback.csv" \
     -F "provenance=OFFICIAL_DATASET"
   ```
   Or send batch JSON chunks to `/api/feedback/import`.
5. The importer auto-provisions missing stores and reports per-row validation errors without aborting valid rows.

---

## Limitations, Assumptions & Next Steps

1. **PostgreSQL Availability:** PostgreSQL is not currently installed as a Windows service on the development workstation. The backend utilizes the native SQLite relational engine (`DatabaseSync`) as a seamless local fallback. When deploying to staging or Docker, set `DATABASE_URL` and run `npm run db:migrate`.
2. **NLP Engine Status:** Baseline keyword triage is active for development. Varshit's deep learning / transformer classifier will hook into `/api/feedback` to replace baseline classification with model confidence scores and sentiment values.
3. **Analytics Engine Status:** Baseline statistical spike and recurrence algorithms are operational. Sanjay's ML anomaly detection model will integrate with `/api/analytics/trends`.

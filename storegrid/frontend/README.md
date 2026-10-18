# StoreGrid — Voice-of-Store Feedback & Intelligence Dashboard

> **A modern, SaaS-style Voice-of-Store feedback monitoring system for retail store managers, built for hackathon demonstration.**

StoreGrid empowers store managers to quickly understand customer complaints, identify operational bottlenecks across departments, and review low-confidence NLP classifications with zero confusion.

---

## 🌟 Key Features & Architecture

### 1. Key Metrics Cards (KPIs)
- **Total Feedback:** Quantifies customer responses logged across all touchpoints (QR codes, exit kiosks, WhatsApp voice bots).
- **Needs Attention:** Actionable count of unresolved Critical and High priority customer issues.
- **Critical Issues:** Immediate severity-1 alerts (e.g., refrigeration breakdowns, safety hazards, double charges).
- **Needs Review:** Identifies customer statements where the NLP engine confidence is `< 0.65` or phrasing is ambiguous.

### 2. Operational Categories
Implements the 6 core retail operational pillars expected by the backend:
1. `STOCK_SHORTAGE` — Empty shelves, missing items, out-of-stock dairy/produce.
2. `BILLING_DELAY` — Long checkout queues, barcode scanner latency, counter delays.
3. `STAFF_BEHAVIOUR` — Customer service demeanor, staff helpfulness.
4. `PRODUCT_QUALITY` — Expiry dates, damaged packaging, rotten produce.
5. `EQUIPMENT_FAILURE` — Freezer breakdowns, produce weighing scales, payment EDC terminals.
6. `OTHER` — Store safety, cleanliness, parking gate issues.
- `NEEDS_REVIEW` is handled separately as a human triage queue rather than a normal operational category.

### 3. Interactive Data Views
- **Feedback by Category:** Horizontal bar chart showing exact complaint counts and percentages. Clicking any category immediately filters the feedback list below.
- **Top Issues & Priority Highlights:** Deterministic frequency-based clusters highlighting recurring complaints (e.g., morning dairy shortages, peak evening counter bottlenecks).
- **Recent Customer Feedback:**
  - Responsive layout: clean table on desktop and readable stacked cards on mobile.
  - Multi-lingual realistic feedback (e.g. Telugu transliteration *"Billing chala slow ga undi"*, *"The milk packets were out of stock."*, *"The refrigerator is not working."*).
  - Real-time search across customer text, normalized transcripts, and entity keywords.
  - Category and priority filters.
  - Clickable rows that open the **Feedback Detail Modal**.

### 4. Feedback Detail Modal & Manual Review
- Inspects verbatim customer voice/transcript alongside normalized English translation.
- Displays AI confidence score and extracted entity tags (e.g., `#billing`, `#slow`, `#milk`).
- Allows the store manager to reclassify the feedback or mark it resolved with instant in-memory or backend updates.

---

## 🛠 Technology Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 (with `@tailwindcss/vite` plugin)
- **Icons:** Lucide React
- **Design Aesthetic:** Professional retail SaaS palette (clean slate/white background, dark navy typography `#0f172a`, and vibrant blue accent `#2563eb`).
- **Code Quality:** Verified with Oxlint (0 warnings, 0 errors).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm.cmd install
```

### 2. Run the Development Server
```bash
npm.cmd run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### 3. Production Build
```bash
npm.cmd run build
```

### 4. Run Linter
```bash
npm.cmd run lint
```

---

## 🔌 Backend & NLP Integration Readiness

StoreGrid is designed with a dedicated service abstraction layer (`src/services/feedbackService.js`).

### Architecture Flow
```text
┌─────────────────┐       HTTP JSON       ┌──────────────────────┐      Internal RPC     ┌──────────────────────┐
│  React Frontend │ ───────────────────>  │ Node.js/Express Host │ ───────────────────>  │ Python FastAPI (NLP) │
│   (StoreGrid)   │ <───────────────────  │       Backend        │ <───────────────────  │     Classification   │
└─────────────────┘                       └──────────────────────┘                       └──────────────────────┘
```

### Connecting to Live Backend
Create a `.env` file in the project root:
```env
VITE_API_BASE_URL=http://localhost:5000
```
When `VITE_API_BASE_URL` is omitted or the backend is offline, StoreGrid automatically falls back to high-fidelity mock data.

### API Contracts
- `GET /api/stores` — Returns registered store locations.
- `GET /api/dashboard/overview?storeId=store-001&dateRange=last7` — Returns aggregated KPIs, category breakdown, and top issues.
- `GET /api/feedback?storeId=store-001&category=ALL&priority=ALL&search=` — Returns filtered customer feedback records.
- `PATCH /api/feedback/:id/review` — Updates category assignment and resolution state.

### NLP Output Schema
```json
{
  "feedbackId": "FB-1001",
  "storeId": "store-001",
  "originalText": "Billing chala slow ga undi",
  "cleanedText": "Billing is very slow [Regional: Telugu phrasing]. Customer waited over 15 minutes at counter.",
  "category": "BILLING_DELAY",
  "confidence": 0.96,
  "needsReview": false,
  "matchedTerms": ["billing", "slow", "chala slow", "undi"],
  "priority": "HIGH",
  "sentiment": "NEGATIVE",
  "timestamp": "15 mins ago",
  "channel": "QR Code at POS",
  "department": "Front Desk / Cash Counters",
  "resolved": false
}
```

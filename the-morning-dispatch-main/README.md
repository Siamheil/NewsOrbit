# The Morning Dispatch  (TMD)

> **"Your morning, across every newsroom."**
> An editorial news aggregation platform and broadsheet wire service curating global perspectives from accredited newsrooms (BBC News, CNN, Reuters, Fox News).

---

## 1. Overview

The Morning Dispatch is built with a clear separation of concerns:
1. **Backend Wire Engine**: A read-only REST API powered by Express, MongoDB, and NewsAPI that continuously ingests, normalizes, deduplicates, and indexes articles across accredited global news sources.
2. **Editorial Broadsheet Frontend**: A high-performance, lightweight **Vanilla JavaScript** application strictly adhering to the broadsheet newspaper aesthetic defined in `DESIGN.md`. Corner geometry is razor-sharp (`0px` border-radius), typography pairs high-contrast `Playfair Display` serif headlines with utilitarian `Inter` metadata, and color uses an authentic Warm Ivory newsprint palette (`#F7F4EE`) with Deep Burgundy (`#8B1E2D`) editorial accents.

---

## 2. Architecture & Data Flow

```
┌─────────────────┐       ┌──────────────────────────────────────┐       ┌──────────────────┐
│   NewsAPI.org   │ ───>  │       TMD Ingestion Pipeline         │ ───>  │  MongoDB Index   │
│  (Wire Feeds)   │       │ (Normalize + Hash Deduplication)     │       │ (morning-dispatch)
└─────────────────┘       └──────────────────────────────────────┘       └──────────────────┘
                                             │                                     │
                                    (Every 30 Mins Cron)                           │
                                             │                                     │
                                             ▼                                     ▼
                                ┌──────────────────────────┐             ┌──────────────────┐
                                │    node-cron Scheduler   │             │ Express REST API │
                                └──────────────────────────┘             │  GET /api/article│
                                                                         └──────────────────┘
                                                                                   │
                                                                           (Vite Dev Proxy)
                                                                                   │
                                                                                   ▼
                                                                         ┌──────────────────┐
                                                                         │ Vanilla JS Client│
                                                                         │   (Native DOM)   │
                                                                         └──────────────────┘
```

---

## 3. Backend Wire Engine

### Features
- **Centralized Source Registry**: Structured registry configuring BBC News, CNN, Reuters, and Fox News.
- **Idempotent Ingestion & Deduplication**: Calculates an MD5 hash of `title + publishedAt + sourceSlug` as `sourceArticleId` and uses MongoDB `updateOne` with `$set` to prevent duplicates.
- **Automated Scheduler**: Ingests fresh dispatches across all accredited newsrooms every 30 minutes via `node-cron`.
- **Query Validation & Pagination**: Robust parameter validation for `page` (positive integers), `limit` (max 100), `sort` (`newest` or `oldest`), `source`, `topic`, and `from`/`to` ISO dates.

### Endpoints

#### `GET /api/article`
Retrieves a paginated list of normalized news dispatches.

**Query Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `page` | Integer | No | Page number (default: 1) |
| `limit` | Integer | No | Articles per page (default: 10, max: 100) |
| `source` | String | No | Newsroom source slug (e.g. `bbc-news`, `cnn`, `reuters`, `fox-news`) |
| `topic` | String | No | Topic filter (e.g. `world`, `business`, `technology`, `science`) |
| `sort` | String | No | Sort order: `newest` (default) or `oldest` |
| `from` | String | No | Start date (`YYYY-MM-DD` or ISO timestamp) |
| `to` | String | No | End date (`YYYY-MM-DD` or ISO timestamp) |

**Example Response:**
```json
{
  "articles": [
    {
      "_id": "6aae6b3081723d5ece71ebc7",
      "sourceArticleId": "edf92fb2658d89a76ba370431a829017",
      "title": "MI5 accepts it gave evidence based on lies in neo-Nazi spy case",
      "description": "It is the first time MI5 has confirmed the BBC's revelation...",
      "url": "https://www.bbc.co.uk/news/articles/c3j4jz07e2v8o",
      "imageUrl": "https://ichef.bbci.co.uk/...",
      "source": "BBC News",
      "sourceSlug": "bbc-news",
      "topic": "general",
      "publishedAt": "2026-09-18T10:52:25.275Z",
      "fetchedAt": "2026-09-19T11:00:00.737Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 48,
    "pages": 5
  }
}
```

---

## 4. Editorial Frontend (Vanilla JavaScript)

### Design System Highlights
- **Palette**:
  - `Warm Ivory (#F7F4EE)`: Authentic paper base minimizing optical fatigue.
  - `Ink Black (#171717)`: High-contrast broadsheet editorial typography.
  - `Deep Burgundy (#8B1E2D)`: Editorial accent for active filters and lead categories.
  - `Secondary Slate (#6B6B6B)`: Utility timestamps and reading metadata.
  - `Soft Border (#D9D5CC)`: 1px structural baseline dividing columns and cards.
  - `Muted Gray (#ECE9E2)`: Skeleton loading surfaces.
- **Typography**:
  - `Playfair Display`: Masthead, editorial headlines, and display callouts.
  - `Inter`: Metadata, source chips, buttons, abstracts, and utility text.
- **Geometry**: Strictly razor-sharp `0px` border-radius (`rounded-none`). No simulated drop shadows, glassmorphism, or floating SaaS cards.
- **Lightweight**: Zero framework runtime overhead (production bundle is ~14 kB gzipped).

### Frontend Routing
The client uses a native client-side router based on `history.pushState` and `window.onpopstate`:
- `/`: Broadsheet front page (lead story, briefings ticker, newsroom filters, article grid, pagination).
- `/article/:id`: Perspective detail view (metadata, drop cap excerpt, pullquote, publisher attribution card, external link).
- `/search`: Archival search edition with real-time newsroom breakdown counts and dispatches list.

---

## 5. Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 1. Environment Configuration

In repository root (`.env`):
```env
PORT=2005
MONGO_URI=mongodb://127.0.0.1:27017/morning-dispatch
NODE_ENV=development
NEWS_API_KEY=your_newsapi_org_key
```

In `frontend/.env`:
```env
VITE_API_BASE_URL=/api
```

### 2. Run the Backend Wire Service

From the root directory:
```bash
# Install backend dependencies
npm install

# Start backend server
node server.js
```
The server will connect to MongoDB, perform an initial multi-source ingestion, start the cron scheduler, and listen on port `2005`.

### 3. Run the Frontend Development Server

In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build Frontend for Production

```bash
cd frontend
npm run build
```
Builds the optimized production assets into `frontend/dist/`.

---

## Summary
The Morning Dispatch is a deployed multi-source news aggregation platform. It pulls article metadata from BBC, CNN, Reuters and Fox News through NewsAPI, normalizes the responses into a common schema, generates a deterministic article ID, and uses MongoDB upserts to make ingestion idempotent and prevent duplicates. A node-cron scheduler automatically refreshes the database every 30 minutes, with concurrent source fetching and failure isolation between sources. The data is exposed through an Express REST API supporting pagination, source/topic/date filtering and sorting, with MongoDB indexes for the main query patterns. The frontend is a Vanilla JS/Vite application deployed on Vercel, the backend runs on Render, and MongoDB Atlas provides persistent storage. It’s currently a deployed MVP rather than a high-scale production system; caching, rate limiting, intelligent categorization, search and LLM-based cross-source analysis are future extensions.

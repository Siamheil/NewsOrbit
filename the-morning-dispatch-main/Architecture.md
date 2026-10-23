# The Morning Dispatch — Backend Architecture

> News aggregator backend. Read-only API. Multi-source ingestion via NewsAPI.org. No auth, no uploads, no full article content.

---

## System Overview

```
[ NewsAPI.org ]
      │
      │  HTTP (per source, every 30 min)
      ▼
[ Cron Scheduler ]  ──►  [ Fetcher Service ]  ──►  [ Dedup + Transform ]
                                                            │
                                                       upsert()
                                                            │
                                                            ▼
                                                      [ MongoDB ]
                                                     articles collection
                                                            │
                                                       Mongoose ODM
                                                            │
                                                            ▼
                                                  [ Express Router ]
                                                  GET /articles
                                                  GET /articles/:id
                                                  GET /articles?source=bbc
                                                  GET /articles?topic=technology
                                                            │
                                                            ▼
                                                      [ Client ]


[ LLM Layer ]  ◄── reads ── [ MongoDB ]          (future — not built yet)
cached perspective summaries per topic
```

---

## Layer Breakdown

### 1. External Sources

| Source    | NewsAPI source ID  |
|-----------|--------------------|
| BBC News  | `bbc-news`         |
| Reuters   | `reuters`          |
| CNN       | `cnn`              |
| Fox News  | `fox-news`         |

- All fetched through the **NewsAPI.org** `/v2/top-headlines` endpoint.
- You never talk to BBC/CNN/Reuters directly. NewsAPI normalises the response shape.
- API key stored in `.env` as `NEWS_API_KEY`.

---

### 2. Ingestion Layer

Three responsibilities, deliberately separated into distinct modules.

#### 2a. Cron Scheduler (`src/jobs/scheduler.js`)

- Uses `node-cron`.
- Fires every 30 minutes: `*/30 * * * *`
- Owns **timing only** — calls the fetcher, nothing else.
- If you ever want to change cadence, this is the only file you touch.

```
Cron fires → calls fetchAllSources()
```

#### 2b. Fetcher Service (`src/jobs/fetcher.js`)

- Stateless. Takes a source ID, returns raw NewsAPI articles.
- Makes one HTTP call per source using `axios`.
- Runs all four source fetches in parallel via `Promise.all`.
- Does **not** write to the database.

```
fetchAllSources()
  └─ Promise.all([
       fetchSource('bbc-news'),
       fetchSource('reuters'),
       fetchSource('cnn'),
       fetchSource('fox-news')
     ])
```

#### 2c. Dedup + Transform (`src/jobs/ingestor.js`)

- Takes raw NewsAPI articles, maps them to your clean schema.
- Computes `sourceArticleId` by hashing the article URL (MD5 or SHA-1).
- Writes to MongoDB using `Article.findOneAndUpdate({ sourceArticleId }, data, { upsert: true })`.
- **Upsert** ensures re-fetching the same article never creates duplicates.
- Assigns `topic` based on which NewsAPI category query produced the article.

```
raw article → strip unwanted fields → hash URL → upsert into MongoDB
```

---

### 3. Storage Layer

#### MongoDB — `articles` collection

Single collection. Metadata only — no full article text, no uploaded images.

**Schema fields:**

| Field             | Type     | Description                                  |
|-------------------|----------|----------------------------------------------|
| `title`           | String   | Article headline                             |
| `description`     | String   | Lede / summary from NewsAPI                  |
| `url`             | String   | Canonical link to original article           |
| `imageUrl`        | String   | Top image URL from source                    |
| `source`          | String   | e.g. `bbc-news`, `cnn`, `reuters`            |
| `topic`           | String   | e.g. `technology`, `business`, `world`       |
| `publishedAt`     | Date     | Datetime from the source                     |
| `fetchedAt`       | Date     | Datetime of ingestion                        |
| `sourceArticleId` | String   | Hash of article URL — deduplication key      |

**Indexes:**

| Field             | Reason                                       |
|-------------------|----------------------------------------------|
| `sourceArticleId` | Unique — powers the upsert dedup check       |
| `source`          | Filter by outlet (e.g. all BBC articles)     |
| `topic`           | Filter by topic (e.g. all tech articles)     |
| `publishedAt`     | Sort by recency                              |

#### Mongoose Model (`src/models/Article.js`)

- Replaces the legacy article schema entirely.
- Enforces field types and the unique index on `sourceArticleId`.

---

### 4. API Layer

Read-only. No write routes exposed externally. Ingestion writes directly via the Mongoose model, not through the API.

#### Express Router (`src/routes/articles.js`)

| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| GET    | `/articles`         | All articles, paginated            |
| GET    | `/articles/:id`     | Single article by MongoDB `_id`    |
| GET    | `/articles?source=` | Filter by source (e.g. `bbc-news`) |
| GET    | `/articles?topic=`  | Filter by topic                    |

- **Pagination:** `?page=1&limit=20` (defaults applied in controller).
- **Sorting:** always `publishedAt: -1` (newest first).

#### Error Middleware (`src/middleware/error.js`)

- Existing middleware — **kept as-is**, no changes needed.
- Handles malformed queries and DB errors consistently.

---

### 5. LLM Layer *(future — not built yet)*

- Reads from the same `articles` collection.
- Groups articles by `topic` across sources (e.g. BBC + CNN + Fox coverage of the same story).
- Sends grouped articles to an LLM (OpenAI / Anthropic API).
- Caches the generated perspective summary back into MongoDB (separate `summaries` collection or embedded on the article).
- Served via a new read-only route: `GET /summaries?topic=technology`.
- **Does not touch the ingestion pipeline at all.**

---

## Project Structure

```
src/
├── app.js                  # Express app setup
├── server.js               # Entry point, mongo connection
├── models/
│   └── Article.js          # Mongoose schema (new)
├── routes/
│   └── articles.js         # Read-only GET routes
├── controllers/
│   └── articles.js         # Query logic, pagination
├── jobs/
│   ├── scheduler.js        # node-cron — fires every 30 min
│   ├── fetcher.js          # axios calls to NewsAPI per source
│   └── ingestor.js         # dedup, transform, upsert
├── middleware/
│   └── error.js            # existing error handler (unchanged)
└── config/
    └── sources.js          # source IDs, topic mappings
```

---

## Key Design Decisions

**Ingestion and serving are fully decoupled.**
The cron job writes; the API only reads. If NewsAPI goes down, your API keeps serving the last fetched batch without any errors.

**Upsert, not insert.**
Using `findOneAndUpdate` with `upsert: true` on `sourceArticleId` means the 30-minute job is idempotent. Running it twice produces the same state as running it once.

**No full article content.**
Only metadata is stored. You link out to the original article via `url`. This avoids copyright issues and keeps the collection lean.

**Topic is your assignment, not NewsAPI's.**
You query NewsAPI by category and assign the `topic` field yourself. This gives you control over taxonomy and makes future LLM grouping straightforward.

---

## Environment Variables

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/morning-dispatch
NEWS_API_KEY=your_key_here
```

---

## Dependencies to Add

```bash
npm install axios node-cron
```

Existing deps kept: `express`, `mongoose`, `dotenv`, `axios`, `node-cron`, `cors`.
Removed: `multer`, `bcrypt`, `jsonwebtoken` (already stripped).

---

## Frontend Architecture & Editorial Design System

### 1. Stack & Principles
- **Pure Vanilla JavaScript**: ES modules, native DOM manipulation, and modern browser APIs. Zero runtime framework overhead (React removed).
- **Vite Dev Server & Proxy**: Runs on port `5173`, proxying `/api` requests to `http://localhost:2005` to prevent CORS issues without altering backend server code.
- **Client-Side Routing**: Custom lightweight router in `src/router.js` handling `pushState`, `popstate`, and path parameter extraction (`/`, `/article/:id`, `/search`).

### 2. Editorial Design Language
- **Colors**:
  - Warm Ivory (`#F7F4EE`): Primary substrate reducing eye strain, simulating newsprint.
  - Ink Black (`#171717`): High-contrast typographic voice.
  - Deep Burgundy (`#8B1E2D`): Intellectual accent for active filters and lead category pills.
  - Soft Border (`#D9D5CC`): 1px structural hairline rules dividing cards and columns.
- **Typography**:
  - `Playfair Display`: Broadsheet masthead, hero headlines, and editorial section titles.
  - `Inter`: Utility text, timestamps, source badges, and excerpt abstracts.
- **Geometry**: Razor-sharp right angles (`0px` border-radius) evoking printed newspaper sheets.

### 3. Component Hierarchy
- `masthead.js`: Broadsheet header, edition badge, bureau status, and search link.
- `heroStory.js`: Primary lead story with 16:10 editorial image and fallback placeholder.
- `ticker.js`: "Briefings & Critical Wires" live ticker column.
- `filters.js`: Newsroom source chips and topic filter pills with responsive horizontal scroll.
- `articleCard.js`: Modular broadsheet cards with publisher attribution.
- `pagination.js`: Backend-driven pagination bar.
- `mobileNav.js`: Fixed bottom bar on mobile viewports (<768px).
- `stateViews.js`: Broadsheet empty and error state notifications.
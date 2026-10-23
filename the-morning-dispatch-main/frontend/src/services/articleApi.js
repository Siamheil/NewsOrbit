/**
 * Centralized Article API Service for The Morning Dispatch
 * Consumes: GET /api/article (or ${VITE_API_BASE_URL}/article)
 */

// Automatically resolve base URL: use /api if running via Vite dev proxy to avoid CORS, or custom base
let RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
if (typeof window !== 'undefined' && RAW_BASE_URL.includes('localhost:2005') && window.location.port !== '2005') {
  RAW_BASE_URL = '/api';
}
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

/**
 * Fetch paginated & filtered articles from TMD backend
 * 
 * @param {Object} options
 * @param {number} [options.page=1]
 * @param {number} [options.limit=10]
 * @param {string} [options.source]
 * @param {string} [options.topic]
 * @param {string} [options.from]
 * @param {string} [options.to]
 * @param {string} [options.sort='newest']
 * @returns {Promise<{ articles: Array, pagination: Object }>}
 */
export async function getArticles({
  page = 1,
  limit = 10,
  source,
  topic,
  from,
  to,
  sort = 'newest'
} = {}) {
  const queryParams = new URLSearchParams();

  if (page && page > 1) {
    queryParams.set('page', String(page));
  }
  if (limit) {
    queryParams.set('limit', String(limit));
  }
  if (source && source !== 'all') {
    queryParams.set('source', source);
  }
  if (topic && topic !== 'all') {
    queryParams.set('topic', topic);
  }
  if (from) {
    queryParams.set('from', from);
  }
  if (to) {
    queryParams.set('to', to);
  }
  if (sort && (sort === 'newest' || sort === 'oldest')) {
    queryParams.set('sort', sort);
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/article${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson?.message) {
        errorMessage = errorJson.message;
      }
    } catch {
      // Use fallback error message
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return {
    articles: data.articles || [],
    pagination: data.pagination || {
      page: 1,
      limit: 10,
      total: data.articles?.length || 0,
      pages: 1
    }
  };
}

/**
 * In-memory cache to quickly resolve articles by ID
 */
const articleCache = new Map();

/**
 * Resolve single article by MongoDB `_id` or `sourceArticleId`.
 * 
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getArticleById(id) {
  if (!id) return null;

  if (articleCache.has(id)) {
    return articleCache.get(id);
  }

  // Fetch recent dispatches to resolve
  const { articles } = await getArticles({ limit: 100 });
  for (const article of articles) {
    if (article._id) articleCache.set(article._id, article);
    if (article.sourceArticleId) articleCache.set(article.sourceArticleId, article);
  }

  return articleCache.get(id) || null;
}

/**
 * Editorial Search Service
 * Isolated search capability matching user prompt instruction:
 * "First inspect whether the existing backend supports server-side text search.
 * If it does: use backend search. If it does NOT: implement the cleanest frontend-compatible
 * approach possible and clearly isolate it so backend search can be added later."
 * 
 * @param {Object} options
 * @param {string} options.query
 * @param {string} [options.source]
 * @param {string} [options.topic]
 * @param {number} [options.page=1]
 * @param {number} [options.limit=20]
 */
export async function searchArticles({ query = '', source = 'all', topic = 'all', page = 1, limit = 20 } = {}) {
  // Query backend with max limit (up to 100 supported by backend)
  const { articles } = await getArticles({
    limit: 100,
    source: source !== 'all' ? source : undefined,
    topic: topic !== 'all' ? topic : undefined
  });

  const normalizedQuery = query.trim().toLowerCase();

  let filtered = articles;
  if (normalizedQuery) {
    filtered = articles.filter(article => {
      const titleMatch = article.title?.toLowerCase().includes(normalizedQuery);
      const descMatch = article.description?.toLowerCase().includes(normalizedQuery);
      const topicMatch = article.topic?.toLowerCase().includes(normalizedQuery);
      const sourceMatch = article.source?.toLowerCase().includes(normalizedQuery);
      return titleMatch || descMatch || topicMatch || sourceMatch;
    });
  }

  const total = filtered.length;
  const pages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedArticles = filtered.slice(startIndex, startIndex + limit);

  return {
    articles: paginatedArticles,
    pagination: {
      page,
      limit,
      total,
      pages
    }
  };
}

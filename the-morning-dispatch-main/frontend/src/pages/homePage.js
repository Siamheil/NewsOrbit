import { getArticles } from '../services/articleApi.js';
import { getEditorialDateline } from '../utils/formatters.js';
import { createHeroStoryHTML } from '../components/heroStory.js';
import { createTickerHTML } from '../components/ticker.js';
import { createFiltersHTML, bindFiltersEvents } from '../components/filters.js';
import { createArticleCardHTML } from '../components/articleCard.js';
import { createPaginationHTML, bindPaginationEvents } from '../components/pagination.js';
import { createLoadingSkeletonHTML } from '../components/loadingSkeleton.js';
import { createEmptyStateHTML, createErrorStateHTML } from '../components/stateViews.js';
import { navigate } from '../router.js';

/**
 * Editorial Front Page Renderer
 * 
 * Implements `/`:
 * - Synchronizes with URL search parameters (?source=...&topic=...&sort=...&page=...)
 * - Renders live edition dateline bar
 * - Displays lead hero story (Page 1)
 * - Displays "Briefings & Critical Wires" ticker (Page 1)
 * - Displays newsroom sources and topic filters
 * - Displays multi-column broadsheet article grid
 * - Handles backend-driven pagination
 * - Displays empty and error states when needed
 * 
 * @param {Object} params - Route params
 * @param {URLSearchParams} searchParams - Current URL search parameters
 */
export async function renderHomePage(params, searchParams) {
  const app = document.getElementById('app');
  if (!app) return;

  const currentSource = searchParams.get('source') || 'all';
  const currentTopic = searchParams.get('topic') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Show loading skeleton while fetching real data
  app.innerHTML = `
    <div class="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-4">
      <div class="w-full bg-surface-container-low border border-[#D9D5CC] px-4 py-2 mb-4 flex items-center justify-between text-secondary">
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-2 h-2 rounded-full bg-primary-container animate-pulse shrink-0"></span>
          <span class="font-label-sm text-label-sm text-secondary truncate tracking-wider uppercase font-semibold">
            ${getEditorialDateline()}
          </span>
        </div>
        <span class="font-label-sm text-label-sm text-primary-container font-semibold shrink-0">
          Live Wire Active
        </span>
      </div>
      ${createLoadingSkeletonHTML()}
    </div>
  `;

  try {
    const data = await getArticles({
      page: currentPage,
      limit: 10,
      source: currentSource !== 'all' ? currentSource : undefined,
      topic: currentTopic !== 'all' ? currentTopic : undefined,
      sort: currentSort
    });

    const articles = data.articles || [];
    const pagination = data.pagination || { page: 1, limit: 10, total: 0, pages: 1 };

    // Empty state handling
    if (articles.length === 0) {
      app.innerHTML = `
        <div class="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-4">
          <div class="w-full bg-surface-container-low border border-[#D9D5CC] px-4 py-2 mb-4 flex items-center justify-between text-secondary">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-2 h-2 rounded-full bg-primary-container animate-pulse shrink-0"></span>
              <span class="font-label-sm text-label-sm text-secondary truncate tracking-wider uppercase font-semibold">
                ${getEditorialDateline()}
              </span>
            </div>
            <span class="font-label-sm text-label-sm text-primary-container font-semibold shrink-0">
              Live Wire Active
            </span>
          </div>

          ${createFiltersHTML({ currentSource, currentTopic, currentSort })}

          ${createEmptyStateHTML({ source: currentSource, topic: currentTopic })}
        </div>
      `;

      bindFiltersEvents(app, {
        onSourceChange: (s) => updateParam('source', s),
        onTopicChange: (t) => updateParam('topic', t),
        onSortChange: (sort) => updateParam('sort', sort),
      });

      document.getElementById('empty-clear-filters-btn')?.addEventListener('click', () => {
        navigate('/');
      });
      return;
    }

    // Lead hero is the first article on page 1
    const leadArticle = articles.length > 0 ? articles[0] : null;
    const briefingsArticles = currentPage === 1 && articles.length > 3 ? articles.slice(1, 4) : [];
    const gridArticles = currentPage === 1 ? articles.slice(briefingsArticles.length ? 4 : 1) : articles;

    const cardsMarkup = gridArticles.map(a => createArticleCardHTML(a)).join('');

    app.innerHTML = `
      <div class="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-4">
        <!-- Live Dateline Bar -->
        <div class="w-full bg-surface-container-low border border-[#D9D5CC] px-4 py-2 mb-4 flex items-center justify-between text-secondary">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-2 h-2 rounded-full bg-primary-container animate-pulse shrink-0"></span>
            <span class="font-label-sm text-label-sm text-secondary truncate tracking-wider uppercase font-semibold">
              ${getEditorialDateline()}
            </span>
          </div>
          <span class="font-label-sm text-label-sm text-primary-container font-semibold shrink-0">
            Live Wire Active
          </span>
        </div>

        <!-- Editorial Lead Hero (Page 1 only) -->
        ${currentPage === 1 && leadArticle ? createHeroStoryHTML(leadArticle) : ''}

        <!-- Briefings & Critical Wires (Page 1 only) -->
        ${currentPage === 1 && briefingsArticles.length > 0 ? createTickerHTML(briefingsArticles) : ''}

        <!-- Editorial Filters Bar -->
        ${createFiltersHTML({ currentSource, currentTopic, currentSort })}

        <!-- Broadsheet Article Grid -->
        <div class="w-full">
          <div class="flex items-center justify-between pb-2 mb-4 border-b border-[#D9D5CC]">
            <span class="font-source-tag text-source-tag text-secondary uppercase tracking-widest font-bold">
              Archival Dispatches (${pagination.total} total)
            </span>
            <span class="font-label-sm text-label-sm text-secondary">
              Page ${pagination.page} of ${pagination.pages}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            ${cardsMarkup}
          </div>
        </div>

        <!-- Pagination -->
        ${createPaginationHTML({ currentPage: pagination.page, totalPages: pagination.pages })}
      </div>
    `;

    // Bind event handlers
    bindFiltersEvents(app, {
      onSourceChange: (s) => updateParam('source', s),
      onTopicChange: (t) => updateParam('topic', t),
      onSortChange: (sort) => updateParam('sort', sort),
    });

    bindPaginationEvents(app, {
      currentPage: pagination.page,
      onPageChange: (p) => updateParam('page', p)
    });

    // Bookmark button micro-interactions
    app.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) {
          const isSaved = icon.textContent === 'bookmark';
          icon.textContent = isSaved ? 'bookmark_border' : 'bookmark';
          btn.classList.toggle('text-primary-container', !isSaved);
        }
      });
    });

  } catch (err) {
    console.error('Home page load failed:', err);
    app.innerHTML = `
      <div class="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-4">
        ${createErrorStateHTML(err)}
      </div>
    `;
    document.getElementById('error-retry-btn')?.addEventListener('click', () => {
      renderHomePage(params, searchParams);
    });
  }

  function updateParam(key, value) {
    const newParams = new URLSearchParams(window.location.search);
    if (value && value !== 'all' && (key !== 'sort' || value !== 'newest') && (key !== 'page' || value > 1)) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.delete('page');
    }
    const query = newParams.toString();
    navigate(`/${query ? `?${query}` : ''}`);
  }
}

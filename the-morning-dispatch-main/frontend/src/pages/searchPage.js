import { searchArticles } from '../services/articleApi.js';
import { formatTimeAgo } from '../utils/formatters.js';
import { SOURCES } from '../utils/constants.js';
import { escapeHTML } from '../utils/dom.js';
import { navigate } from '../router.js';

/**
 * Editorial Search Page Renderer
 * 
 * Implements `/search`:
 * - Editorial search input field
 * - Source breakdown filter chips with dynamic match counts
 * - Dispatches list matching query
 * - Empty state when no results match
 * 
 * @param {Object} params - Route params
 * @param {URLSearchParams} searchParams - Query string params (?q=...&source=...)
 */
export async function renderSearchPage(params, searchParams) {
  const app = document.getElementById('app');
  if (!app) return;

  const queryParam = searchParams.get('q') || '';
  const sourceParam = searchParams.get('source') || 'all';

  // Render initial frame with skeleton loading
  app.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 md:px-6 py-4">
      <!-- Top Header -->
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-[#D9D5CC]">
        <a
          href="/"
          class="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider text-secondary hover:text-primary-container transition-colors"
          aria-label="Back to home"
        >
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Home</span>
        </a>

        <h1 class="font-serif font-bold text-sm tracking-wide text-on-surface uppercase">
          Search Edition
        </h1>

        <button
          id="search-share-btn"
          type="button"
          class="text-secondary hover:text-primary-container transition-colors p-1"
          aria-label="Share search"
        >
          <span class="material-symbols-outlined text-[20px]">share</span>
        </button>
      </div>

      <!-- Editorial Search Bar -->
      <form id="search-form" class="mb-4">
        <div class="flex items-center gap-2 w-full">
          <div class="flex-1 flex items-center bg-surface-container-lowest border border-[#D9D5CC] px-3 py-2 focus-within:border-primary-container transition-colors">
            <span class="material-symbols-outlined text-secondary text-[20px] mr-2">search</span>
            <input
              id="search-input-field"
              type="text"
              value="${escapeHTML(queryParam)}"
              placeholder="Search articles, topics, publishers..."
              class="w-full bg-transparent font-body-md text-on-surface placeholder:text-secondary/70 focus:outline-none"
            />
            ${queryParam ? `
              <button
                type="button"
                id="search-clear-btn"
                aria-label="Clear search"
                class="w-6 h-6 flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
              >
                <span class="material-symbols-outlined text-[16px]">close</span>
              </button>
            ` : ''}
          </div>
          <button
            type="submit"
            class="h-10 px-4 bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold hover:bg-primary transition-colors flex items-center justify-center"
          >
            Search
          </button>
        </div>
      </form>

      <!-- Skeleton loading -->
      <div class="space-y-4 animate-pulse">
        ${[1, 2, 3].map(() => `
          <div class="bg-surface-container-lowest border border-[#D9D5CC] p-4 space-y-2">
            <div class="h-3.5 w-32 bg-[#ECE9E2]"></div>
            <div class="h-6 w-full bg-[#DCD9D9]"></div>
            <div class="h-28 w-full bg-[#ECE9E2]"></div>
            <div class="h-4 w-5/6 bg-[#ECE9E2]"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  bindSearchForm();

  try {
    const data = await searchArticles({
      query: queryParam,
      source: sourceParam,
      limit: 50
    });
    const results = data.articles || [];

    // Fetch all for accurate per-source match counts
    const allData = await searchArticles({
      query: queryParam,
      source: 'all',
      limit: 100
    });
    const allArticles = allData.articles || [];

    const getSourceCount = (slug) => {
      if (slug === 'all') return allArticles.length;
      return allArticles.filter(
        a => a.sourceSlug === slug || a.source?.toLowerCase().includes(slug.replace('-news', ''))
      ).length;
    };

    // Source filter chips
    const sourceChipsMarkup = SOURCES.map(s => {
      const isActive = sourceParam === s.slug;
      const count = getSourceCount(s.slug);
      return `
        <button
          type="button"
          data-source="${s.slug}"
          class="search-source-btn shrink-0 px-3 py-1.5 font-label-sm text-label-sm uppercase tracking-wider font-semibold transition-colors border ${
            isActive
              ? 'bg-primary-container border-primary-container text-on-primary'
              : 'bg-surface-container-high border-[#D9D5CC] text-on-surface hover:bg-surface-container-highest'
          }"
        >
          ${s.name} (${count})
        </button>
      `;
    }).join('');

    // Results feed or empty state
    let resultsMarkup = '';
    if (results.length === 0) {
      resultsMarkup = `
        <div class="bg-surface-container-lowest border border-[#D9D5CC] p-8 text-center my-6">
          <span class="material-symbols-outlined text-4xl text-secondary mb-2">find_in_page</span>
          <h2 class="font-serif text-xl font-bold uppercase mb-2 text-on-surface">
            No Archival Dispatches Match
          </h2>
          <p class="font-body-md text-secondary max-w-sm mx-auto mb-4">
            Try revising your query or clearing source filters to expand results across all accredited bureaus.
          </p>
          <button
            id="search-reset-btn"
            type="button"
            class="bg-primary-container text-on-primary font-label-sm text-label-sm uppercase px-4 py-2 hover:bg-primary transition-colors"
          >
            Reset Search
          </button>
        </div>
      `;
    } else {
      resultsMarkup = `
        <div class="flex flex-col gap-4">
          ${results.map(article => {
            const articleId = article._id || article.sourceArticleId;
            const timeAgo = formatTimeAgo(article.publishedAt, true);

            const imageTag = article.imageUrl ? `
              <div class="w-full h-40 bg-surface-container overflow-hidden my-1 relative border border-[#D9D5CC]">
                <img
                  src="${escapeHTML(article.imageUrl)}"
                  alt="${escapeHTML(article.title)}"
                  class="w-full h-full object-cover grayscale-[10%] contrast-[105%]"
                  loading="lazy"
                  onerror="this.parentElement.style.display='none';"
                />
                <span class="absolute bottom-2 right-2 bg-inverse-surface/85 text-inverse-on-surface font-label-sm text-label-sm px-1.5 py-0.5 uppercase tracking-widest">
                  Wire Telemetry
                </span>
              </div>
            ` : '';

            return `
              <article class="bg-surface-container-lowest border border-[#D9D5CC] p-4 flex flex-col gap-2 hover:border-on-surface transition-all group">
                <div class="flex items-center justify-between font-label-sm text-label-sm">
                  <div class="flex items-center gap-2">
                    <span class="font-source-tag text-source-tag text-primary-container tracking-widest uppercase font-bold">
                      ${escapeHTML(article.source)}
                    </span>
                    <span class="text-secondary">•</span>
                    <span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                      ${escapeHTML(article.topic || 'General')}
                    </span>
                  </div>
                  <div class="flex items-center gap-1 text-secondary font-label-sm text-label-sm">
                    <span class="material-symbols-outlined text-[14px]">schedule</span>
                    <span>${timeAgo}</span>
                  </div>
                </div>

                <a href="/article/${articleId}">
                  <h2 class="font-serif text-lg md:text-xl font-semibold text-on-surface leading-snug group-hover:text-primary-container transition-colors">
                    ${escapeHTML(article.title)}
                  </h2>
                </a>

                ${imageTag}

                ${article.description ? `
                  <p class="font-body-md text-secondary line-clamp-3 leading-relaxed">
                    ${escapeHTML(article.description)}
                  </p>
                ` : ''}

                <div class="pt-2 border-t border-[#D9D5CC]/60 flex items-center justify-between">
                  <span class="bg-surface-container border border-[#D9D5CC] px-2 py-0.5 font-label-sm text-label-sm text-on-surface uppercase font-medium">
                    ${escapeHTML(article.topic || 'General')}
                  </span>

                  <a
                    href="/article/${articleId}"
                    class="text-primary-container hover:text-primary flex items-center gap-1 font-label-sm text-label-sm uppercase font-semibold transition-colors"
                  >
                    <span>Read Dispatch</span>
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </a>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      `;
    }

    app.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 md:px-6 py-4">
        <!-- Top Header -->
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-[#D9D5CC]">
          <a
            href="/"
            class="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider text-secondary hover:text-primary-container transition-colors"
            aria-label="Back to home"
          >
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Home</span>
          </a>

          <h1 class="font-serif font-bold text-sm tracking-wide text-on-surface uppercase">
            Search Edition
          </h1>

          <button
            id="search-share-btn"
            type="button"
            class="text-secondary hover:text-primary-container transition-colors p-1"
            aria-label="Share search"
          >
            <span class="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>

        <!-- Editorial Search Bar -->
        <form id="search-form" class="mb-4">
          <div class="flex items-center gap-2 w-full">
            <div class="flex-1 flex items-center bg-surface-container-lowest border border-[#D9D5CC] px-3 py-2 focus-within:border-primary-container transition-colors">
              <span class="material-symbols-outlined text-secondary text-[20px] mr-2">search</span>
              <input
                id="search-input-field"
                type="text"
                value="${escapeHTML(queryParam)}"
                placeholder="Search articles, topics, publishers..."
                class="w-full bg-transparent font-body-md text-on-surface placeholder:text-secondary/70 focus:outline-none"
              />
              ${queryParam ? `
                <button
                  type="button"
                  id="search-clear-btn"
                  aria-label="Clear search"
                  class="w-6 h-6 flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
                >
                  <span class="material-symbols-outlined text-[16px]">close</span>
                </button>
              ` : ''}
            </div>
            <button
              type="submit"
              class="h-10 px-4 bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold hover:bg-primary transition-colors flex items-center justify-center"
            >
              Search
            </button>
          </div>
        </form>

        <!-- Results Header Matrix -->
        <div class="flex items-center justify-between py-1 text-secondary border-b border-[#D9D5CC] mb-3">
          <span class="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
            Showing ${results.length} Dispatches ${queryParam ? `for "${escapeHTML(queryParam)}"` : 'in Archive'}
          </span>
          <span class="font-label-sm text-label-sm text-primary-container font-medium">
            Archival Indexed
          </span>
        </div>

        <!-- Source Filter Chips with Counts -->
        <div class="w-full overflow-x-auto py-1 flex gap-2 no-scrollbar mb-4">
          ${sourceChipsMarkup}
        </div>

        <!-- Results Feed or Empty -->
        ${resultsMarkup}
      </div>
    `;

    bindSearchForm();

    // Source chip clicks
    app.querySelectorAll('.search-source-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-source');
        const newParams = new URLSearchParams(window.location.search);
        if (selected !== 'all') {
          newParams.set('source', selected);
        } else {
          newParams.delete('source');
        }
        const qs = newParams.toString();
        navigate(`/search${qs ? `?${qs}` : ''}`);
      });
    });

    document.getElementById('search-reset-btn')?.addEventListener('click', () => {
      navigate('/search');
    });

    document.getElementById('search-share-btn')?.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: 'The Morning Dispatch — Search', url: window.location.href });
      } else {
        navigator.clipboard.writeText(window.location.href);
      }
    });

  } catch (err) {
    console.error('Search failed:', err);
  }

  function bindSearchForm() {
    document.getElementById('search-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('search-input-field')?.value.trim();
      const newParams = new URLSearchParams(window.location.search);
      if (val) {
        newParams.set('q', val);
      } else {
        newParams.delete('q');
      }
      const qs = newParams.toString();
      navigate(`/search${qs ? `?${qs}` : ''}`);
    });

    document.getElementById('search-clear-btn')?.addEventListener('click', () => {
      const newParams = new URLSearchParams(window.location.search);
      newParams.delete('q');
      const qs = newParams.toString();
      navigate(`/search${qs ? `?${qs}` : ''}`);
    });
  }
}

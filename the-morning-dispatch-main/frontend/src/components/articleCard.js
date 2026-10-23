import { formatTimeAgo } from '../utils/formatters.js';
import { escapeHTML } from '../utils/dom.js';

/**
 * Reusable Article Card Component
 * 
 * Broadsheet card used across the main feed and search results:
 * - Source badge + topic badge
 * - Publication timestamp
 * - Optional image viewport with lazy loading
 * - Playfair Display headline
 * - Abstract excerpt
 * - "Open Dispatch" link
 * - Bookmark button
 * 
 * @param {Object} article - The article data model from backend
 * @returns {string} HTML markup string
 */
export function createArticleCardHTML(article) {
  if (!article) return '';

  const articleId = article._id || article.sourceArticleId;
  const timeAgo = formatTimeAgo(article.publishedAt, true);
  const topicUpper = (article.topic || 'General').toUpperCase();
  const sourceUpper = (article.source || 'Wire').toUpperCase();

  const imageMarkup = article.imageUrl ? `
    <div class="w-full h-40 md:h-44 bg-surface-container overflow-hidden mb-3 border border-[#D9D5CC]">
      <img
        src="${escapeHTML(article.imageUrl)}"
        alt="${escapeHTML(article.title)}"
        class="w-full h-full object-cover grayscale-[10%] contrast-[105%] group-hover:scale-[1.02] transition-transform duration-300"
        loading="lazy"
        onerror="this.parentElement.style.display='none';"
      />
    </div>
  ` : '';

  return `
    <article class="bg-surface-container-lowest p-4 md:p-5 border border-[#D9D5CC] flex flex-col justify-between hover:border-on-surface hover:bg-white transition-all group">
      <div>
        <!-- Top Metadata Line -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="font-source-tag text-source-tag text-primary-container font-bold tracking-wider uppercase">
              ${sourceUpper}
            </span>
            <span class="text-secondary text-label-sm">•</span>
            <span class="font-source-tag text-source-tag text-secondary uppercase tracking-wider">
              ${topicUpper}
            </span>
          </div>
          <span class="font-label-sm text-label-sm text-secondary">
            ${timeAgo}
          </span>
        </div>

        <!-- Thumbnail Image -->
        ${imageMarkup}

        <!-- Headline -->
        <a href="/article/${articleId}">
          <h3 class="font-serif text-lg md:text-xl font-bold text-on-surface mb-2 leading-snug group-hover:text-primary-container group-hover:underline decoration-1 underline-offset-2 transition-colors">
            ${escapeHTML(article.title)}
          </h3>
        </a>

        <!-- Excerpt -->
        ${article.description ? `
          <p class="font-body-md text-secondary line-clamp-2 md:line-clamp-3 mb-3 leading-relaxed">
            ${escapeHTML(article.description)}
          </p>
        ` : ''}
      </div>

      <!-- Footer / CTA -->
      <div class="flex items-center justify-between pt-3 border-t border-[#D9D5CC]/60 mt-2">
        <a
          href="/article/${articleId}"
          class="font-label-sm text-label-sm font-semibold uppercase text-primary-container flex items-center gap-1 hover:text-primary transition-colors"
        >
          <span>Open Dispatch</span>
          <span class="material-symbols-outlined text-[14px]">north_east</span>
        </a>

        <button
          type="button"
          class="bookmark-btn text-secondary hover:text-primary-container p-1 transition-colors"
          title="Save for later"
          aria-label="Save for later"
        >
          <span class="material-symbols-outlined text-[18px]">bookmark_border</span>
        </button>
      </div>
    </article>
  `;
}

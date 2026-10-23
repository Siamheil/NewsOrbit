import { formatTimeAgo } from '../utils/formatters.js';
import { escapeHTML } from '../utils/dom.js';

/**
 * Briefings & Critical Wires Ticker Component
 * 
 * Displays 3 secondary wire dispatches beneath the hero story
 * with live pulse indicator and concise newspaper cards.
 * 
 * @param {Array<Object>} articles - List of secondary articles to display
 * @returns {string} HTML markup string
 */
export function createTickerHTML(articles = []) {
  if (!articles || articles.length === 0) return '';

  const cardsMarkup = articles.slice(0, 3).map(article => {
    const articleId = article._id || article.sourceArticleId;
    const timeAgo = formatTimeAgo(article.publishedAt);
    const topicUpper = (article.topic || 'General').toUpperCase();
    const sourceUpper = (article.source || 'Wire').toUpperCase();

    return `
      <a
        href="/article/${articleId}"
        class="bg-surface-container-lowest p-3.5 border border-[#D9D5CC] flex flex-col justify-between hover:border-on-surface hover:bg-white transition-all group"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="font-source-tag text-source-tag text-primary-container font-bold uppercase tracking-wider">
              ${topicUpper}
            </span>
            <span class="font-label-sm text-label-sm text-secondary">
              ${sourceUpper} · ${timeAgo}
            </span>
          </div>
          <h3 class="font-serif text-base font-semibold text-on-surface leading-snug group-hover:text-primary-container transition-colors line-clamp-2">
            ${escapeHTML(article.title)}
          </h3>
        </div>

        <div class="mt-3 pt-2 border-t border-[#D9D5CC]/50 flex items-center justify-between text-secondary">
          <span class="font-label-sm text-[11px] text-primary-container uppercase font-medium group-hover:underline">
            Read Dispatch →
          </span>
        </div>
      </a>
    `;
  }).join('');

  return `
    <section class="w-full mb-6 flex flex-col gap-3.5 bg-surface-container-low p-4 md:p-5 border border-[#D9D5CC]">
      <div class="flex items-center justify-between pb-1 border-b border-[#D9D5CC]">
        <h2 class="font-source-tag text-source-tag uppercase tracking-widest text-secondary font-bold">
          Briefings &amp; Critical Wires
        </h2>
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
          <span class="font-label-sm text-label-sm text-primary-container uppercase font-semibold">
            Live Ticker
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        ${cardsMarkup}
      </div>
    </section>
  `;
}

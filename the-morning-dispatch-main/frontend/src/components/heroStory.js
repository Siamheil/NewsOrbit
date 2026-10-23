import { formatTimeAgo } from '../utils/formatters.js';
import { escapeHTML } from '../utils/dom.js';

/**
 * Lead Hero Story Component
 * 
 * Renders the primary broadsheet lead article with:
 * - Prominent 16:10 aspect ratio image (with high-contrast editorial fallback)
 * - Category badge (e.g. WORLD · LEAD)
 * - Metadata line (Source, separator bullet, published time)
 * - Playfair Display headline
 * - Abstract / excerpt
 * - "Read Full Coverage" action link to /article/:id
 * 
 * @param {Object} article - The article data model from MongoDB
 * @returns {string} HTML markup string
 */
export function createHeroStoryHTML(article) {
  if (!article) return '';

  const articleId = article._id || article.sourceArticleId;
  const timeAgo = formatTimeAgo(article.publishedAt);
  const topicUpper = (article.topic || 'General').toUpperCase();
  const sourceUpper = (article.source || 'Wire Service').toUpperCase();

  // If image fails to load or is missing, use broadsheet editorial placeholder
  const imageMarkup = article.imageUrl ? `
    <img
      src="${escapeHTML(article.imageUrl)}"
      alt="${escapeHTML(article.title)}"
      class="w-full h-full object-cover grayscale-[15%] contrast-[105%] hover:scale-[1.01] transition-transform duration-500"
      loading="eager"
      onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-full h-full flex flex-col items-center justify-center bg-surface-container-low text-secondary p-6 text-center\\'><span class=\\'material-symbols-outlined text-5xl mb-2 text-secondary/60\\'>newspaper</span><span class=\\'font-source-tag text-source-tag uppercase tracking-widest text-primary-container font-bold\\'>Dispatch Lead Wire</span></div>';"
    />
  ` : `
    <div class="w-full h-full flex flex-col items-center justify-center bg-surface-container-low text-secondary p-6 text-center">
      <span class="material-symbols-outlined text-5xl mb-2 text-secondary/60">newspaper</span>
      <span class="font-source-tag text-source-tag uppercase tracking-widest text-primary-container font-bold">
        Dispatch Lead Wire
      </span>
      <span class="font-serif italic text-sm text-secondary/80 mt-1 max-w-sm line-clamp-1">
        ${escapeHTML(article.source)} Archive Telemetry
      </span>
    </div>
  `;

  return `
    <article class="w-full bg-surface-container-lowest border border-[#D9D5CC] flex flex-col p-4 md:p-6 mb-6">
      <!-- Editorial Image Viewport -->
      <div class="relative w-full aspect-[16/10] overflow-hidden bg-surface-container mb-4 border border-[#D9D5CC]">
        ${imageMarkup}
        <div class="absolute top-3 left-3 bg-primary-container text-on-primary font-source-tag text-source-tag px-2.5 py-1 uppercase tracking-widest font-bold shadow-sm">
          ${topicUpper} · LEAD
        </div>
      </div>

      <!-- Metadata Line -->
      <div class="flex items-center gap-2 mb-2">
        <span class="font-source-tag text-source-tag text-primary-container font-bold tracking-wider uppercase">
          ${sourceUpper}
        </span>
        <span class="text-secondary text-label-sm">•</span>
        <span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
          ${timeAgo || 'Recent'}
        </span>
      </div>

      <!-- Lead Headline -->
      <a href="/article/${articleId}" class="group">
        <h1 class="font-serif text-2xl md:text-3xl lg:text-4xl text-on-surface font-bold mb-3 leading-tight tracking-tight group-hover:text-primary-container transition-colors">
          ${escapeHTML(article.title)}
        </h1>
      </a>

      <!-- Abstract / Excerpt -->
      ${article.description ? `
        <p class="font-body-md text-secondary mb-5 leading-relaxed line-clamp-3">
          ${escapeHTML(article.description)}
        </p>
      ` : ''}

      <!-- Action CTA Bar -->
      <div class="flex items-center justify-between pt-2 border-t border-[#D9D5CC]">
        <a
          href="/article/${articleId}"
          class="inline-flex items-center gap-1.5 text-primary-container font-label-md text-label-md font-semibold tracking-wider uppercase hover:text-primary transition-colors"
        >
          <span>Read Full Coverage</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </a>

        <button
          type="button"
          class="save-dispatch-btn p-1 text-secondary hover:text-primary-container transition-colors"
          title="Save for later"
          aria-label="Save for later"
        >
          <span class="material-symbols-outlined text-[20px]">bookmark_add</span>
        </button>
      </div>
    </article>
  `;
}

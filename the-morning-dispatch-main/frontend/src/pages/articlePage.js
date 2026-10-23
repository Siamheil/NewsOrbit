import { getArticleById, getArticles } from '../services/articleApi.js';
import { formatPublishedDate, formatTimeAgo } from '../utils/formatters.js';
import { escapeHTML } from '../utils/dom.js';
import { navigate } from '../router.js';

/**
 * Article Perspective Detail Page Renderer
 * 
 * Implements the editorial view for `/article/:id`:
 * - Back navigation to feed
 * - Breadcrumbs: Home / Topic / Source
 * - Headline, metadata, and editorial dateline
 * - Large image viewport with caption
 * - Editorial summary notice & verification pill
 * - Drop cap excerpt and pullquote
 * - Primary CTA: "Read Original Article on [Source]" -> opens external URL (target="_blank" rel="noopener noreferrer")
 * - More from Source related articles
 * 
 * @param {Object} params - Route params (e.g. { id: '...' })
 */
export async function renderArticlePage(params) {
  const app = document.getElementById('app');
  if (!app) return;

  const articleId = params?.id;

  // Render initial skeleton loader
  app.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 md:px-8 py-8 animate-pulse space-y-4">
      <div class="h-4 w-32 bg-[#ECE9E2]"></div>
      <div class="h-10 w-full bg-[#DCD9D9]"></div>
      <div class="h-6 w-3/4 bg-[#DCD9D9]"></div>
      <div class="h-64 w-full bg-[#ECE9E2]"></div>
      <div class="h-4 w-full bg-[#ECE9E2]"></div>
      <div class="h-4 w-5/6 bg-[#ECE9E2]"></div>
    </div>
  `;

  try {
    const article = await getArticleById(articleId);
    if (!article) {
      renderNotFound();
      return;
    }

    // Fetch related articles from same newsroom
    let relatedArticles = [];
    try {
      const relData = await getArticles({
        source: article.sourceSlug || article.source,
        limit: 4
      });
      relatedArticles = (relData.articles || []).filter(
        a => (a._id || a.sourceArticleId) !== (article._id || article.sourceArticleId)
      ).slice(0, 3);
    } catch {
      // Related articles are non-critical
    }

    const topicName = article.topic || 'General';
    const sourceName = article.source || 'Wire Service';
    const publishedText = formatPublishedDate(article.publishedAt);
    const firstLetter = article.description ? article.description.charAt(0).toUpperCase() : 'T';
    const remainingDesc = article.description ? article.description.slice(1) : '';

    const imageMarkup = article.imageUrl ? `
      <figure class="flex flex-col w-full mb-6 border border-[#D9D5CC]">
        <div class="relative w-full aspect-[16/10] overflow-hidden bg-surface-container">
          <img
            src="${escapeHTML(article.imageUrl)}"
            alt="${escapeHTML(article.title)}"
            class="w-full h-full object-cover grayscale-[10%] contrast-[105%]"
            onerror="this.parentElement.parentElement.style.display='none';"
          />
          <div class="absolute top-2.5 right-2.5 bg-inverse-surface/85 text-inverse-on-surface px-2 py-0.5 font-label-sm text-label-sm uppercase tracking-wider">
            ${escapeHTML(sourceName)} Wire
          </div>
        </div>
        <figcaption class="p-2.5 bg-surface-container-low font-label-sm text-label-sm text-secondary border-t border-[#D9D5CC]">
          Photograph / Transmission feed via ${escapeHTML(sourceName)} accredited archives.
        </figcaption>
      </figure>
    ` : '';

    const relatedMarkup = relatedArticles.length > 0 ? `
      <section class="mt-8 pt-6 border-t border-[#D9D5CC]">
        <div class="flex items-baseline justify-between mb-4">
          <h2 class="font-serif text-xl font-bold text-on-surface">
            More from ${escapeHTML(sourceName)}
          </h2>
          <span class="font-source-tag text-source-tag text-primary-container uppercase font-bold tracking-wider">
            Accredited Bureau
          </span>
        </div>

        <div class="flex flex-col gap-3">
          ${relatedArticles.map(rel => {
            const relId = rel._id || rel.sourceArticleId;
            const relTime = formatTimeAgo(rel.publishedAt);
            return `
              <a
                href="/article/${relId}"
                class="bg-surface-container-lowest p-4 border border-[#D9D5CC] flex flex-col gap-1 hover:border-on-surface transition-all group"
              >
                <div class="flex items-center justify-between text-secondary font-label-sm text-label-sm">
                  <span class="font-source-tag text-source-tag text-primary-container font-bold">
                    ${escapeHTML(sourceName.toUpperCase())}
                  </span>
                  <span>${relTime}</span>
                </div>
                <h3 class="font-serif text-base font-semibold text-on-surface group-hover:text-primary-container transition-colors">
                  ${escapeHTML(rel.title)}
                </h3>
                ${rel.description ? `
                  <p class="font-body-sm text-secondary line-clamp-2">
                    ${escapeHTML(rel.description)}
                  </p>
                ` : ''}
                <span class="text-primary-container font-label-sm text-label-sm uppercase font-semibold mt-1 flex items-center gap-1">
                  <span>Read dispatch</span>
                  <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                </span>
              </a>
            `;
          }).join('')}
        </div>
      </section>
    ` : '';

    app.innerHTML = `
      <article class="max-w-3xl mx-auto px-4 md:px-6 py-6">
        <!-- Top Header Bar with Back Button -->
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-[#D9D5CC]">
          <button
            id="article-back-btn"
            type="button"
            class="inline-flex items-center gap-1.5 font-label-sm text-label-sm uppercase tracking-wider text-secondary hover:text-primary-container transition-colors"
            aria-label="Go back"
          >
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Dispatches</span>
          </button>

          <span class="font-serif font-bold text-sm tracking-wide text-on-surface uppercase">
            Article Perspective
          </span>

          <button
            id="article-share-btn"
            type="button"
            class="text-secondary hover:text-primary-container transition-colors p-1"
            title="Share article"
            aria-label="Share article"
          >
            <span class="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>

        <!-- Breadcrumb Navigation -->
        <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 font-label-sm text-label-sm text-secondary mb-3">
          <a href="/" class="hover:text-primary-container transition-colors">Home</a>
          <span>/</span>
          <a href="/?topic=${encodeURIComponent(topicName.toLowerCase())}" class="hover:text-primary-container capitalize transition-colors">
            ${escapeHTML(topicName)}
          </a>
          <span>/</span>
          <span class="text-on-surface font-semibold">${escapeHTML(sourceName)}</span>
        </nav>

        <!-- Topic & Wire Badge -->
        <div class="flex items-center gap-2 mb-3">
          <span class="bg-primary-container text-on-primary px-2.5 py-0.5 uppercase font-source-tag text-source-tag font-bold tracking-wider">
            ${escapeHTML(topicName)}
          </span>
          <span class="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-secondary">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
            <span>Diplomatic Wire</span>
          </span>
        </div>

        <!-- Headline -->
        <h1 class="font-serif text-2xl sm:text-3xl md:text-4xl text-on-surface font-bold tracking-tight mb-4 leading-tight">
          ${escapeHTML(article.title)}
        </h1>

        <!-- Description Lead -->
        ${article.description ? `
          <p class="font-body-lg text-secondary leading-relaxed mb-6">
            ${escapeHTML(article.description)}
          </p>
        ` : ''}

        <!-- Source & Published Dateline Card -->
        <div class="bg-surface-container-low border border-[#D9D5CC] p-3.5 flex flex-col gap-1 mb-6">
          <div class="flex items-center justify-between">
            <span class="font-source-tag text-source-tag text-primary-container font-bold uppercase tracking-widest">
              Source: ${escapeHTML(sourceName)}
            </span>
            <div class="flex items-center gap-2">
              <button
                id="article-bookmark-btn"
                type="button"
                aria-label="Bookmark dispatch"
                class="text-secondary hover:text-primary-container transition-colors p-1"
              >
                <span class="material-symbols-outlined text-[18px]">bookmark_border</span>
              </button>
              <button
                id="article-copy-btn"
                type="button"
                aria-label="Copy link"
                class="text-secondary hover:text-primary-container transition-colors p-1"
              >
                <span class="material-symbols-outlined text-[18px]">link</span>
              </button>
            </div>
          </div>
          <span class="font-label-sm text-label-sm text-secondary">
            Published ${publishedText}
          </span>
        </div>

        <!-- Featured Image -->
        ${imageMarkup}

        <!-- Editorial Fact-Check Bar -->
        <div class="flex items-center justify-between bg-surface-container-high px-4 py-2 border border-[#D9D5CC] mb-6">
          <div class="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm">
            <span class="material-symbols-outlined text-[16px]">schedule</span>
            <span>Accredited newsroom dispatch</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-tertiary"></span>
            <span class="font-label-sm text-label-sm text-tertiary font-bold tracking-wider uppercase">
              Accredited Feed
            </span>
          </div>
        </div>

        <!-- Article Body Excerpt & Typography -->
        <div class="font-body-md text-on-surface leading-relaxed space-y-4 mb-8">
          ${article.description ? `
            <p>
              <span class="font-serif text-3xl md:text-4xl text-primary-container float-left mr-2 leading-none font-bold">
                ${escapeHTML(firstLetter)}
              </span>
              ${escapeHTML(remainingDesc)}
            </p>
          ` : ''}

          <!-- Editorial Pullquote -->
          <blockquote class="my-4 bg-surface-container-low border-l-4 border-primary-container p-4">
            <p class="font-serif text-base md:text-lg italic text-on-surface leading-normal mb-1">
              "Reporting accredited and syndicated directly from wire newsrooms worldwide, maintaining strict archival integrity."
            </p>
            <footer class="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
              — The Morning Dispatch Editorial Desk
            </footer>
          </blockquote>
        </div>

        <!-- External Publisher Attribution & Primary CTA Block -->
        <section class="bg-surface-container-lowest border border-[#D9D5CC] p-5 md:p-6 mb-8 flex flex-col gap-4 shadow-sm">
          <div class="flex items-start justify-between gap-3">
            <div class="flex flex-col">
              <span class="font-source-tag text-source-tag text-primary-container font-bold uppercase tracking-widest">
                Source: ${escapeHTML(sourceName)}
              </span>
              <span class="font-label-sm text-label-sm text-secondary mt-0.5">
                Original publication: ${publishedText}
              </span>
            </div>
            <div class="w-8 h-8 border border-[#D9D5CC] bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span class="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>

          <p class="font-body-sm text-secondary">
            The Morning Dispatch aggregates and attributes reporting from accredited newsrooms worldwide. Original report includes full text, annexes, and live publisher updates.
          </p>

          <!-- Primary CTA Button (External Link with target="_blank" rel="noopener noreferrer") -->
          <a
            href="${escapeHTML(article.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full bg-primary-container hover:bg-primary active:scale-[0.99] text-on-primary py-3 px-4 font-serif text-base md:text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>Read Original Article on ${escapeHTML(sourceName)}</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>

          <div class="flex items-center justify-center gap-1.5 font-label-sm text-label-sm text-secondary text-center">
            <span class="material-symbols-outlined text-[14px]">open_in_new</span>
            <span>Leaves app &amp; opens external accredited archive</span>
          </div>
        </section>

        <!-- More from Source Section -->
        ${relatedMarkup}
      </article>
    `;

    // Bind event handlers
    document.getElementById('article-back-btn')?.addEventListener('click', () => {
      window.history.back();
    });

    document.getElementById('article-copy-btn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      const icon = document.querySelector('#article-copy-btn .material-symbols-outlined');
      if (icon) {
        icon.textContent = 'check';
        setTimeout(() => { icon.textContent = 'link'; }, 2000);
      }
    });

    document.getElementById('article-share-btn')?.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: article.title, url: window.location.href });
      } else {
        navigator.clipboard.writeText(window.location.href);
      }
    });

    document.getElementById('article-bookmark-btn')?.addEventListener('click', function() {
      const icon = this.querySelector('.material-symbols-outlined');
      if (icon) {
        const isSaved = icon.textContent === 'bookmark';
        icon.textContent = isSaved ? 'bookmark_border' : 'bookmark';
        this.classList.toggle('text-primary-container', !isSaved);
      }
    });

  } catch (err) {
    console.error('Failed to load article:', err);
    renderNotFound();
  }

  function renderNotFound() {
    app.innerHTML = `
      <div class="max-w-2xl mx-auto px-4 py-12 text-center">
        <h2 class="font-serif text-2xl font-bold mb-3 text-on-surface">
          ARTICLE PERSPECTIVE UNAVAILABLE
        </h2>
        <p class="font-body-md text-secondary mb-6">
          This article could not be retrieved from the wire repository.
        </p>
        <button
          id="not-found-home-btn"
          class="bg-primary-container text-on-primary font-label-md text-label-md uppercase px-4 py-2 hover:bg-primary transition-colors inline-flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Return to Front Page</span>
        </button>
      </div>
    `;
    document.getElementById('not-found-home-btn')?.addEventListener('click', () => {
      navigate('/');
    });
  }
}

/**
 * State Views: Empty & Error Presentations
 * 
 * Implements broadsheet error handling and empty states:
 * - EmptyState: "ARCHIVAL QUERY DISPATCH — NO STORIES FOUND" with clear filters button
 * - ErrorState: "DESPATCH INTERRUPTION NOTICE" with retry connection and Syndication Ledger
 */

/**
 * Generates the HTML markup for empty search/filter queries.
 * 
 * @param {Object} options
 * @param {string} [options.source='all'] - Currently active source filter
 * @param {string} [options.topic='all'] - Currently active topic filter
 * @returns {string} HTML markup string
 */
export function createEmptyStateHTML({ source = 'all', topic = 'all' } = {}) {
  return `
    <div class="w-full my-6 bg-surface-container-lowest border border-[#D9D5CC] p-6 md:p-10 flex flex-col items-center text-center relative">
      <div class="absolute top-0 left-0 right-0 h-1 bg-primary-container"></div>

      <!-- Editorial Architectural Icon (Broadsheet Loupe SVG) -->
      <div class="w-16 h-16 bg-surface-container-low border border-[#D9D5CC] flex items-center justify-center my-4 text-primary-container">
        <svg
          class="w-8 h-8 text-primary-container"
          fill="none"
          stroke="currentColor"
          stroke-linecap="square"
          stroke-width="1.25"
          viewBox="0 0 32 32"
        >
          <rect fill="none" height="22" stroke="currentColor" width="16" x="5" y="4"></rect>
          <line stroke="currentColor" x1="8" x2="16" y1="8" y2="8"></line>
          <line stroke="currentColor" x1="8" x2="18" y1="12" y2="12"></line>
          <line stroke="currentColor" x1="8" x2="15" y1="16" y2="16"></line>
          <line stroke="currentColor" x1="8" x2="17" y1="20" y2="20"></line>
          <circle cx="21" cy="20" fill="currentColor" fill-opacity="0.08" r="5" stroke="currentColor" stroke-width="1.5"></circle>
          <line stroke="currentColor" stroke-linecap="square" stroke-width="2" x1="24.5" x2="28" y1="23.5" y2="27"></line>
        </svg>
      </div>

      <!-- Editorial Typography Block -->
      <span class="font-source-tag text-source-tag text-primary-container tracking-widest uppercase mb-1 font-bold">
        ARCHIVAL QUERY DISPATCH
      </span>
      <h2 class="font-serif text-2xl md:text-3xl font-bold uppercase tracking-tight text-on-surface mb-2">
        NO STORIES FOUND
      </h2>
      <p class="font-body-md text-secondary max-w-md mt-1 mb-6 leading-relaxed">
        There are currently no articles matching your selected ${source !== 'all' ? `source (${source})` : 'filters'} ${topic !== 'all' ? `and topic (${topic})` : ''} within this timeframe. Try broadening your criteria.
      </p>

      <div class="w-full max-w-sm flex flex-col gap-2.5">
        <button
          id="empty-clear-filters-btn"
          type="button"
          class="w-full bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider py-3 px-4 hover:bg-primary transition-colors flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[16px]">filter_alt_off</span>
          <span>Clear All Filters</span>
        </button>
      </div>

      <div class="mt-6 pt-4 border-t border-[#D9D5CC]/50 flex items-center gap-1.5 text-secondary">
        <span class="material-symbols-outlined text-[15px]">info</span>
        <span class="font-label-sm text-label-sm">Wire crawlers index every 90 seconds</span>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML markup for network/API fetch interruptions.
 * 
 * @param {Error|Object} error - Error instance or error message
 * @returns {string} HTML markup string
 */
export function createErrorStateHTML(error) {
  return `
    <div class="w-full my-6 bg-surface-container-lowest border border-[#D9D5CC] p-6 md:p-8 flex flex-col relative">
      <div class="flex items-center justify-between pb-3 mb-4 bg-surface-container-low -mx-6 md:-mx-8 px-6 md:px-8 py-2.5 border-b border-[#D9D5CC]">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-primary-container">cloud_off</span>
          <span class="font-source-tag text-source-tag text-primary-container uppercase font-bold tracking-wider">
            DESPATCH INTERRUPTION NOTICE
          </span>
        </div>
        <span class="font-label-sm text-label-sm text-secondary font-mono">
          CODE: SYNC_206
        </span>
      </div>

      <h3 class="font-serif text-xl md:text-2xl font-bold tracking-tight text-on-surface mb-2">
        UNABLE TO LOAD THE LATEST STORIES
      </h3>
      <p class="font-body-md text-secondary leading-relaxed mb-6 max-w-xl">
        ${error?.message || 'We experienced an interruption connecting to the publisher wire feeds. Our newsroom aggregation service is reconnecting.'}
      </p>

      <div class="flex items-center gap-3 mb-6 max-w-md">
        <button
          id="error-retry-btn"
          type="button"
          class="flex-1 bg-surface-container border border-[#D9D5CC] text-primary-container font-label-md text-label-md uppercase tracking-wider py-2.5 px-4 hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[16px]">refresh</span>
          <span>Retry Connection</span>
        </button>
      </div>

      <!-- Teleprinter Wire Feed Status Ticker -->
      <div class="bg-surface-container-low border border-[#D9D5CC] p-3 flex flex-col gap-1.5 max-w-xl">
        <div class="flex items-center justify-between text-secondary">
          <span class="font-label-sm text-[11px] font-semibold uppercase tracking-widest">
            Syndication Ledger
          </span>
          <span class="font-source-tag text-[10px] text-secondary font-bold">
            MULTI-BUREAU POOL
          </span>
        </div>
        <div class="font-label-sm text-xs font-mono tracking-tight text-on-surface py-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span class="inline-flex items-center gap-1">
            <span class="font-semibold">BBC</span>
            <span class="text-tertiary font-bold bg-surface-container px-1 py-0.5 border border-[#D9D5CC]">[OK]</span>
          </span>
          <span class="text-[#DEBFBF]">·</span>
          <span class="inline-flex items-center gap-1">
            <span class="font-semibold">CNN</span>
            <span class="text-tertiary font-bold bg-surface-container px-1 py-0.5 border border-[#D9D5CC]">[OK]</span>
          </span>
          <span class="text-[#DEBFBF]">·</span>
          <span class="inline-flex items-center gap-1">
            <span class="font-semibold">REUTERS</span>
            <span class="text-primary-container font-bold bg-surface-container px-1 py-0.5 border border-[#D9D5CC]">[STANDBY]</span>
          </span>
          <span class="text-[#DEBFBF]">·</span>
          <span class="inline-flex items-center gap-1">
            <span class="font-semibold">FOX NEWS</span>
            <span class="text-tertiary font-bold bg-surface-container px-1 py-0.5 border border-[#D9D5CC]">[OK]</span>
          </span>
        </div>
      </div>
    </div>
  `;
}

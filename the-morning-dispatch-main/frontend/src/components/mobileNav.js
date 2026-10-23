export function renderMobileNav() {
  const container = document.getElementById('mobile-nav-container');
  if (!container) return;

  const pathname = window.location.pathname;
  const search = window.location.search;

  const isHome = pathname === '/' && !search.includes('sort=newest');
  const isLatest = pathname === '/' && search.includes('sort=newest');
  const isSearch = pathname === '/search';

  container.innerHTML = `
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe bg-surface/95 backdrop-blur-md border-t border-[#D9D5CC] shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <div class="flex justify-around items-center h-16 px-2">
        <a
          href="/"
          class="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] transition-colors ${
            isHome ? 'text-primary-container font-semibold' : 'text-secondary hover:text-primary-container'
          }"
        >
          <span class="material-symbols-outlined text-[22px]">newspaper</span>
          <span class="font-label-sm text-[10px] uppercase mt-0.5">Home</span>
        </a>

        <a
          href="/?sort=newest"
          class="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] transition-colors ${
            isLatest ? 'text-primary-container font-semibold' : 'text-secondary hover:text-primary-container'
          }"
        >
          <span class="material-symbols-outlined text-[22px]">bolt</span>
          <span class="font-label-sm text-[10px] uppercase mt-0.5">Latest</span>
        </a>

        <a
          href="#newsroom-sources"
          class="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] text-secondary hover:text-primary-container transition-colors"
        >
          <span class="material-symbols-outlined text-[22px]">source</span>
          <span class="font-label-sm text-[10px] uppercase mt-0.5">Sources</span>
        </a>

        <a
          href="/search"
          class="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] transition-colors ${
            isSearch ? 'text-primary-container font-semibold' : 'text-secondary hover:text-primary-container'
          }"
        >
          <span class="material-symbols-outlined text-[22px]">search</span>
          <span class="font-label-sm text-[10px] uppercase mt-0.5">Search</span>
        </a>
      </div>
    </nav>
  `;
}

// Re-render on route changes
window.addEventListener('tmd:routechange', () => {
  renderMobileNav();
});

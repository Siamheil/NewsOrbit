import { EDITION_NO } from '../utils/constants.js';
import { navigate } from '../router.js';

let mobileMenuOpen = false;

export function renderMasthead() {
  const container = document.getElementById('masthead-container');
  if (!container) return;

  const pathname = window.location.pathname;
  const isHome = pathname === '/';
  const isSearch = pathname === '/search';

  container.innerHTML = `
    <header class="sticky top-0 w-full z-40 bg-surface/95 backdrop-blur-md border-b border-[#D9D5CC] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div class="max-w-[1360px] mx-auto px-4 md:px-8 py-2.5">
        <div class="flex items-center justify-between">
          <!-- Mobile Hamburger / Desktop Nav -->
          <div class="flex items-center gap-4">
            <button
              id="masthead-hamburger-btn"
              class="md:hidden w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary-container transition-colors"
              aria-label="Toggle navigation menu"
            >
              <span class="material-symbols-outlined text-[24px]">
                ${mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

            <!-- Desktop Left Nav Links -->
            <nav class="hidden md:flex items-center gap-6 font-label-md text-label-md uppercase tracking-wider text-secondary">
              <a
                href="/"
                class="hover:text-primary-container transition-colors ${
                  isHome ? 'text-primary-container font-semibold border-b-2 border-primary-container pb-0.5' : ''
                }"
              >
                Home
              </a>
              <a
                href="/?sort=newest"
                class="hover:text-primary-container transition-colors"
              >
                Latest
              </a>
              <a
                href="#newsroom-sources"
                class="hover:text-primary-container transition-colors"
              >
                Sources
              </a>
            </nav>
          </div>

          <!-- Central Newspaper Masthead Title & Tagline -->
          <div class="flex flex-col items-center justify-center text-center py-1">
            <a href="/" class="group inline-flex flex-col items-center">
              <h1 class="font-serif text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-on-surface group-hover:text-primary-container transition-colors uppercase">
                The Morning Dispatch
              </h1>
              <span class="font-label-sm text-[10px] md:text-xs text-secondary uppercase tracking-[0.2em] mt-0.5">
                Your morning, across every newsroom
              </span>
            </a>
          </div>

          <!-- Right Controls: Search & Monogram -->
          <div class="flex items-center gap-2 md:gap-3 justify-end">
            <button
              id="masthead-search-btn"
              class="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary-container hover:bg-surface-container transition-colors ${
                isSearch ? 'text-primary-container bg-surface-container' : ''
              }"
              aria-label="Search dispatches"
              title="Search dispatches"
            >
              <span class="material-symbols-outlined text-[22px]">search</span>
            </button>

            <div class="w-8 h-8 rounded-none border border-[#D9D5CC] bg-surface-container-lowest flex items-center justify-center font-serif font-bold text-xs text-primary-container">
              TMD
            </div>
          </div>
        </div>

        <!-- Edition Dateline Sub-bar -->
        <div class="flex items-center justify-between border-t border-[#D9D5CC] mt-2 pt-1.5 text-secondary text-[11px]">
          <span class="font-source-tag text-source-tag text-primary-container font-bold">
            EDITION NO. ${EDITION_NO}
          </span>
          <span class="font-label-sm text-label-sm font-semibold text-on-surface hidden sm:inline">
            Home Dispatch
          </span>
          <span class="font-source-tag text-source-tag text-secondary tracking-wider uppercase">
            BBC • CNN • REUTERS • FOX
          </span>
        </div>
      </div>

      <!-- Mobile Drawer Menu -->
      <div id="masthead-mobile-drawer" class="${mobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-[#D9D5CC] bg-surface-container-lowest px-4 py-4 flex-col gap-3 shadow-md">
        <a
          href="/"
          class="mobile-drawer-link font-label-md text-label-md uppercase tracking-wider text-on-surface py-2 border-b border-[#D9D5CC] flex items-center justify-between"
        >
          <span>Home Dispatch</span>
          <span class="material-symbols-outlined text-[18px]">newspaper</span>
        </a>
        <a
          href="/?sort=newest"
          class="mobile-drawer-link font-label-md text-label-md uppercase tracking-wider text-on-surface py-2 border-b border-[#D9D5CC] flex items-center justify-between"
        >
          <span>Latest Wire</span>
          <span class="material-symbols-outlined text-[18px]">bolt</span>
        </a>
        <a
          href="#newsroom-sources"
          class="mobile-drawer-link font-label-md text-label-md uppercase tracking-wider text-on-surface py-2 border-b border-[#D9D5CC] flex items-center justify-between"
        >
          <span>Accredited Sources</span>
          <span class="material-symbols-outlined text-[18px]">source</span>
        </a>
        <a
          href="/search"
          class="mobile-drawer-link font-label-md text-label-md uppercase tracking-wider text-primary-container py-2 flex items-center justify-between"
        >
          <span>Search Archival Dispatches</span>
          <span class="material-symbols-outlined text-[18px]">search</span>
        </a>
      </div>
    </header>
  `;

  // Attach search button click
  document.getElementById('masthead-search-btn')?.addEventListener('click', () => {
    navigate('/search');
  });

  // Attach mobile hamburger toggle
  document.getElementById('masthead-hamburger-btn')?.addEventListener('click', () => {
    mobileMenuOpen = !mobileMenuOpen;
    renderMasthead();
  });

  // Close mobile drawer on link click
  container.querySelectorAll('.mobile-drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuOpen = false;
      renderMasthead();
    });
  });
}

// Re-render masthead on route changes to update active states
window.addEventListener('tmd:routechange', () => {
  renderMasthead();
});

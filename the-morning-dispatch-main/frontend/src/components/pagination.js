export function createPaginationHTML({ currentPage = 1, totalPages = 1 }) {
  if (totalPages <= 1) return '';

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  const pages = [];
  const delta = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  const pagesMarkup = pages.map((p, idx) => {
    if (p === '…') {
      return `
        <span class="w-5 h-7 flex items-center justify-center text-secondary font-label-sm text-label-sm">
          …
        </span>
      `;
    }
    const isCurrent = p === currentPage;
    return `
      <button
        type="button"
        data-page="${p}"
        class="page-number-btn w-7 h-7 flex items-center justify-center font-label-sm text-label-sm transition-colors ${
          isCurrent
            ? 'bg-primary-container text-on-primary font-bold'
            : 'text-on-surface hover:bg-surface-container font-medium'
        }"
      >
        ${p}
      </button>
    `;
  }).join('');

  return `
    <div class="w-full px-4 py-5 flex items-center justify-between bg-surface-container-lowest border border-[#D9D5CC] my-6">
      <!-- Previous Button -->
      <button
        type="button"
        id="pagination-prev-btn"
        ${isFirst ? 'disabled' : ''}
        class="px-3 py-1.5 font-label-sm text-label-sm uppercase font-semibold flex items-center gap-1 transition-colors ${
          isFirst
            ? 'text-secondary/50 cursor-not-allowed'
            : 'text-on-surface hover:text-primary-container'
        }"
      >
        <span class="material-symbols-outlined text-[14px]">arrow_back</span>
        <span>Previous</span>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        ${pagesMarkup}
      </div>

      <!-- Next Button -->
      <button
        type="button"
        id="pagination-next-btn"
        ${isLast ? 'disabled' : ''}
        class="px-3 py-1.5 font-label-sm text-label-sm uppercase font-semibold flex items-center gap-1 transition-colors ${
          isLast
            ? 'text-secondary/50 cursor-not-allowed'
            : 'text-on-surface hover:text-primary-container'
        }"
      >
        <span>Next</span>
        <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
      </button>
    </div>
  `;
}

export function bindPaginationEvents(container, { currentPage, onPageChange }) {
  const prevBtn = container.querySelector('#pagination-prev-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1 && onPageChange) onPageChange(currentPage - 1);
    });
  }

  const nextBtn = container.querySelector('#pagination-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (onPageChange) onPageChange(currentPage + 1);
    });
  }

  container.querySelectorAll('.page-number-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.getAttribute('data-page'), 10);
      if (page && onPageChange) onPageChange(page);
    });
  });
}

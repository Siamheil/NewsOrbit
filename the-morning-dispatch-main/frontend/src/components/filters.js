import { SOURCES, TOPICS, SORT_OPTIONS } from '../utils/constants.js';

export function createFiltersHTML({ currentSource = 'all', currentTopic = 'all', currentSort = 'newest' }) {
  const sourcesMarkup = SOURCES.map(s => {
    const isActive = currentSource === s.slug;
    return `
      <button
        type="button"
        data-source="${s.slug}"
        class="source-filter-btn px-3 py-1.5 font-label-sm text-label-sm uppercase whitespace-nowrap border transition-all ${
          isActive
            ? 'bg-primary-container border-primary-container text-on-primary font-bold shadow-sm'
            : 'bg-surface-container-low border-[#D9D5CC] text-secondary hover:text-on-surface hover:bg-surface-container font-medium'
        }"
      >
        ${s.name}
      </button>
    `;
  }).join('');

  const topicsMarkup = TOPICS.map(t => {
    const isActive = currentTopic === t.slug;
    return `
      <button
        type="button"
        data-topic="${t.slug}"
        class="topic-filter-btn px-2.5 py-1 font-label-sm text-label-sm uppercase whitespace-nowrap border transition-all ${
          isActive
            ? 'bg-[#171717] border-[#171717] text-white font-bold'
            : 'bg-surface border-transparent text-secondary hover:text-on-surface hover:bg-surface-container-low font-medium'
        }"
      >
        ${t.name}
      </button>
    `;
  }).join('');

  const sortOptionsMarkup = SORT_OPTIONS.map(opt => `
    <option value="${opt.value}" ${currentSort === opt.value ? 'selected' : ''}>
      ${opt.label}
    </option>
  `).join('');

  return `
    <div class="w-full bg-surface-container-lowest p-4 border border-[#D9D5CC] mb-6 flex flex-col gap-3" id="newsroom-sources">
      <!-- Header Row: Label & Sort Toggle -->
      <div class="flex items-center justify-between pb-1 border-b border-[#D9D5CC]">
        <span class="font-source-tag text-source-tag text-secondary uppercase tracking-widest font-bold">
          Dispatches by Newsroom
        </span>

        <div class="flex items-center gap-1">
          <label for="sort-select" class="sr-only">Sort order</label>
          <div class="relative inline-flex items-center">
            <select
              id="sort-select"
              class="appearance-none bg-surface-container-low border border-[#D9D5CC] px-2.5 py-1 pr-6 font-label-sm text-label-sm text-on-surface font-medium cursor-pointer focus:outline-none focus:border-primary-container"
            >
              ${sortOptionsMarkup}
            </select>
            <span class="material-symbols-outlined text-[16px] text-secondary pointer-events-none absolute right-1.5">
              expand_more
            </span>
          </div>
        </div>
      </div>

      <!-- Row 1: Source Filter Buttons -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        ${sourcesMarkup}
      </div>

      <!-- Row 2: Topic Filter Buttons -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar border-t border-[#D9D5CC]/40 pt-2">
        ${topicsMarkup}
      </div>
    </div>
  `;
}

export function bindFiltersEvents(container, { onSourceChange, onTopicChange, onSortChange }) {
  container.querySelectorAll('.source-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const source = btn.getAttribute('data-source');
      if (onSourceChange) onSourceChange(source);
    });
  });

  container.querySelectorAll('.topic-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const topic = btn.getAttribute('data-topic');
      if (onTopicChange) onTopicChange(topic);
    });
  });

  const sortSelect = container.querySelector('#sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      if (onSortChange) onSortChange(e.target.value);
    });
  }
}

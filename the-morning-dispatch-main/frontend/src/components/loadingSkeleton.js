export function createLoadingSkeletonHTML() {
  return `
    <div class="w-full space-y-4 animate-pulse">
      <!-- Live Sync Editorial Status Notice -->
      <div class="w-full bg-surface-container-low border border-[#D9D5CC] p-3 flex items-center justify-between shadow-sm">
        <div class="flex items-center space-x-2 min-w-0">
          <span class="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <p class="font-serif text-xs md:text-sm italic text-on-surface truncate">
            Retrieving dispatches from BBC, CNN, Reuters, Fox News...
          </p>
        </div>
        <span class="font-source-tag text-source-tag text-primary-container uppercase tracking-wider flex-shrink-0 ml-2 font-bold">
          Syncing
        </span>
      </div>

      <!-- Editorial Dateline Bar Skeleton -->
      <div class="flex items-center justify-between py-1">
        <div class="h-3.5 w-36 bg-[#ECE9E2]"></div>
        <div class="h-3.5 w-20 bg-[#ECE9E2]"></div>
      </div>

      <!-- Lead Hero Story Skeleton -->
      <div class="bg-surface-container-lowest border border-[#D9D5CC] p-4 md:p-6 space-y-3">
        <div class="relative w-full aspect-[16/10] bg-[#ECE9E2] border border-[#D9D5CC] flex flex-col items-center justify-center overflow-hidden">
          <div class="flex flex-col items-center opacity-30">
            <span class="material-symbols-outlined text-4xl text-secondary">newspaper</span>
            <span class="font-serif text-xs tracking-widest uppercase mt-1 text-secondary font-semibold">
              Dispatch Hero
            </span>
          </div>
        </div>
        <div class="flex items-center space-x-2 pt-1">
          <div class="h-4 w-20 bg-primary-container/20"></div>
          <div class="h-2 w-2 rounded-full bg-[#DCD9D9]"></div>
          <div class="h-3.5 w-16 bg-[#ECE9E2]"></div>
        </div>
        <div class="space-y-2 pt-1">
          <div class="h-6 w-[92%] bg-[#DCD9D9]"></div>
          <div class="h-6 w-[80%] bg-[#DCD9D9]"></div>
          <div class="h-6 w-[65%] bg-[#DCD9D9]"></div>
        </div>
        <div class="space-y-1.5 pt-2">
          <div class="h-4 w-full bg-[#ECE9E2]"></div>
          <div class="h-4 w-[86%] bg-[#ECE9E2]"></div>
        </div>
      </div>

      <!-- Secondary Cards Feed Skeletons -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${[1, 2, 3, 4, 5, 6].map(() => `
          <div class="bg-surface-container-lowest border border-[#D9D5CC] p-4 flex flex-col justify-between space-y-3">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="h-3.5 w-16 bg-primary-container/20"></div>
                <div class="h-3 w-12 bg-[#ECE9E2]"></div>
              </div>
              <div class="h-24 w-full bg-[#ECE9E2]"></div>
              <div class="h-5 w-[90%] bg-[#DCD9D9]"></div>
              <div class="h-5 w-[70%] bg-[#DCD9D9]"></div>
              <div class="h-3.5 w-full bg-[#ECE9E2]"></div>
            </div>
            <div class="h-4 w-24 bg-[#ECE9E2] pt-2"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

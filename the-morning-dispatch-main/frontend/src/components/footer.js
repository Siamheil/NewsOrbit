export function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  container.innerHTML = `
    <footer class="w-full mt-12 bg-surface-container-low border-t border-[#D9D5CC] py-8 px-4 md:px-8 flex flex-col items-center text-center gap-2">
      <span class="font-serif text-lg md:text-xl uppercase tracking-wider text-on-surface font-bold">
        The Morning Dispatch
      </span>
      <p class="font-label-sm text-label-sm text-secondary max-w-sm">
        Strictly uncurated multi-bureau telemetry. Geneva · London · Washington · Tokyo
      </p>
      <div className="flex items-center gap-2 text-secondary text-[11px] mt-1">
        <span class="inline-block w-1.5 h-1.5 bg-primary-container mr-1"></span>
        <span class="font-source-tag text-source-tag uppercase tracking-widest font-semibold">
          The Dispatch Engine
        </span>
        <span class="inline-block w-1.5 h-1.5 bg-primary-container ml-1"></span>
      </div>
      <span class="font-source-tag text-[10px] text-secondary tracking-widest mt-1">
        © 2026 THE MORNING DISPATCH ARCHIVE LTD. ALL RIGHTS RESERVED.
      </span>
    </footer>
  `;
}

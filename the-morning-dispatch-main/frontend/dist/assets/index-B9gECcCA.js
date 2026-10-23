(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();let R=[],T=null;function U(e,a){R=e.map(t=>({...t,pattern:O(t.path)})),T=a}function O(e){const a=[],t="^"+e.replace(/:([a-zA-Z0-9_]+)/g,(n,s)=>(a.push(s),"([^/]+)"))+"$";return{regex:new RegExp(t),paramNames:a}}function P(e){for(const a of R){const t=e.match(a.pattern.regex);if(t){const n={};return a.pattern.paramNames.forEach((s,r)=>{n[s]=decodeURIComponent(t[r+1])}),{handler:a.handler,params:n,path:a.path}}}return null}function A(){const e=window.location.pathname,a=new URLSearchParams(window.location.search),t=P(e);window.dispatchEvent(new CustomEvent("tmd:routechange",{detail:{pathname:e,searchParams:a}})),t?t.handler(t.params,a):T&&T()}function v(e,a=!1){a?window.history.replaceState(null,"",e):window.history.pushState(null,"",e),A(),window.scrollTo({top:0,behavior:"smooth"})}function F(){window.addEventListener("popstate",A),document.addEventListener("click",e=>{const a=e.target.closest("a");if(!a)return;const t=a.getAttribute("href"),n=a.getAttribute("target");!t||n==="_blank"||t.startsWith("http")||t.startsWith("mailto:")||t.startsWith("tel:")||t.startsWith("#")||(e.preventDefault(),v(t))}),A()}const H=[{slug:"all",name:"All Sources",shortName:"All"},{slug:"bbc-news",name:"BBC News",shortName:"BBC"},{slug:"cnn",name:"CNN",shortName:"CNN"},{slug:"reuters",name:"Reuters",shortName:"Reuters"},{slug:"fox-news",name:"Fox News",shortName:"Fox"}],q=[{slug:"all",name:"All Topics"},{slug:"general",name:"General"},{slug:"world",name:"World"},{slug:"business",name:"Business"},{slug:"technology",name:"Technology"},{slug:"politics",name:"Politics"},{slug:"science",name:"Science"},{slug:"sports",name:"Sports"}],W=[{value:"newest",label:"Sort: Newest"},{value:"oldest",label:"Sort: Oldest"}],G="4,892";let D=!1;function $(){var s,r;const e=document.getElementById("masthead-container");if(!e)return;const a=window.location.pathname,t=a==="/",n=a==="/search";e.innerHTML=`
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
                ${D?"close":"menu"}
              </span>
            </button>

            <!-- Desktop Left Nav Links -->
            <nav class="hidden md:flex items-center gap-6 font-label-md text-label-md uppercase tracking-wider text-secondary">
              <a
                href="/"
                class="hover:text-primary-container transition-colors ${t?"text-primary-container font-semibold border-b-2 border-primary-container pb-0.5":""}"
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
              class="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary-container hover:bg-surface-container transition-colors ${n?"text-primary-container bg-surface-container":""}"
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
            EDITION NO. ${G}
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
      <div id="masthead-mobile-drawer" class="${D?"block":"hidden"} md:hidden border-t border-[#D9D5CC] bg-surface-container-lowest px-4 py-4 flex-col gap-3 shadow-md">
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
  `,(s=document.getElementById("masthead-search-btn"))==null||s.addEventListener("click",()=>{v("/search")}),(r=document.getElementById("masthead-hamburger-btn"))==null||r.addEventListener("click",()=>{D=!D,$()}),e.querySelectorAll(".mobile-drawer-link").forEach(o=>{o.addEventListener("click",()=>{D=!1,$()})})}window.addEventListener("tmd:routechange",()=>{$()});function z(){const e=document.getElementById("footer-container");e&&(e.innerHTML=`
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
  `)}function _(){const e=document.getElementById("mobile-nav-container");if(!e)return;const a=window.location.pathname,t=window.location.search,n=a==="/"&&!t.includes("sort=newest"),s=a==="/"&&t.includes("sort=newest"),r=a==="/search";e.innerHTML=`
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe bg-surface/95 backdrop-blur-md border-t border-[#D9D5CC] shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <div class="flex justify-around items-center h-16 px-2">
        <a
          href="/"
          class="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] transition-colors ${n?"text-primary-container font-semibold":"text-secondary hover:text-primary-container"}"
        >
          <span class="material-symbols-outlined text-[22px]">newspaper</span>
          <span class="font-label-sm text-[10px] uppercase mt-0.5">Home</span>
        </a>

        <a
          href="/?sort=newest"
          class="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] transition-colors ${s?"text-primary-container font-semibold":"text-secondary hover:text-primary-container"}"
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
          class="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] transition-colors ${r?"text-primary-container font-semibold":"text-secondary hover:text-primary-container"}"
        >
          <span class="material-symbols-outlined text-[22px]">search</span>
          <span class="font-label-sm text-[10px] uppercase mt-0.5">Search</span>
        </a>
      </div>
    </nav>
  `}window.addEventListener("tmd:routechange",()=>{_()});let j="/api";typeof window<"u"&&j.includes("localhost:2005")&&window.location.port!=="2005"&&(j="/api");const V=j.replace(/\/+$/,"");async function S({page:e=1,limit:a=10,source:t,topic:n,from:s,to:r,sort:o="newest"}={}){var f;const l=new URLSearchParams;e&&e>1&&l.set("page",String(e)),a&&l.set("limit",String(a)),t&&t!=="all"&&l.set("source",t),n&&n!=="all"&&l.set("topic",n),s&&l.set("from",s),r&&l.set("to",r),o&&(o==="newest"||o==="oldest")&&l.set("sort",o);const c=l.toString(),x=`${V}/article${c?`?${c}`:""}`,m=await fetch(x,{headers:{Accept:"application/json"}});if(!m.ok){let g=`HTTP error ${m.status}: ${m.statusText}`;try{const b=await m.json();b!=null&&b.message&&(g=b.message)}catch{}throw new Error(g)}const p=await m.json();return{articles:p.articles||[],pagination:p.pagination||{page:1,limit:10,total:((f=p.articles)==null?void 0:f.length)||0,pages:1}}}const k=new Map;async function K(e){if(!e)return null;if(k.has(e))return k.get(e);const{articles:a}=await S({limit:100});for(const t of a)t._id&&k.set(t._id,t),t.sourceArticleId&&k.set(t.sourceArticleId,t);return k.get(e)||null}async function M({query:e="",source:a="all",topic:t="all",page:n=1,limit:s=20}={}){const{articles:r}=await S({limit:100,source:a!=="all"?a:void 0,topic:t!=="all"?t:void 0}),o=e.trim().toLowerCase();let l=r;o&&(l=r.filter(f=>{var i,y,w,C;const g=(i=f.title)==null?void 0:i.toLowerCase().includes(o),b=(y=f.description)==null?void 0:y.toLowerCase().includes(o),u=(w=f.topic)==null?void 0:w.toLowerCase().includes(o),h=(C=f.source)==null?void 0:C.toLowerCase().includes(o);return g||b||u||h}));const c=l.length,x=Math.ceil(c/s)||1,m=(n-1)*s;return{articles:l.slice(m,m+s),pagination:{page:n,limit:s,total:c,pages:x}}}function E(e,a=!1){if(!e)return"";const t=new Date(e);if(isNaN(t.getTime()))return"";const s=Math.max(0,Math.floor((new Date().getTime()-t.getTime())/1e3));if(s<60)return a?"just now":"Just now";const r=Math.floor(s/60);if(r<60)return a?`${r}m ago`:`${r} ${r===1?"minute":"minutes"} ago`;const o=Math.floor(r/60);if(o<24)return`${o}h ago`;const l=Math.floor(o/24);return l<30?`${l} ${l===1?"day":"days"} ago`:t.toLocaleDateString("en-US",{month:"short",day:"numeric"})}function Y(e){if(!e)return"";const a=new Date(e);if(isNaN(a.getTime()))return"";const t=a.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}),n=String(a.getUTCHours()).padStart(2,"0"),s=String(a.getUTCMinutes()).padStart(2,"0");return`${t} · ${n}:${s} GMT`}function L(){const e=new Date,a={weekday:"long",month:"long",day:"numeric",year:"numeric"};return`${e.toLocaleDateString("en-US",a)} · Global Edition`}function d(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function Q(e){if(!e)return"";const a=e._id||e.sourceArticleId,t=E(e.publishedAt),n=(e.topic||"General").toUpperCase(),s=(e.source||"Wire Service").toUpperCase();return`
    <article class="w-full bg-surface-container-lowest border border-[#D9D5CC] flex flex-col p-4 md:p-6 mb-6">
      <!-- Editorial Image Viewport -->
      <div class="relative w-full aspect-[16/10] overflow-hidden bg-surface-container mb-4 border border-[#D9D5CC]">
        ${e.imageUrl?`
    <img
      src="${d(e.imageUrl)}"
      alt="${d(e.title)}"
      class="w-full h-full object-cover grayscale-[15%] contrast-[105%] hover:scale-[1.01] transition-transform duration-500"
      loading="eager"
      onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-full h-full flex flex-col items-center justify-center bg-surface-container-low text-secondary p-6 text-center\\'><span class=\\'material-symbols-outlined text-5xl mb-2 text-secondary/60\\'>newspaper</span><span class=\\'font-source-tag text-source-tag uppercase tracking-widest text-primary-container font-bold\\'>Dispatch Lead Wire</span></div>';"
    />
  `:`
    <div class="w-full h-full flex flex-col items-center justify-center bg-surface-container-low text-secondary p-6 text-center">
      <span class="material-symbols-outlined text-5xl mb-2 text-secondary/60">newspaper</span>
      <span class="font-source-tag text-source-tag uppercase tracking-widest text-primary-container font-bold">
        Dispatch Lead Wire
      </span>
      <span class="font-serif italic text-sm text-secondary/80 mt-1 max-w-sm line-clamp-1">
        ${d(e.source)} Archive Telemetry
      </span>
    </div>
  `}
        <div class="absolute top-3 left-3 bg-primary-container text-on-primary font-source-tag text-source-tag px-2.5 py-1 uppercase tracking-widest font-bold shadow-sm">
          ${n} · LEAD
        </div>
      </div>

      <!-- Metadata Line -->
      <div class="flex items-center gap-2 mb-2">
        <span class="font-source-tag text-source-tag text-primary-container font-bold tracking-wider uppercase">
          ${s}
        </span>
        <span class="text-secondary text-label-sm">•</span>
        <span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
          ${t||"Recent"}
        </span>
      </div>

      <!-- Lead Headline -->
      <a href="/article/${a}" class="group">
        <h1 class="font-serif text-2xl md:text-3xl lg:text-4xl text-on-surface font-bold mb-3 leading-tight tracking-tight group-hover:text-primary-container transition-colors">
          ${d(e.title)}
        </h1>
      </a>

      <!-- Abstract / Excerpt -->
      ${e.description?`
        <p class="font-body-md text-secondary mb-5 leading-relaxed line-clamp-3">
          ${d(e.description)}
        </p>
      `:""}

      <!-- Action CTA Bar -->
      <div class="flex items-center justify-between pt-2 border-t border-[#D9D5CC]">
        <a
          href="/article/${a}"
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
  `}function X(e=[]){return!e||e.length===0?"":`
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
        ${e.slice(0,3).map(t=>{const n=t._id||t.sourceArticleId,s=E(t.publishedAt),r=(t.topic||"General").toUpperCase(),o=(t.source||"Wire").toUpperCase();return`
      <a
        href="/article/${n}"
        class="bg-surface-container-lowest p-3.5 border border-[#D9D5CC] flex flex-col justify-between hover:border-on-surface hover:bg-white transition-all group"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="font-source-tag text-source-tag text-primary-container font-bold uppercase tracking-wider">
              ${r}
            </span>
            <span class="font-label-sm text-label-sm text-secondary">
              ${o} · ${s}
            </span>
          </div>
          <h3 class="font-serif text-base font-semibold text-on-surface leading-snug group-hover:text-primary-container transition-colors line-clamp-2">
            ${d(t.title)}
          </h3>
        </div>

        <div class="mt-3 pt-2 border-t border-[#D9D5CC]/50 flex items-center justify-between text-secondary">
          <span class="font-label-sm text-[11px] text-primary-container uppercase font-medium group-hover:underline">
            Read Dispatch →
          </span>
        </div>
      </a>
    `}).join("")}
      </div>
    </section>
  `}function I({currentSource:e="all",currentTopic:a="all",currentSort:t="newest"}){const n=H.map(o=>{const l=e===o.slug;return`
      <button
        type="button"
        data-source="${o.slug}"
        class="source-filter-btn px-3 py-1.5 font-label-sm text-label-sm uppercase whitespace-nowrap border transition-all ${l?"bg-primary-container border-primary-container text-on-primary font-bold shadow-sm":"bg-surface-container-low border-[#D9D5CC] text-secondary hover:text-on-surface hover:bg-surface-container font-medium"}"
      >
        ${o.name}
      </button>
    `}).join(""),s=q.map(o=>{const l=a===o.slug;return`
      <button
        type="button"
        data-topic="${o.slug}"
        class="topic-filter-btn px-2.5 py-1 font-label-sm text-label-sm uppercase whitespace-nowrap border transition-all ${l?"bg-[#171717] border-[#171717] text-white font-bold":"bg-surface border-transparent text-secondary hover:text-on-surface hover:bg-surface-container-low font-medium"}"
      >
        ${o.name}
      </button>
    `}).join("");return`
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
              ${W.map(o=>`
    <option value="${o.value}" ${t===o.value?"selected":""}>
      ${o.label}
    </option>
  `).join("")}
            </select>
            <span class="material-symbols-outlined text-[16px] text-secondary pointer-events-none absolute right-1.5">
              expand_more
            </span>
          </div>
        </div>
      </div>

      <!-- Row 1: Source Filter Buttons -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        ${n}
      </div>

      <!-- Row 2: Topic Filter Buttons -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar border-t border-[#D9D5CC]/40 pt-2">
        ${s}
      </div>
    </div>
  `}function N(e,{onSourceChange:a,onTopicChange:t,onSortChange:n}){e.querySelectorAll(".source-filter-btn").forEach(r=>{r.addEventListener("click",()=>{const o=r.getAttribute("data-source");a&&a(o)})}),e.querySelectorAll(".topic-filter-btn").forEach(r=>{r.addEventListener("click",()=>{const o=r.getAttribute("data-topic");t&&t(o)})});const s=e.querySelector("#sort-select");s&&s.addEventListener("change",r=>{n&&n(r.target.value)})}function Z(e){if(!e)return"";const a=e._id||e.sourceArticleId,t=E(e.publishedAt,!0),n=(e.topic||"General").toUpperCase(),s=(e.source||"Wire").toUpperCase(),r=e.imageUrl?`
    <div class="w-full h-40 md:h-44 bg-surface-container overflow-hidden mb-3 border border-[#D9D5CC]">
      <img
        src="${d(e.imageUrl)}"
        alt="${d(e.title)}"
        class="w-full h-full object-cover grayscale-[10%] contrast-[105%] group-hover:scale-[1.02] transition-transform duration-300"
        loading="lazy"
        onerror="this.parentElement.style.display='none';"
      />
    </div>
  `:"";return`
    <article class="bg-surface-container-lowest p-4 md:p-5 border border-[#D9D5CC] flex flex-col justify-between hover:border-on-surface hover:bg-white transition-all group">
      <div>
        <!-- Top Metadata Line -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="font-source-tag text-source-tag text-primary-container font-bold tracking-wider uppercase">
              ${s}
            </span>
            <span class="text-secondary text-label-sm">•</span>
            <span class="font-source-tag text-source-tag text-secondary uppercase tracking-wider">
              ${n}
            </span>
          </div>
          <span class="font-label-sm text-label-sm text-secondary">
            ${t}
          </span>
        </div>

        <!-- Thumbnail Image -->
        ${r}

        <!-- Headline -->
        <a href="/article/${a}">
          <h3 class="font-serif text-lg md:text-xl font-bold text-on-surface mb-2 leading-snug group-hover:text-primary-container group-hover:underline decoration-1 underline-offset-2 transition-colors">
            ${d(e.title)}
          </h3>
        </a>

        <!-- Excerpt -->
        ${e.description?`
          <p class="font-body-md text-secondary line-clamp-2 md:line-clamp-3 mb-3 leading-relaxed">
            ${d(e.description)}
          </p>
        `:""}
      </div>

      <!-- Footer / CTA -->
      <div class="flex items-center justify-between pt-3 border-t border-[#D9D5CC]/60 mt-2">
        <a
          href="/article/${a}"
          class="font-label-sm text-label-sm font-semibold uppercase text-primary-container flex items-center gap-1 hover:text-primary transition-colors"
        >
          <span>Open Dispatch</span>
          <span class="material-symbols-outlined text-[14px]">north_east</span>
        </a>

        <button
          type="button"
          class="bookmark-btn text-secondary hover:text-primary-container p-1 transition-colors"
          title="Save for later"
          aria-label="Save for later"
        >
          <span class="material-symbols-outlined text-[18px]">bookmark_border</span>
        </button>
      </div>
    </article>
  `}function J({currentPage:e=1,totalPages:a=1}){if(a<=1)return"";const t=e<=1,n=e>=a,s=[],r=1;for(let l=1;l<=a;l++)l===1||l===a||l>=e-r&&l<=e+r?s.push(l):s[s.length-1]!=="…"&&s.push("…");const o=s.map((l,c)=>l==="…"?`
        <span class="w-5 h-7 flex items-center justify-center text-secondary font-label-sm text-label-sm">
          …
        </span>
      `:`
      <button
        type="button"
        data-page="${l}"
        class="page-number-btn w-7 h-7 flex items-center justify-center font-label-sm text-label-sm transition-colors ${l===e?"bg-primary-container text-on-primary font-bold":"text-on-surface hover:bg-surface-container font-medium"}"
      >
        ${l}
      </button>
    `).join("");return`
    <div class="w-full px-4 py-5 flex items-center justify-between bg-surface-container-lowest border border-[#D9D5CC] my-6">
      <!-- Previous Button -->
      <button
        type="button"
        id="pagination-prev-btn"
        ${t?"disabled":""}
        class="px-3 py-1.5 font-label-sm text-label-sm uppercase font-semibold flex items-center gap-1 transition-colors ${t?"text-secondary/50 cursor-not-allowed":"text-on-surface hover:text-primary-container"}"
      >
        <span class="material-symbols-outlined text-[14px]">arrow_back</span>
        <span>Previous</span>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        ${o}
      </div>

      <!-- Next Button -->
      <button
        type="button"
        id="pagination-next-btn"
        ${n?"disabled":""}
        class="px-3 py-1.5 font-label-sm text-label-sm uppercase font-semibold flex items-center gap-1 transition-colors ${n?"text-secondary/50 cursor-not-allowed":"text-on-surface hover:text-primary-container"}"
      >
        <span>Next</span>
        <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
      </button>
    </div>
  `}function ee(e,{currentPage:a,onPageChange:t}){const n=e.querySelector("#pagination-prev-btn");n&&n.addEventListener("click",()=>{a>1&&t&&t(a-1)});const s=e.querySelector("#pagination-next-btn");s&&s.addEventListener("click",()=>{t&&t(a+1)}),e.querySelectorAll(".page-number-btn").forEach(r=>{r.addEventListener("click",()=>{const o=parseInt(r.getAttribute("data-page"),10);o&&t&&t(o)})})}function te(){return`
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
        ${[1,2,3,4,5,6].map(()=>`
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
        `).join("")}
      </div>
    </div>
  `}function ae({source:e="all",topic:a="all"}={}){return`
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
        There are currently no articles matching your selected ${e!=="all"?`source (${e})`:"filters"} ${a!=="all"?`and topic (${a})`:""} within this timeframe. Try broadening your criteria.
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
  `}function se(e){return`
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
        ${(e==null?void 0:e.message)||"We experienced an interruption connecting to the publisher wire feeds. Our newsroom aggregation service is reconnecting."}
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
  `}async function B(e,a){var c,x;const t=document.getElementById("app");if(!t)return;const n=a.get("source")||"all",s=a.get("topic")||"all",r=a.get("sort")||"newest",o=parseInt(a.get("page")||"1",10);t.innerHTML=`
    <div class="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-4">
      <div class="w-full bg-surface-container-low border border-[#D9D5CC] px-4 py-2 mb-4 flex items-center justify-between text-secondary">
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-2 h-2 rounded-full bg-primary-container animate-pulse shrink-0"></span>
          <span class="font-label-sm text-label-sm text-secondary truncate tracking-wider uppercase font-semibold">
            ${L()}
          </span>
        </div>
        <span class="font-label-sm text-label-sm text-primary-container font-semibold shrink-0">
          Live Wire Active
        </span>
      </div>
      ${te()}
    </div>
  `;try{const m=await S({page:o,limit:10,source:n!=="all"?n:void 0,topic:s!=="all"?s:void 0,sort:r}),p=m.articles||[],f=m.pagination||{page:1,limit:10,total:0,pages:1};if(p.length===0){t.innerHTML=`
        <div class="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-4">
          <div class="w-full bg-surface-container-low border border-[#D9D5CC] px-4 py-2 mb-4 flex items-center justify-between text-secondary">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-2 h-2 rounded-full bg-primary-container animate-pulse shrink-0"></span>
              <span class="font-label-sm text-label-sm text-secondary truncate tracking-wider uppercase font-semibold">
                ${L()}
              </span>
            </div>
            <span class="font-label-sm text-label-sm text-primary-container font-semibold shrink-0">
              Live Wire Active
            </span>
          </div>

          ${I({currentSource:n,currentTopic:s,currentSort:r})}

          ${ae({source:n,topic:s})}
        </div>
      `,N(t,{onSourceChange:i=>l("source",i),onTopicChange:i=>l("topic",i),onSortChange:i=>l("sort",i)}),(c=document.getElementById("empty-clear-filters-btn"))==null||c.addEventListener("click",()=>{v("/")});return}const g=p.length>0?p[0]:null,b=o===1&&p.length>3?p.slice(1,4):[],h=(o===1?p.slice(b.length?4:1):p).map(i=>Z(i)).join("");t.innerHTML=`
      <div class="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-4">
        <!-- Live Dateline Bar -->
        <div class="w-full bg-surface-container-low border border-[#D9D5CC] px-4 py-2 mb-4 flex items-center justify-between text-secondary">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-2 h-2 rounded-full bg-primary-container animate-pulse shrink-0"></span>
            <span class="font-label-sm text-label-sm text-secondary truncate tracking-wider uppercase font-semibold">
              ${L()}
            </span>
          </div>
          <span class="font-label-sm text-label-sm text-primary-container font-semibold shrink-0">
            Live Wire Active
          </span>
        </div>

        <!-- Editorial Lead Hero (Page 1 only) -->
        ${o===1&&g?Q(g):""}

        <!-- Briefings & Critical Wires (Page 1 only) -->
        ${o===1&&b.length>0?X(b):""}

        <!-- Editorial Filters Bar -->
        ${I({currentSource:n,currentTopic:s,currentSort:r})}

        <!-- Broadsheet Article Grid -->
        <div class="w-full">
          <div class="flex items-center justify-between pb-2 mb-4 border-b border-[#D9D5CC]">
            <span class="font-source-tag text-source-tag text-secondary uppercase tracking-widest font-bold">
              Archival Dispatches (${f.total} total)
            </span>
            <span class="font-label-sm text-label-sm text-secondary">
              Page ${f.page} of ${f.pages}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            ${h}
          </div>
        </div>

        <!-- Pagination -->
        ${J({currentPage:f.page,totalPages:f.pages})}
      </div>
    `,N(t,{onSourceChange:i=>l("source",i),onTopicChange:i=>l("topic",i),onSortChange:i=>l("sort",i)}),ee(t,{currentPage:f.page,onPageChange:i=>l("page",i)}),t.querySelectorAll(".bookmark-btn").forEach(i=>{i.addEventListener("click",y=>{y.preventDefault();const w=i.querySelector(".material-symbols-outlined");if(w){const C=w.textContent==="bookmark";w.textContent=C?"bookmark_border":"bookmark",i.classList.toggle("text-primary-container",!C)}})})}catch(m){console.error("Home page load failed:",m),t.innerHTML=`
      <div class="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-4">
        ${se(m)}
      </div>
    `,(x=document.getElementById("error-retry-btn"))==null||x.addEventListener("click",()=>{B(e,a)})}function l(m,p){const f=new URLSearchParams(window.location.search);p&&p!=="all"&&(m!=="sort"||p!=="newest")&&(m!=="page"||p>1)?f.set(m,p):f.delete(m),m!=="page"&&f.delete("page");const g=f.toString();v(`/${g?`?${g}`:""}`)}}async function re(e){var s,r,o,l;const a=document.getElementById("app");if(!a)return;const t=e==null?void 0:e.id;a.innerHTML=`
    <div class="max-w-3xl mx-auto px-4 md:px-8 py-8 animate-pulse space-y-4">
      <div class="h-4 w-32 bg-[#ECE9E2]"></div>
      <div class="h-10 w-full bg-[#DCD9D9]"></div>
      <div class="h-6 w-3/4 bg-[#DCD9D9]"></div>
      <div class="h-64 w-full bg-[#ECE9E2]"></div>
      <div class="h-4 w-full bg-[#ECE9E2]"></div>
      <div class="h-4 w-5/6 bg-[#ECE9E2]"></div>
    </div>
  `;try{const c=await K(t);if(!c){n();return}let x=[];try{x=((await S({source:c.sourceSlug||c.source,limit:4})).articles||[]).filter(y=>(y._id||y.sourceArticleId)!==(c._id||c.sourceArticleId)).slice(0,3)}catch{}const m=c.topic||"General",p=c.source||"Wire Service",f=Y(c.publishedAt),g=c.description?c.description.charAt(0).toUpperCase():"T",b=c.description?c.description.slice(1):"",u=c.imageUrl?`
      <figure class="flex flex-col w-full mb-6 border border-[#D9D5CC]">
        <div class="relative w-full aspect-[16/10] overflow-hidden bg-surface-container">
          <img
            src="${d(c.imageUrl)}"
            alt="${d(c.title)}"
            class="w-full h-full object-cover grayscale-[10%] contrast-[105%]"
            onerror="this.parentElement.parentElement.style.display='none';"
          />
          <div class="absolute top-2.5 right-2.5 bg-inverse-surface/85 text-inverse-on-surface px-2 py-0.5 font-label-sm text-label-sm uppercase tracking-wider">
            ${d(p)} Wire
          </div>
        </div>
        <figcaption class="p-2.5 bg-surface-container-low font-label-sm text-label-sm text-secondary border-t border-[#D9D5CC]">
          Photograph / Transmission feed via ${d(p)} accredited archives.
        </figcaption>
      </figure>
    `:"",h=x.length>0?`
      <section class="mt-8 pt-6 border-t border-[#D9D5CC]">
        <div class="flex items-baseline justify-between mb-4">
          <h2 class="font-serif text-xl font-bold text-on-surface">
            More from ${d(p)}
          </h2>
          <span class="font-source-tag text-source-tag text-primary-container uppercase font-bold tracking-wider">
            Accredited Bureau
          </span>
        </div>

        <div class="flex flex-col gap-3">
          ${x.map(i=>{const y=i._id||i.sourceArticleId,w=E(i.publishedAt);return`
              <a
                href="/article/${y}"
                class="bg-surface-container-lowest p-4 border border-[#D9D5CC] flex flex-col gap-1 hover:border-on-surface transition-all group"
              >
                <div class="flex items-center justify-between text-secondary font-label-sm text-label-sm">
                  <span class="font-source-tag text-source-tag text-primary-container font-bold">
                    ${d(p.toUpperCase())}
                  </span>
                  <span>${w}</span>
                </div>
                <h3 class="font-serif text-base font-semibold text-on-surface group-hover:text-primary-container transition-colors">
                  ${d(i.title)}
                </h3>
                ${i.description?`
                  <p class="font-body-sm text-secondary line-clamp-2">
                    ${d(i.description)}
                  </p>
                `:""}
                <span class="text-primary-container font-label-sm text-label-sm uppercase font-semibold mt-1 flex items-center gap-1">
                  <span>Read dispatch</span>
                  <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                </span>
              </a>
            `}).join("")}
        </div>
      </section>
    `:"";a.innerHTML=`
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
          <a href="/?topic=${encodeURIComponent(m.toLowerCase())}" class="hover:text-primary-container capitalize transition-colors">
            ${d(m)}
          </a>
          <span>/</span>
          <span class="text-on-surface font-semibold">${d(p)}</span>
        </nav>

        <!-- Topic & Wire Badge -->
        <div class="flex items-center gap-2 mb-3">
          <span class="bg-primary-container text-on-primary px-2.5 py-0.5 uppercase font-source-tag text-source-tag font-bold tracking-wider">
            ${d(m)}
          </span>
          <span class="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-secondary">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
            <span>Diplomatic Wire</span>
          </span>
        </div>

        <!-- Headline -->
        <h1 class="font-serif text-2xl sm:text-3xl md:text-4xl text-on-surface font-bold tracking-tight mb-4 leading-tight">
          ${d(c.title)}
        </h1>

        <!-- Description Lead -->
        ${c.description?`
          <p class="font-body-lg text-secondary leading-relaxed mb-6">
            ${d(c.description)}
          </p>
        `:""}

        <!-- Source & Published Dateline Card -->
        <div class="bg-surface-container-low border border-[#D9D5CC] p-3.5 flex flex-col gap-1 mb-6">
          <div class="flex items-center justify-between">
            <span class="font-source-tag text-source-tag text-primary-container font-bold uppercase tracking-widest">
              Source: ${d(p)}
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
            Published ${f}
          </span>
        </div>

        <!-- Featured Image -->
        ${u}

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
          ${c.description?`
            <p>
              <span class="font-serif text-3xl md:text-4xl text-primary-container float-left mr-2 leading-none font-bold">
                ${d(g)}
              </span>
              ${d(b)}
            </p>
          `:""}

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
                Source: ${d(p)}
              </span>
              <span class="font-label-sm text-label-sm text-secondary mt-0.5">
                Original publication: ${f}
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
            href="${d(c.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full bg-primary-container hover:bg-primary active:scale-[0.99] text-on-primary py-3 px-4 font-serif text-base md:text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>Read Original Article on ${d(p)}</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>

          <div class="flex items-center justify-center gap-1.5 font-label-sm text-label-sm text-secondary text-center">
            <span class="material-symbols-outlined text-[14px]">open_in_new</span>
            <span>Leaves app &amp; opens external accredited archive</span>
          </div>
        </section>

        <!-- More from Source Section -->
        ${h}
      </article>
    `,(s=document.getElementById("article-back-btn"))==null||s.addEventListener("click",()=>{window.history.back()}),(r=document.getElementById("article-copy-btn"))==null||r.addEventListener("click",()=>{navigator.clipboard.writeText(window.location.href);const i=document.querySelector("#article-copy-btn .material-symbols-outlined");i&&(i.textContent="check",setTimeout(()=>{i.textContent="link"},2e3))}),(o=document.getElementById("article-share-btn"))==null||o.addEventListener("click",()=>{navigator.share?navigator.share({title:c.title,url:window.location.href}):navigator.clipboard.writeText(window.location.href)}),(l=document.getElementById("article-bookmark-btn"))==null||l.addEventListener("click",function(){const i=this.querySelector(".material-symbols-outlined");if(i){const y=i.textContent==="bookmark";i.textContent=y?"bookmark_border":"bookmark",this.classList.toggle("text-primary-container",!y)}})}catch(c){console.error("Failed to load article:",c),n()}function n(){var c;a.innerHTML=`
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
    `,(c=document.getElementById("not-found-home-btn"))==null||c.addEventListener("click",()=>{v("/")})}}async function ne(e,a){var o,l;const t=document.getElementById("app");if(!t)return;const n=a.get("q")||"",s=a.get("source")||"all";t.innerHTML=`
    <div class="max-w-3xl mx-auto px-4 md:px-6 py-4">
      <!-- Top Header -->
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-[#D9D5CC]">
        <a
          href="/"
          class="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider text-secondary hover:text-primary-container transition-colors"
          aria-label="Back to home"
        >
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Home</span>
        </a>

        <h1 class="font-serif font-bold text-sm tracking-wide text-on-surface uppercase">
          Search Edition
        </h1>

        <button
          id="search-share-btn"
          type="button"
          class="text-secondary hover:text-primary-container transition-colors p-1"
          aria-label="Share search"
        >
          <span class="material-symbols-outlined text-[20px]">share</span>
        </button>
      </div>

      <!-- Editorial Search Bar -->
      <form id="search-form" class="mb-4">
        <div class="flex items-center gap-2 w-full">
          <div class="flex-1 flex items-center bg-surface-container-lowest border border-[#D9D5CC] px-3 py-2 focus-within:border-primary-container transition-colors">
            <span class="material-symbols-outlined text-secondary text-[20px] mr-2">search</span>
            <input
              id="search-input-field"
              type="text"
              value="${d(n)}"
              placeholder="Search articles, topics, publishers..."
              class="w-full bg-transparent font-body-md text-on-surface placeholder:text-secondary/70 focus:outline-none"
            />
            ${n?`
              <button
                type="button"
                id="search-clear-btn"
                aria-label="Clear search"
                class="w-6 h-6 flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
              >
                <span class="material-symbols-outlined text-[16px]">close</span>
              </button>
            `:""}
          </div>
          <button
            type="submit"
            class="h-10 px-4 bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold hover:bg-primary transition-colors flex items-center justify-center"
          >
            Search
          </button>
        </div>
      </form>

      <!-- Skeleton loading -->
      <div class="space-y-4 animate-pulse">
        ${[1,2,3].map(()=>`
          <div class="bg-surface-container-lowest border border-[#D9D5CC] p-4 space-y-2">
            <div class="h-3.5 w-32 bg-[#ECE9E2]"></div>
            <div class="h-6 w-full bg-[#DCD9D9]"></div>
            <div class="h-28 w-full bg-[#ECE9E2]"></div>
            <div class="h-4 w-5/6 bg-[#ECE9E2]"></div>
          </div>
        `).join("")}
      </div>
    </div>
  `,r();try{const x=(await M({query:n,source:s,limit:50})).articles||[],p=(await M({query:n,source:"all",limit:100})).articles||[],f=u=>u==="all"?p.length:p.filter(h=>{var i;return h.sourceSlug===u||((i=h.source)==null?void 0:i.toLowerCase().includes(u.replace("-news","")))}).length,g=H.map(u=>{const h=s===u.slug,i=f(u.slug);return`
        <button
          type="button"
          data-source="${u.slug}"
          class="search-source-btn shrink-0 px-3 py-1.5 font-label-sm text-label-sm uppercase tracking-wider font-semibold transition-colors border ${h?"bg-primary-container border-primary-container text-on-primary":"bg-surface-container-high border-[#D9D5CC] text-on-surface hover:bg-surface-container-highest"}"
        >
          ${u.name} (${i})
        </button>
      `}).join("");let b="";x.length===0?b=`
        <div class="bg-surface-container-lowest border border-[#D9D5CC] p-8 text-center my-6">
          <span class="material-symbols-outlined text-4xl text-secondary mb-2">find_in_page</span>
          <h2 class="font-serif text-xl font-bold uppercase mb-2 text-on-surface">
            No Archival Dispatches Match
          </h2>
          <p class="font-body-md text-secondary max-w-sm mx-auto mb-4">
            Try revising your query or clearing source filters to expand results across all accredited bureaus.
          </p>
          <button
            id="search-reset-btn"
            type="button"
            class="bg-primary-container text-on-primary font-label-sm text-label-sm uppercase px-4 py-2 hover:bg-primary transition-colors"
          >
            Reset Search
          </button>
        </div>
      `:b=`
        <div class="flex flex-col gap-4">
          ${x.map(u=>{const h=u._id||u.sourceArticleId,i=E(u.publishedAt,!0),y=u.imageUrl?`
              <div class="w-full h-40 bg-surface-container overflow-hidden my-1 relative border border-[#D9D5CC]">
                <img
                  src="${d(u.imageUrl)}"
                  alt="${d(u.title)}"
                  class="w-full h-full object-cover grayscale-[10%] contrast-[105%]"
                  loading="lazy"
                  onerror="this.parentElement.style.display='none';"
                />
                <span class="absolute bottom-2 right-2 bg-inverse-surface/85 text-inverse-on-surface font-label-sm text-label-sm px-1.5 py-0.5 uppercase tracking-widest">
                  Wire Telemetry
                </span>
              </div>
            `:"";return`
              <article class="bg-surface-container-lowest border border-[#D9D5CC] p-4 flex flex-col gap-2 hover:border-on-surface transition-all group">
                <div class="flex items-center justify-between font-label-sm text-label-sm">
                  <div class="flex items-center gap-2">
                    <span class="font-source-tag text-source-tag text-primary-container tracking-widest uppercase font-bold">
                      ${d(u.source)}
                    </span>
                    <span class="text-secondary">•</span>
                    <span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                      ${d(u.topic||"General")}
                    </span>
                  </div>
                  <div class="flex items-center gap-1 text-secondary font-label-sm text-label-sm">
                    <span class="material-symbols-outlined text-[14px]">schedule</span>
                    <span>${i}</span>
                  </div>
                </div>

                <a href="/article/${h}">
                  <h2 class="font-serif text-lg md:text-xl font-semibold text-on-surface leading-snug group-hover:text-primary-container transition-colors">
                    ${d(u.title)}
                  </h2>
                </a>

                ${y}

                ${u.description?`
                  <p class="font-body-md text-secondary line-clamp-3 leading-relaxed">
                    ${d(u.description)}
                  </p>
                `:""}

                <div class="pt-2 border-t border-[#D9D5CC]/60 flex items-center justify-between">
                  <span class="bg-surface-container border border-[#D9D5CC] px-2 py-0.5 font-label-sm text-label-sm text-on-surface uppercase font-medium">
                    ${d(u.topic||"General")}
                  </span>

                  <a
                    href="/article/${h}"
                    class="text-primary-container hover:text-primary flex items-center gap-1 font-label-sm text-label-sm uppercase font-semibold transition-colors"
                  >
                    <span>Read Dispatch</span>
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </a>
                </div>
              </article>
            `}).join("")}
        </div>
      `,t.innerHTML=`
      <div class="max-w-3xl mx-auto px-4 md:px-6 py-4">
        <!-- Top Header -->
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-[#D9D5CC]">
          <a
            href="/"
            class="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider text-secondary hover:text-primary-container transition-colors"
            aria-label="Back to home"
          >
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Home</span>
          </a>

          <h1 class="font-serif font-bold text-sm tracking-wide text-on-surface uppercase">
            Search Edition
          </h1>

          <button
            id="search-share-btn"
            type="button"
            class="text-secondary hover:text-primary-container transition-colors p-1"
            aria-label="Share search"
          >
            <span class="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>

        <!-- Editorial Search Bar -->
        <form id="search-form" class="mb-4">
          <div class="flex items-center gap-2 w-full">
            <div class="flex-1 flex items-center bg-surface-container-lowest border border-[#D9D5CC] px-3 py-2 focus-within:border-primary-container transition-colors">
              <span class="material-symbols-outlined text-secondary text-[20px] mr-2">search</span>
              <input
                id="search-input-field"
                type="text"
                value="${d(n)}"
                placeholder="Search articles, topics, publishers..."
                class="w-full bg-transparent font-body-md text-on-surface placeholder:text-secondary/70 focus:outline-none"
              />
              ${n?`
                <button
                  type="button"
                  id="search-clear-btn"
                  aria-label="Clear search"
                  class="w-6 h-6 flex items-center justify-center text-secondary hover:text-on-surface transition-colors"
                >
                  <span class="material-symbols-outlined text-[16px]">close</span>
                </button>
              `:""}
            </div>
            <button
              type="submit"
              class="h-10 px-4 bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold hover:bg-primary transition-colors flex items-center justify-center"
            >
              Search
            </button>
          </div>
        </form>

        <!-- Results Header Matrix -->
        <div class="flex items-center justify-between py-1 text-secondary border-b border-[#D9D5CC] mb-3">
          <span class="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
            Showing ${x.length} Dispatches ${n?`for "${d(n)}"`:"in Archive"}
          </span>
          <span class="font-label-sm text-label-sm text-primary-container font-medium">
            Archival Indexed
          </span>
        </div>

        <!-- Source Filter Chips with Counts -->
        <div class="w-full overflow-x-auto py-1 flex gap-2 no-scrollbar mb-4">
          ${g}
        </div>

        <!-- Results Feed or Empty -->
        ${b}
      </div>
    `,r(),t.querySelectorAll(".search-source-btn").forEach(u=>{u.addEventListener("click",()=>{const h=u.getAttribute("data-source"),i=new URLSearchParams(window.location.search);h!=="all"?i.set("source",h):i.delete("source");const y=i.toString();v(`/search${y?`?${y}`:""}`)})}),(o=document.getElementById("search-reset-btn"))==null||o.addEventListener("click",()=>{v("/search")}),(l=document.getElementById("search-share-btn"))==null||l.addEventListener("click",()=>{navigator.share?navigator.share({title:"The Morning Dispatch — Search",url:window.location.href}):navigator.clipboard.writeText(window.location.href)})}catch(c){console.error("Search failed:",c)}function r(){var c,x;(c=document.getElementById("search-form"))==null||c.addEventListener("submit",m=>{var b;m.preventDefault();const p=(b=document.getElementById("search-input-field"))==null?void 0:b.value.trim(),f=new URLSearchParams(window.location.search);p?f.set("q",p):f.delete("q");const g=f.toString();v(`/search${g?`?${g}`:""}`)}),(x=document.getElementById("search-clear-btn"))==null||x.addEventListener("click",()=>{const m=new URLSearchParams(window.location.search);m.delete("q");const p=m.toString();v(`/search${p?`?${p}`:""}`)})}}$();z();_();U([{path:"/",handler:B},{path:"/article/:id",handler:re},{path:"/search",handler:ne}],()=>{B({},new URLSearchParams)});F();

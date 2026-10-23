/**
 * Lightweight Client-Side Router for Vanilla JS
 * Supports path patterns (e.g. /article/:id), query parameters, and browser history (popstate/pushState).
 */

let routes = [];
let notFoundHandler = null;

export function registerRoutes(routeList, fallback) {
  routes = routeList.map(r => ({
    ...r,
    pattern: pathToRegex(r.path)
  }));
  notFoundHandler = fallback;
}

function pathToRegex(path) {
  const paramNames = [];
  const regexStr = '^' + path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    paramNames.push(key);
    return '([^/]+)';
  }) + '$';
  return {
    regex: new RegExp(regexStr),
    paramNames
  };
}

export function matchRoute(pathname) {
  for (const r of routes) {
    const match = pathname.match(r.pattern.regex);
    if (match) {
      const params = {};
      r.pattern.paramNames.forEach((name, index) => {
        params[name] = decodeURIComponent(match[index + 1]);
      });
      return { handler: r.handler, params, path: r.path };
    }
  }
  return null;
}

export function handleRoute() {
  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const matched = matchRoute(pathname);

  // Dispatch route change event so persistent components (masthead, bottom nav) can update active state
  window.dispatchEvent(new CustomEvent('tmd:routechange', {
    detail: { pathname, searchParams }
  }));

  if (matched) {
    matched.handler(matched.params, searchParams);
  } else if (notFoundHandler) {
    notFoundHandler();
  }
}

export function navigate(url, replace = false) {
  if (replace) {
    window.history.replaceState(null, '', url);
  } else {
    window.history.pushState(null, '', url);
  }
  handleRoute();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function initRouter() {
  window.addEventListener('popstate', handleRoute);

  // Intercept internal link clicks
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    const target = anchor.getAttribute('target');

    // Skip external links, new tab links, hash-only anchors, or mailto/tel
    if (!href || target === '_blank' || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    if (href.startsWith('#')) {
      // Internal anchor scroll
      return;
    }

    e.preventDefault();
    navigate(href);
  });

  // Initial load
  handleRoute();
}

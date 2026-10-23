import './index.css';
import { registerRoutes, initRouter } from './router.js';
import { renderMasthead } from './components/masthead.js';
import { renderFooter } from './components/footer.js';
import { renderMobileNav } from './components/mobileNav.js';
import { renderHomePage } from './pages/homePage.js';
import { renderArticlePage } from './pages/articlePage.js';
import { renderSearchPage } from './pages/searchPage.js';

// Initialize persistent layout chrome
renderMasthead();
renderFooter();
renderMobileNav();

// Register application routes
registerRoutes([
  { path: '/', handler: renderHomePage },
  { path: '/article/:id', handler: renderArticlePage },
  { path: '/search', handler: renderSearchPage },
], () => {
  // Fallback route: render home
  renderHomePage({}, new URLSearchParams());
});

// Start router and handle initial page load
initRouter();

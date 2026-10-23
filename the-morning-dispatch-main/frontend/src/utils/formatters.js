/**
 * Human-readable relative time string matching editorial references:
 * e.g. "28 minutes ago", "45m ago", "2h ago", "1 day ago"
 */
export function formatTimeAgo(dateInput, short = false) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffInSeconds < 60) {
    return short ? 'just now' : 'Just now';
  }

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return short ? `${minutes}m ago` : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Editorial published date format:
 * e.g. "September 21, 2026 · 08:42 GMT"
 */
export function formatPublishedDate(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${formattedDate} · ${hours}:${minutes} GMT`;
}

/**
 * Editorial dateline for masthead ticker:
 * e.g. "Monday, September 21, 2026 · Global Edition"
 */
export function getEditorialDateline() {
  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const dateStr = now.toLocaleDateString('en-US', options);
  return `${dateStr} · Global Edition`;
}

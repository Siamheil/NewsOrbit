/**
 * DOM & String Sanitization Utilities for The Morning Dispatch
 * 
 * Provides safe HTML escaping and helper functions to prevent XSS
 * and ensure clean text injection into template literals.
 */

/**
 * Escapes characters with special meaning in HTML (&, <, >, ", ').
 * 
 * @param {string|null|undefined} str - The raw string to sanitize.
 * @returns {string} The escaped string safe for HTML interpolation.
 */
export function escapeHTML(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

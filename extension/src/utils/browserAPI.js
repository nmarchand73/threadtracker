/**
 * Browser API utility - provides a consistent API for Firefox and Chrome
 * 
 * This module implements a compatibility layer using the WebExtension Polyfill
 * to ensure consistent behavior across browsers. Firefox uses the 'browser' namespace 
 * which follows the Promise-based WebExtension standard, while Chrome uses the 
 * callback-based 'chrome' API.
 * 
 * Usage:
 * - Import this module instead of directly using 'browser' or 'chrome'
 * - All API calls will return Promises for consistent async behavior
 * - API calls are normalized across browsers
 */

// Check if the browser object exists (Firefox), otherwise use chrome (Chrome)
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

/**
 * Helper function to detect which browser we're running in
 * @returns {string} The browser name ('firefox', 'chrome', or 'unknown')
 */
export function detectBrowser() {
  if (typeof browser !== 'undefined') {
    return 'firefox';
  } else if (typeof chrome !== 'undefined') {
    return 'chrome';
  }
  return 'unknown';
}

/**
 * Check if we're running in Firefox
 * @returns {boolean} True if running in Firefox
 */
export function isFirefox() {
  return detectBrowser() === 'firefox';
}

/**
 * Check if we're running in Chrome
 * @returns {boolean} True if running in Chrome
 */
export function isChrome() {
  return detectBrowser() === 'chrome';
}

export default browserAPI; 
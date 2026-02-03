/**
 * Debug utility - logs only in development or with ?debug=1
 * Keeps production console clean while allowing debugging
 */
const isDev = import.meta.env.DEV;
const isDebug = typeof window !== 'undefined' && window.location.search.includes('debug=1');

export const debug = {
  log: (...args: unknown[]) => (isDev || isDebug) && console.log(...args),
  warn: (...args: unknown[]) => (isDev || isDebug) && console.warn(...args),
  error: console.error, // Always log errors
  info: (...args: unknown[]) => (isDev || isDebug) && console.info(...args),
};

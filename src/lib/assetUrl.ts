/**
 * Build a URL for files served from Vite's `public/` directory.
 *
 * IMPORTANT: Use BASE_URL so deployments that are served from a sub-path
 * (common on some Vercel / proxy setups) still resolve correctly.
 */
export const publicAssetUrl = (path: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}${normalizedPath}`;
};

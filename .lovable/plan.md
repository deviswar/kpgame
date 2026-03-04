

## Fix Favicon for Search Results & Ensure Correct Title

### Problem
The screenshot shows Google search results displaying a default platform favicon instead of your KP character favicon. This happens because:
1. Only an SVG favicon is defined — many search engines (Google especially) prefer PNG/ICO formats
2. No `apple-touch-icon` is set, which Google also uses as a favicon source

### Changes

#### 1. Create a PNG favicon from the existing SVG
Convert `public/favicon.svg` to a PNG version at `public/favicon.png` (192x192px) using an inline SVG-to-canvas approach, or simpler: copy the user's OG image and also create a dedicated `public/favicon-32x32.png`.

Actually, the simplest approach: use the existing `og-image.png` as the apple-touch-icon source, and add multiple favicon link tags.

#### 2. Update `index.html` — add multiple favicon formats

Add these link tags alongside the existing SVG favicon:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon.png" type="image/png" sizes="192x192" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

We'll copy the og-image as `apple-touch-icon.png` and create a square-cropped version as `favicon.png` from the KP image.

**Better approach**: Copy the user's uploaded KP image to `public/favicon.png` and `public/apple-touch-icon.png` so Google can pick it up. Since the user wants the same KP character image, we use `og-image.png` for this.

#### 3. Ensure title is correct
The title is already "Play the game & Make KP EP" in this project. The screenshot showing "KP Game - Play the Fun Browser Game" with Vercel is from a different deployment. If the user wants the Lovable deployment to show "KP Game" as the site name in search results, we should also add a `meta name="application-name"` tag.

### Files to Modify

**`index.html`** — Add PNG favicon and apple-touch-icon links:
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/og-image.png" type="image/png" sizes="192x192" />
<link rel="apple-touch-icon" href="/og-image.png" />
```

This reuses the existing `og-image.png` (your KP character image) as the PNG favicon source, which Google will pick up for search results.

### Note
Google caches favicons and may take days/weeks to update. After publishing, you can use [Google's Rich Results Test](https://search.google.com/test/rich-results) to verify your metadata is correct.


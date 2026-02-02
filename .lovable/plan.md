
## Replace Default Lovable OG Images with KP Branding

### Current Issue
Lines 28 and 32 in `index.html` use the default Lovable opengraph image:
```html
<meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
<meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
```

### Solution

**Option A: Use the existing favicon.svg as OG image**
We can reference the SVG favicon directly. While SVGs aren't ideal for OG images (some platforms don't support them), it's a quick solution:

```html
<meta property="og:image" content="https://kpgtest.lovable.app/favicon.svg" />
<meta name="twitter:image" content="https://kpgtest.lovable.app/favicon.svg" />
```

**Option B (Recommended): Create a proper PNG OG image**
Create a new `public/og-image.png` file (1200x630px) with the KP character design and game branding for best compatibility across all social platforms.

### Implementation Plan

1. **Create OG Image File**
   - Create a new PNG image at `public/og-image.png` 
   - Use the KP character with yellow background and "KP Game" text
   - Dimensions: 1200x630px (standard OG size)

2. **Update index.html**
   - Change line 28: `og:image` → `/og-image.png` with full published URL
   - Change line 32: `twitter:image` → `/og-image.png` with full published URL
   - Add `og:image:width` and `og:image:height` meta tags for better rendering

### Technical Details

```html
<!-- Updated OG tags -->
<meta property="og:image" content="https://kpgtest.lovable.app/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:image" content="https://kpgtest.lovable.app/og-image.png" />
```

### Note
If you don't have a PNG image ready, I can create a simple HTML-based approach or we can temporarily use the SVG favicon. Let me know which option you prefer!

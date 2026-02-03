
## Replace OG Image with Your Custom KP Image

### Summary
Replace the existing `og-image.png` with your uploaded KP Game image and update meta tags to use this PNG file for social media link previews (Telegram, WhatsApp, X, etc.).

### Files to Change

#### 1. Copy Your Uploaded Image
Copy `user-uploads://og_img.png` → `public/og-image.png`

This replaces the existing OG image with your custom KP character image.

#### 2. Update `index.html` Meta Tags

| Line | Current | New |
|------|---------|-----|
| 28 | `og:image` → `.../favicon.svg` | `og:image` → `https://kpgtest.lovable.app/og-image.png` |
| 32 | `twitter:image` → `.../favicon.svg` | `twitter:image` → `https://kpgtest.lovable.app/og-image.png` |

Also add image dimensions for better compatibility:
- Add `og:image:width` = 1200
- Add `og:image:height` = 630

### What Stays the Same
- Favicon (`/favicon.svg`) remains unchanged
- Title and descriptions stay as "Play the game & Make KP EP"

### Result
When you share the link on Telegram, WhatsApp, or X, your custom KP Game image with the character in the yellow Rapido shirt will appear as the preview image.

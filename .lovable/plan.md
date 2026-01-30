
# SEO Optimization Plan for KP Game

## Current State Analysis

**What you already have:**
- Basic `<title>KP Game</title>` ✅
- Meta description ✅
- Open Graph tags for social sharing ✅
- Twitter card meta tags ✅
- Basic robots.txt allowing all crawlers ✅
- Custom favicon ✅

**What's missing for better SEO:**
- No sitemap.xml
- No JSON-LD structured data
- Robots.txt doesn't reference sitemap
- No canonical URL meta tag
- Missing some important meta tags (keywords, theme-color)
- OG image still points to lovable.dev (should be your own)

---

## Implementation Plan

### 1. Enhanced Meta Tags (index.html)

Add these critical SEO elements:
- Canonical URL pointing to your Vercel domain
- Keywords meta tag with "kp game, kpgame, browser game"
- Theme color for mobile browsers
- Updated OG URL and site_name
- Google site verification placeholder (for Search Console)

### 2. JSON-LD Structured Data (index.html)

Add VideoGame schema markup so Google understands this is a game:
```json
{
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "KP Game",
  "description": "Feed KP and make her happy! A fun browser game.",
  "url": "https://kpgame.vercel.app/",
  "operatingSystem": "Web Browser",
  "applicationCategory": "Game"
}
```

### 3. Sitemap.xml (new file in public/)

Create a sitemap listing all your pages:
- / (homepage - priority 1.0)
- /welcome
- /feed
- /cow-fight
- /milk-hospital
- /airplane

### 4. Updated robots.txt

Add sitemap reference so crawlers find it automatically.

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `index.html` | Modify | Add canonical URL, JSON-LD, enhanced meta tags |
| `public/sitemap.xml` | Create | Help Google discover all pages |
| `public/robots.txt` | Modify | Add sitemap reference |

---

## Next Steps After Implementation (Manual)

These are things you'll need to do outside of code:

1. **Google Search Console Setup**
   - Go to search.google.com/search-console
   - Add property: `https://kpgame.vercel.app`
   - Verify ownership (HTML tag method - I'll add a placeholder)
   - Submit your sitemap URL

2. **Request Indexing**
   - In Search Console, use URL Inspection
   - Enter your homepage URL
   - Click "Request Indexing"

3. **Create Custom OG Image**
   - Create a 1200x630px image with "KP Game" branding
   - Upload to your public folder
   - Update the og:image URL

4. **Build Backlinks**
   - Update GitHub README with link
   - Create itch.io / GameJolt pages
   - Share on social media

---

## Technical Notes

- The sitemap will use your Vercel domain (`kpgame.vercel.app`)
- All meta tags will reference this domain for consistency
- JSON-LD follows Google's recommended schema for games
- A Google verification placeholder will be added (you'll update with your actual code from Search Console)

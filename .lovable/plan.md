
## Update All Text to "Play the game & Make KP EP"

### Summary
Replace every instance of "Make KP Happy" with "Make KP EP" and update the OG image to use the existing KP favicon.svg.

### Files to Modify

#### 1. `index.html`
Update 4 meta properties:

| Line | Current | New |
|------|---------|-----|
| 6 | `<title>KP Game</title>` | `<title>Play the game & Make KP EP</title>` |
| 7 | `content="Play the game & Make KP Happy"` | `content="Play the game & Make KP EP"` |
| 25 | `og:title` = "KP Game" | `og:title` = "Play the game & Make KP EP" |
| 26 | `og:description` = "...Make KP Happy" | `og:description` = "Play the game & Make KP EP" |
| 28-30 | `og:image` = `.../og-image.png` + width/height | `og:image` = `https://kpgtest.lovable.app/favicon.svg` (remove width/height lines since SVG scales) |
| 34 | `twitter:image` = `.../og-image.png` | `twitter:image` = `https://kpgtest.lovable.app/favicon.svg` |

### Technical Details

**Changes in index.html:**

```html
<!-- Line 6 -->
<title>Play the game & Make KP EP</title>

<!-- Line 7 -->
<meta name="description" content="Play the game & Make KP EP" />

<!-- Line 25 -->
<meta property="og:title" content="Play the game & Make KP EP" />

<!-- Line 26 -->
<meta property="og:description" content="Play the game & Make KP EP" />

<!-- Lines 28-30: Replace og:image PNG with SVG favicon -->
<meta property="og:image" content="https://kpgtest.lovable.app/favicon.svg" />
<!-- Remove og:image:width and og:image:height since SVG is scalable -->

<!-- Line 34 -->
<meta name="twitter:image" content="https://kpgtest.lovable.app/favicon.svg" />
```

### What Stays the Same
- `og:type` remains "website"
- `twitter:card` remains "summary_large_image"
- `twitter:site` remains "@KPGame"
- All other game components (FeedKPGame, WelcomeScreen, etc.) don't contain the "Make KP Happy" text, so no changes needed there

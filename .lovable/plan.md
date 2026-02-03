
## Comprehensive Fix Plan for kpgame.vercel.app

This plan addresses all identified issues causing slow loading, images not loading, and rizz music not playing.

---

## Issues Identified

| Issue | Severity | Status |
|-------|----------|--------|
| Broken QT image preload causing 404 stall | Critical | ✅ Already fixed |
| Milk hospital banner images loading late | High | ✅ Recently fixed |
| Google Font @import blocking render | Medium | 🔧 Needs fix |
| Large embedded album art in rizz.mp3 | Low | 📋 Optional optimization |
| Vercel deployment not updated | Critical | ⚠️ Needs action |

---

## Changes Required

### 1. Fix Render-Blocking Font Import

**File:** `src/index.css`

**Problem:** Line 1 uses `@import` which blocks CSS parsing and rendering until the font downloads. On slow connections, this causes a blank screen for several seconds.

**Solution:** Move the font loading to `index.html` using `<link>` tags with `font-display: swap` for non-blocking behavior.

**Changes:**
- Remove line 1 from `src/index.css`: 
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Bangers&family=Bungee+Shade&display=swap');
  ```
- Add to `index.html` head section (after the preconnect tags):
  ```html
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Bangers&family=Bungee+Shade&display=swap" />
  ```

---

## Deployment Steps (Critical)

After implementing the font fix, you must:

1. **Publish from Lovable** - Click the publish button to deploy to `kpgtest.lovable.app`
2. **Trigger Vercel Redeploy**:
   - Go to Vercel Dashboard > Deployments
   - Click the latest deployment
   - Click "Redeploy"
   - **UNCHECK** "Use existing Build Cache"
   - Confirm
3. **Clear browser cache** on the device you're testing with
4. **Test on kpgame.vercel.app**

---

## Summary of All Files to Change

| File | Change |
|------|--------|
| `src/index.css` | Remove `@import` font line (line 1) |
| `index.html` | Add `<link>` tag for Google Fonts |

---

## Technical Details

### Why @import Blocks Rendering

```text
With @import in CSS:
1. Browser downloads HTML
2. Browser starts parsing CSS
3. CSS parser hits @import
4. Browser STOPS and fetches the font CSS
5. Browser waits for fonts to download
6. Finally continues rendering → SLOW

With <link> in HTML:
1. Browser downloads HTML
2. Browser sees <link> and starts font fetch in PARALLEL
3. Browser continues parsing CSS immediately
4. Fonts load in background → FAST
```

### Font Display Swap

The Google Fonts URL already includes `display=swap` which means:
- Text renders immediately with a fallback font
- When custom fonts load, they swap in
- No invisible text while waiting

---

## After These Fixes

The website should:
1. Load significantly faster (no render blocking)
2. Show QT image immediately (already fixed)
3. Show milk hospital banners immediately (already fixed)
4. Play rizz music on iOS (already fixed in previous session)


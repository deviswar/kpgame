
## Summary

Fix the slow loading issue on `kpgame.vercel.app` caused by a **broken preload link** in `index.html` that results in a **404 error** during page load.

---

## Root Cause

In `index.html` line 14, there's a preload directive:

```html
<link rel="preload" href="/src/assets/qt-girl.jpg" as="image" type="image/jpeg" />
```

**This path does NOT work in production builds.**

In Vite:
- The `/src/` directory exists in development but is **completely removed** in production
- Assets in `src/assets/` are processed by Vite and get hashed filenames like `/assets/qt-girl-a1b2c3d4.jpg`
- The path `/src/assets/qt-girl.jpg` returns a **404 error** in production

This 404 causes:
1. **Browser stall** - The browser waits for the preload to resolve/fail before continuing
2. **Connection blocking** - Failed requests can block other requests on slow connections
3. **Repeated retry attempts** - Some browsers retry failed preloads

The RizzScene component correctly uses ES6 imports (line 4: `import qtGirlImage from '@/assets/qt-girl.jpg'`), so the image itself loads fine - it's just the broken preload that causes delays.

---

## Solution

### Option 1: Remove the Preload (Recommended)

Since the QT image is imported via ES6 in `RizzScene.tsx`, Vite automatically handles it. The preload is redundant and broken.

**Change in `index.html`:**

```html
<!-- BEFORE -->
<link rel="preload" href="/src/assets/qt-girl.jpg" as="image" type="image/jpeg" />

<!-- AFTER: Remove this line entirely -->
```

### Option 2: Move QT Image to Public Folder

If you want to keep the preload for faster loading:

1. Move `src/assets/qt-girl.jpg` to `public/qt-girl.jpg`
2. Update the preload to `href="/qt-girl.jpg"`
3. Update `RizzScene.tsx` to use `/qt-girl.jpg` instead of the import

---

## Implementation

I recommend **Option 1** (removing the broken preload). The image loads fine without preloading since:
- It's already bundled by Vite
- The RizzScene mounts after user interaction, giving plenty of time to load
- Removing the 404 eliminates the loading delay

### File Changes

| File | Change |
|------|--------|
| `index.html` | Remove the broken `/src/assets/qt-girl.jpg` preload link |

---

## Additional Observations

The video files in `public/music/` folder are likely large. There are 4 video files:
- `fall.mp4`
- `kpfall.mp4` 
- `leaked-video.mp4`
- `rizz.mp4`

If these files are large (several MB each), they could contribute to slow initial page load if the browser decides to prefetch them. However, the code currently only loads `fall.mp4` and delays that by 2 seconds, which is correct.

The **primary fix** is removing the broken preload link.

---

## After Fix

After deploying this fix to Vercel:
1. The 404 error will be eliminated
2. Page load should be noticeably faster
3. The QT image will still load correctly via the ES6 import

---

## Technical Details

### How Vite Handles Assets

```text
Development:
  /src/assets/qt-girl.jpg → served directly

Production Build:
  /src/assets/qt-girl.jpg → ❌ 404 (doesn't exist)
  import from '@/assets/qt-girl.jpg' → /assets/qt-girl-[hash].jpg ✅
```

The ES6 import in RizzScene.tsx generates the correct production URL automatically.

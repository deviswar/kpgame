
## Goal (kpgame.vercel.app only)
Make **QT image always load**, make **Rizz music reliably start**, and reduce **initial slowness** on the Vercel deployment (even if Vercel/CDN caching is behaving weirdly).

---

## What we know from the evidence
- On **Lovable domain** everything works ⇒ the code is mostly correct.
- On **kpgame.vercel.app**:
  - QT image sometimes doesn’t load.
  - Rizz music sometimes doesn’t play.
- Direct URL test: **https://kpgame.vercel.app/music/rizz.mp3 plays** ⇒ the file exists on Vercel, so this is not a “missing public folder” problem.
- This strongly suggests:
  1) **Bundled (hashed) asset** loading is failing/cached incorrectly (QT image is in `src/assets` → hashed filename in `dist/assets/...`), and/or  
  2) **Audio playback promise is being rejected** in some real user cases (gesture timing / browser restrictions), but we’re not surfacing the reason to the user.

So the real fix needs to be both:
- **More robust asset strategy** (avoid fragile hashed asset dependency for critical “first impression” media), and
- **Production-grade diagnostics** (so we can see the real reason on Vercel instantly).

---

## Plan Overview (what I will implement)
### A) Add a “Production Debug Panel” (only when you add `?debug=1`)
This will show (on-screen, not just console):
- Whether QT image loaded (and which URL it tried).
- Whether Rizz preloading succeeded (fetch status / decode status).
- Whether `audio.play()` succeeded or was blocked (exact error string).
- A small list of “critical asset checks”:
  - `/music/rizz.mp3` fetch status
  - `/music/background.mp3` fetch status (optional)
  - QT image status

**Why this is critical:** right now, you’re reporting “not loading/not playing”, but Vercel-only issues are often caching/headers/edge behavior; without surfacing exact errors, we’re guessing.

**Where:**  
- `WelcomeScreen.tsx` (or a small component it renders) to run checks and display results.
- Use `window.location.search.includes('debug=1')` to gate it so normal users never see it.

---

### B) Make QT image “bulletproof” on Vercel by serving it from `/public`
Right now QT image is loaded via Vite import:
- `import qtGirlImage from '@/assets/qt-girl.jpg';`
This becomes a hashed URL in `dist/assets/...` which is normally fine — but if Vercel is serving a stale HTML/JS chunk combination for some users, the hashed file reference can break.

**Fix approach (robust):**
1. Copy `src/assets/qt-girl.jpg` → `public/qt-girl.jpg`
2. Update `RizzScene.tsx` to try the Vite-import URL first, but if it fails, automatically fall back to:
   - `publicAssetUrl('qt-girl.jpg')` (so it’s always reachable from a stable URL)

This makes QT image load even under weird caching conditions.

**Bonus:** In debug mode, show both URLs and which one loaded.

---

### C) Make Rizz music start more reliably (and show the real failure reason)
Your `audioManager.ts` already has sophisticated logic. What’s missing is:
- **Hard confirmation** that playback started (and if not, why).
- A “retry with user gesture” button inside the Rizz scene if the first start fails.

**Implementation changes:**
1. In `audioManager.ts`, add a small exported function (or a returned status) so the UI can know:
   - `started=true/false`
   - `method=webaudio/htmlaudio`
   - `errorMessage` (if any)
2. In `WelcomeScreen.tsx` (and/or `RizzScene.tsx`), if debug mode or if playback failed:
   - show a button: “Tap to enable sound” which calls `playRizz()` again.
   - This handles browsers that reject the first play attempt despite a gesture (it happens).

**Why this helps on Vercel:** If the issue is timing-related (preload not ready, audio context state, etc.), the retry fixes it immediately and the debug output tells us exactly what happened.

---

### D) Reduce initial slowness: remove/limit speculative prefetching that competes with first paint
In `index.html`, there are:
- `preload` for rizz.mp3 (fine)
- `prefetch` for background/mourning (these can still compete on slow networks/devices)

**Change:**
- Remove the `prefetch` tags for non-critical audio and rely on the JS preload (`preloadAllAudio`) after mount / after gesture.
- Keep only what truly matters for first interaction.

This reduces the chance that initial bandwidth/CPU gets eaten before the user even reaches the scene.

---

### E) Add Vercel configuration to prevent “stale HTML vs new hashed assets” mismatches
A common real-world root cause: CDN caches `index.html` too aggressively (or a client keeps an old one), causing broken references to hashed assets.

**Add `vercel.json`** with:
1. SPA rewrites (good hygiene for React Router)
2. Headers to ensure:
   - `index.html` is not cached long (`Cache-Control: no-store` or very short)
   - hashed assets can remain immutable (default is fine)

**Why this matters:**
- If `index.html` is stale but the `assets/*` are from a different deploy, you get exactly what you’re seeing: “some assets missing only on Vercel”.

---

## Exact files I will change (implementation list)
1. `src/components/game/RizzScene.tsx`
   - Add fallback loading to `public/qt-girl.jpg` using `publicAssetUrl`
   - Add debug info hooks (`onLoad`, `onError` shows attempted URL)
2. `public/qt-girl.jpg`
   - Add stable copy of QT image
3. `src/components/game/WelcomeScreen.tsx`
   - Add debug panel behind `?debug=1`
   - Add “retry sound” UX if rizz play fails / show reason
4. `src/lib/audioManager.ts`
   - Expose a simple “last rizz start status” for UI debugging
   - Improve error propagation from play attempts
5. `index.html`
   - Remove non-critical `prefetch` tags (keep only truly critical)
6. `vercel.json`
   - Add SPA rewrite + cache headers (especially for `index.html`)

---

## How we will verify (must be done on kpgame.vercel.app)
### 1) Asset checks
- Open:
  - `https://kpgame.vercel.app/?debug=1`
- Confirm debug panel shows:
  - QT image loaded (either primary import URL or fallback public URL)
  - `/music/rizz.mp3` check is OK

### 2) Audio checks
- Click “Click here to see my rizz”
- Confirm debug shows:
  - play method used (iOS path / WebAudio / HTMLAudio fallback)
  - if failed, exact browser error
- If it fails, press “Tap to enable sound” and confirm it starts.

### 3) Performance checks
- Hard refresh on mobile (or throttled network) and confirm faster first paint
- Confirm no long “waiting” caused by unnecessary prefetch downloads

---

## Important deployment notes (to stop wasting time)
After I implement the above:
1. Push to GitHub (since Vercel builds from GitHub)
2. In Vercel → Deployments → Redeploy (no build cache)
3. Then test with `?debug=1` so we get facts immediately.

---

## Why this plan will actually fix it (not guess)
- QT image: stable `/public` fallback removes dependency on hashed bundles behaving perfectly on every cached client.
- Rizz music: we’ll expose the exact failure reason and add a user-gesture retry path (the only reliable fix when Safari/Chrome blocks the first attempt).
- Slowness: removing speculative prefetch reduces contention, and Vercel cache headers prevent “stale HTML vs new assets” breakage.

If you approve this plan, I’ll implement it in one pass, then you can test `kpgame.vercel.app/?debug=1` and we’ll have undeniable proof of what’s failing (and it will be fixed via fallbacks even if Vercel caching is the culprit).

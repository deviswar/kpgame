

## Summary
Three fixes:
1. Remove the "Loading next adventure..." text below the loading bar
2. Fix iPhone Safari rizz audio not playing
3. Improve website loading speed

---

## Changes

### 1. Remove Loading Bar Text
**File:** `src/components/game/FeedKPGame.tsx`

Delete line 144:
```tsx
<p className="text-white text-sm mt-2 text-center font-medium">Loading next adventure...</p>
```

The loading bar will remain, only the text below it is removed.

---

### 2. Fix iPhone Safari Rizz Audio
**File:** `src/lib/audioManager.ts`

The issue is that iOS Safari requires the audio to be triggered SYNCHRONOUSLY within the user gesture. The current implementation calls `startSilentUnlocker()` first which may be consuming the user gesture.

**Changes:**
1. Move HTMLAudio fallback play attempt to happen FIRST (before WebAudio) since HTMLAudio is more reliable on iOS Safari
2. Add explicit iOS detection to prioritize HTMLAudio on iOS devices
3. Ensure audio play happens synchronously in the click handler

Key changes to `playRizz()` function (lines 154-262):
- Detect iOS Safari and use HTMLAudio as PRIMARY method (not fallback)
- Start the silent unlocker AND the actual audio simultaneously
- Ensure `rizzHtmlAudio.play()` is called synchronously before any async operations

---

### 3. Improve Website Loading Speed
**File:** `index.html`

Remove the console warning by ensuring we don't load Tailwind CDN. The project already uses PostCSS/Tailwind properly, so this warning may come from a dev-mode artifact.

**File:** `src/components/game/AirplaneAnimation.tsx`

The video preloading (fetch as blob) happens immediately on component mount which can compete with other resources. Delay video preload slightly.

---

## Technical Details

### iOS Safari Audio Fix Details
The current code calls:
1. `startSilentUnlocker()` - creates and plays silent audio
2. `unlockIOSWebAudio()` - plays silent buffer
3. `ctx.resume()` - resumes context
4. `rizzBufferSource.start()` - plays actual audio

On iOS Safari, the user gesture "budget" may be consumed by step 1 or 2. The fix:
- Detect iOS: `const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);`
- On iOS, prioritize `rizzHtmlAudio.play()` FIRST in the same synchronous call
- Keep WebAudio as enhancement, not primary path

---

## Result
- Loading bar shows without any text below it
- Rizz audio plays reliably on iPhone Safari
- Faster initial page load


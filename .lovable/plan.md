

## Overview

This plan addresses two requests:
1. **Rizz Scene Audit** - Deep review of music and image loading for reliability on mobile
2. **Airplane Scene Update** - Replace the "Bye guys..." text with "netherlands!" in a yellow strip box (inspired by your reference image style)

---

## Part 1: Rizz Scene - Deep Audit & Improvements

### Current State Analysis

After reviewing the code, here's what I found:

| Component | Current Implementation | Status |
|-----------|----------------------|--------|
| **Rizz Audio (Music 1)** | Web Audio API with AudioBuffer pre-decoding + HTMLAudio fallback | ✅ Well implemented |
| **iOS Silent Mode** | Silent MP3 unlocker playing alongside WebAudio | ✅ Implemented |
| **Audio Preloading** | `<link rel="preload">` in HTML + `precacheRizzAudio()` on mount | ✅ Good |
| **QT Image** | Imported from `src/assets/qt-girl.jpg`, preloaded 500ms after mount | ⚠️ Potential issue |

### Identified Issues

**Issue 1: QT Image Loading Race Condition**
The `qt-girl.jpg` image is included in the delayed preload batch (500ms after mount), but the Rizz Scene can be triggered almost immediately if the user clicks fast. This means:
- User clicks "Click to see my rizz" within 500ms of page load
- The image hasn't been preloaded yet
- Image loads on-demand, causing a visible delay or broken image

**Issue 2: Image Preload Order**
The QT image is last in the preload array, meaning all other game images load before it - but QT is the first image users actually see (in Phase 2).

**Issue 3: No Image Load Error Handling**
If `qt-girl.jpg` fails to load (network issue), there's no fallback or error handling.

### Proposed Fixes

**Fix 1: Prioritize QT Image Preloading**
Move `qtGirlImage` to be preloaded immediately (not in the 500ms delayed batch) since it's critical for the Rizz Scene.

```text
src/components/game/WelcomeScreen.tsx:

Current (line 29):
  const images = [hondaAmazeImg, cementBagsImg, hondaAmaze, pugDog, pugMemorial, pugGrave, qtGirlImage];

Change to:
- Preload qtGirlImage IMMEDIATELY on mount (outside the setTimeout)
- Keep other images in the delayed batch

This ensures the QT image is ready BEFORE the user can click the rizz button.
```

**Fix 2: Add HTML Preload for QT Image**
Add a `<link rel="preload">` for the QT image in `index.html` to leverage browser-level priority loading:

```html
index.html:

Add after the audio preload:
<link rel="preload" href="/src/assets/qt-girl.jpg" as="image" type="image/jpeg" />
```

**Fix 3: Add Image Error Fallback**
Add `onError` handler to the QT image element to show a fallback emoji if loading fails.

**Fix 4: Double-Check Audio Reliability**
The audio implementation looks solid, but I'll add one additional safeguard:
- Add a `rizzAudioReady` state that only enables the rizz button after audio is pre-cached
- This prevents clicking before audio is loaded

---

## Part 2: Airplane Scene - Yellow Strip Box

### Current Implementation (line 171-175 of AirplaneAnimation.tsx)
```tsx
<div className="bg-black px-6 py-3 rounded-xl shadow-xl mb-6">
  <h2 className="text-xl md:text-3xl font-bold text-white text-shadow-game">
    Bye guys, I'm going to Netherlands!
  </h2>
</div>
```

### New Implementation
Replace with a yellow/orange strip box containing just "netherlands!" in white text:

```tsx
<div className="bg-amber-500 px-8 py-3 rounded-lg shadow-xl mb-6 border-4 border-amber-400">
  <h2 className="text-2xl md:text-4xl font-bold text-white tracking-wider">
    netherlands!
  </h2>
</div>
```

This creates a rounded yellow/orange box with white bold text inside - matching the style from your reference image (yellow-orange background with white bold text).

---

## Technical Implementation Summary

### Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Add `<link rel="preload">` for qt-girl.jpg |
| `src/components/game/WelcomeScreen.tsx` | Move qtGirlImage to immediate preload, add image error fallback, optionally gate button on audio readiness |
| `src/components/game/AirplaneAnimation.tsx` | Replace black box with yellow strip box containing "netherlands!" |

### Expected Outcomes

1. **QT Image**: Will load immediately on page load, guaranteed ready before user can click rizz button
2. **Rizz Audio**: Already well-optimized; minor polish to ensure button isn't clickable until ready
3. **Airplane Scene**: Will show "netherlands!" in a yellow strip box with white text


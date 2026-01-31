
# Fix Rizz Music Delay & Leaked Video Issues

## Problem 1: Rizz Music Plays with Delay

**Root Cause:** The audio file `/music/rizz.mp4` is fetched AFTER the user clicks. Even though we create the Audio element synchronously, the browser still needs to download the file first.

**Solution:** Pre-fetch the audio file data into browser cache on page load, so when user clicks, the Audio element loads from cache instantly.

---

## Problem 2: Leaked Video Has Delay + Shows Controls

**Root Cause:** 
- Video has `controls` attribute showing pause/fullscreen options
- Video is preloaded into a hidden element but the displayed video is a NEW element loading fresh

**Solution:**
- Remove `controls` attribute
- Add CSS to hide any native controls: `pointer-events: none` and `-webkit-media-controls: none`
- Transfer the preloaded video blob data to the displayed video for instant playback

---

## Technical Implementation

### File: `src/lib/audioManager.ts`

Add a new function to pre-cache the rizz audio file:

```typescript
// Pre-cache rizz audio data using fetch API
let rizzAudioBlobUrl: string | null = null;

export const precacheRizzAudio = async () => {
  try {
    const response = await fetch('/music/rizz.mp4');
    const blob = await response.blob();
    rizzAudioBlobUrl = URL.createObjectURL(blob);
    console.log('Rizz audio pre-cached as blob');
  } catch (e) {
    console.error('Failed to pre-cache rizz audio:', e);
  }
};

export const playRizz = () => {
  // Use cached blob URL if available, otherwise fall back to direct URL
  const audioSource = rizzAudioBlobUrl || '/music/rizz.mp4';
  rizzAudio = new Audio(audioSource);
  // ... rest of play logic
};
```

### File: `src/components/game/WelcomeScreen.tsx`

Call pre-cache function on mount:

```typescript
import { precacheRizzAudio, playRizz, ... } from '@/lib/audioManager';

useEffect(() => {
  // Pre-cache rizz audio for instant playback
  precacheRizzAudio();
  
  // ... rest of preload logic
}, []);
```

### File: `src/components/game/AirplaneAnimation.tsx`

Fix video to have no controls and instant playback:

```typescript
// Video screen - updated
<video
  ref={videoRef}
  src="/music/kpfall.mp4"
  autoPlay
  loop
  playsInline
  preload="auto"
  muted
  className="max-w-full max-h-full rounded-2xl shadow-2xl border-4 border-primary/50"
  style={{ 
    maxHeight: '50vh',
    pointerEvents: 'none'  // Disable all touch interactions
  }}
  // Remove controls attribute entirely
  // Add webkit-specific CSS to hide controls
  onContextMenu={(e) => e.preventDefault()}  // Disable right-click menu
/>
```

Add CSS class to hide controls completely:

```css
/* In index.css */
video::-webkit-media-controls {
  display: none !important;
}

video::-webkit-media-controls-enclosure {
  display: none !important;
}

video::-webkit-media-controls-panel {
  display: none !important;
}
```

Also preload as blob for instant playback:

```typescript
// Enhanced preload with blob caching
useEffect(() => {
  const preloadVideo = async () => {
    try {
      const response = await fetch('/music/kpfall.mp4');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      preloadedVideoRef.current = blobUrl;
      setVideoPreloaded(true);
    } catch (e) {
      // Fallback to regular preload
    }
  };
  preloadVideo();
}, []);

// Use blob URL when showing video
<video src={preloadedVideoRef.current || '/music/kpfall.mp4'} ... />
```

---

## Summary of Changes

| File | Changes |
|------|---------|
| `src/lib/audioManager.ts` | Add `precacheRizzAudio()` function that fetches audio as blob for instant loading |
| `src/components/game/WelcomeScreen.tsx` | Call `precacheRizzAudio()` on mount |
| `src/components/game/AirplaneAnimation.tsx` | Remove `controls` attribute, add `pointerEvents: 'none'`, use blob URL for video |
| `src/index.css` | Add CSS rules to hide webkit video controls |

This will make both the rizz music and leaked video play instantly with zero delay!

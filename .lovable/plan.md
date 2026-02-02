

## Summary

Two critical fixes:

1. **Permanently fix rizz scene music leaking to other screens** - The rizz audio is being "queued" by iOS but starts later when another audio triggers. We need to:
   - Force-stop rizz audio at every scene transition
   - Isolate rizz scene into its own dedicated component file
   - Ensure rizz audio is truly stopped before game music can start

2. **Update "Don't Click" button styling** - Change from red/pink gradient to black circle with white text and light orange glow

---

## Root Cause Analysis

The problem is that on iOS 15-16, Safari's audio playback restrictions can cause `audio.play()` to silently "queue" rather than truly start. When the user later taps "Tap to start the game", the `playGameMusic()` function starts, which triggers more audio activity. This inadvertently "releases" the queued rizz audio, causing it to play on the wrong screen.

The fix requires **aggressive force-stopping** of rizz audio before any other music starts, plus creating an isolated component for the rizz scene so future changes won't accidentally break its audio logic.

---

## Changes

### 1. Create Isolated Rizz Scene Component
**File (NEW):** `src/components/game/RizzScene.tsx`

Move the entire Phase 2 (rizz scene) from `WelcomeScreen.tsx` into its own file. This includes:
- The rizz attempt UI with KP and QT characters
- Speech bubbles
- "Tap to start the game" button
- All associated styling

The component will receive:
- `onStart`: callback when user taps "Tap to start"
- Internal state for QT image loading/error

This isolates the rizz scene so other code changes won't accidentally affect it.

---

### 2. Update WelcomeScreen to Use RizzScene
**File:** `src/components/game/WelcomeScreen.tsx`

- Remove Phase 2 inline code
- Import and render `<RizzScene onStart={handleStartGame} />` when `showRizzScene` is true
- Keep Phase 1 (initial welcome screen) inline

---

### 3. Force-Stop Rizz in ALL Scene Transitions
**File:** `src/lib/audioManager.ts`

Add a new `forceStopRizz()` function that aggressively stops rizz audio:

```typescript
export const forceStopRizz = () => {
  rizzPlaying = false;
  stopSilentUnlocker();
  
  // Stop WebAudio source
  if (rizzBufferSource) {
    try { rizzBufferSource.stop(); } catch {}
    rizzBufferSource.disconnect();
    rizzBufferSource = null;
  }
  
  // Stop HTMLAudio - CRITICAL: pause AND set src empty to truly release
  if (rizzHtmlAudio) {
    rizzHtmlAudio.pause();
    rizzHtmlAudio.currentTime = 0;
    // Remove event listeners that might re-trigger
    rizzHtmlAudio.onplay = null;
    rizzHtmlAudio.oncanplay = null;
  }
};
```

Then call `forceStopRizz()` at the START of:
- `playGameMusic()` (line ~439)
- `playMourningMusic()` (line ~491)
- `stopAll()` (line ~548)

This ensures rizz cannot "leak" into other scenes.

---

### 4. Update stopRizz to Match forceStopRizz
**File:** `src/lib/audioManager.ts`

Update the existing `stopRizz()` function (lines 349-369) to be as aggressive as `forceStopRizz`:
- Clear any pending event listeners on the HTMLAudio element
- Ensure the audio is truly stopped, not just paused

---

### 5. Update "Don't Click" Button Styling
**File:** `src/components/game/AirplaneAnimation.tsx`

Change the button (lines 119-129):

**Current:**
```tsx
className="... bg-gradient-to-br from-red-500 to-pink-600 ..."
```

**New:**
```tsx
className="... bg-black ..."
```

The text is already white, so no change needed there.

---

### 6. Update Glow Animation Color
**File:** `src/index.css`

Update the `glow-pulse` keyframe animation (lines 503-514):

**Current (red/pink):**
```css
box-shadow: 0 0 10px #ff6b6b, 0 0 20px #ff6b6b, 0 0 30px #ff6b6b;
```

**New (light orange):**
```css
box-shadow: 0 0 10px #FFB347, 0 0 20px #FFB347, 0 0 30px #FFB347;
```

And for the 50% state:
```css
box-shadow: 0 0 15px #FFA500, 0 0 30px #FFA500, 0 0 45px #FFA500, 0 0 60px #FFA500;
```

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/game/RizzScene.tsx` | NEW - Isolated rizz scene component |
| `src/components/game/WelcomeScreen.tsx` | Delegate Phase 2 to RizzScene |
| `src/lib/audioManager.ts` | Add forceStopRizz(), update stopRizz(), call forceStopRizz in all transitions |
| `src/components/game/AirplaneAnimation.tsx` | Change button to black background |
| `src/index.css` | Update glow-pulse to light orange |

---

## Technical Details

### Why Rizz Audio Leaks on iOS 15-16

iOS Safari has strict autoplay policies. When `audio.play()` is called:
1. If the user gesture context is valid, audio starts immediately
2. If the gesture context has "expired" (due to async operations or timing), Safari may silently queue the request

The current code calls `playRizz()` → `startSilentUnlocker()` → `audio.play()`. On iOS 15-16, the silent unlocker call may consume the gesture, leaving the actual rizz play in a "pending" state. Later, when `playGameMusic()` is called, it creates new audio activity that Safari interprets as a new opportunity to honor the pending play request.

### The Fix

By calling `forceStopRizz()` at the START of every other music function, we:
1. Explicitly stop any pending/playing rizz audio
2. Clear event listeners that might re-trigger playback
3. Reset all state flags

This guarantees rizz audio ONLY plays during the rizz scene.

---

## Expected Result

- Rizz scene music plays ONLY during the rizz scene
- No audio leakage to game screen or any later screens
- "Don't Click" button: black circle, white text, light orange pulsing glow
- Rizz scene code is isolated in its own file for future maintainability


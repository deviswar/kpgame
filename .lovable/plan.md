
# Fix Music System - Complete Rewrite

## Problem Summary
The music system has multiple audio refs creating conflicts:
- `MilkHospitalScreen` creates its own mourning audio (causes duplicate)
- Music 1 stops too early (at showMilkHospital instead of at mourning phase)
- Music 2 doesn't persist because the ref is lost when screens change

## Solution: Single Audio Controller in FeedKPGame

The parent component `FeedKPGame.tsx` should be the ONLY place managing audio. Child components should NOT create their own audio instances.

---

## Changes Required

### File 1: `src/components/game/FeedKPGame.tsx`

**Remove the problematic effect that stops Music 1 too early (lines 46-59)**

Currently it stops Music 1 when `showMilkHospital` is true, but Music 1 should keep playing during the crash scene until mourning starts.

**Update the keep-audio-playing effect:**
- Music 1 should play during: game start, cow fight, and milk hospital UNTIL mourning starts
- Add a new state `mourningStarted` to track when mourning actually begins
- Only stop Music 1 when mourning phase actually starts (via callback)

**Update `handleStartMourningMusic` callback:**
- This is already correct - it stops Music 1 and starts Music 2
- The `mourningAudioRef.current` is stored in FeedKPGame and persists across screen changes

**The key insight**: Since `FeedKPGame` renders `MilkHospitalScreen` and `AirplaneAnimation` as children (not separate routes), the `mourningAudioRef` in `FeedKPGame` persists through all screens. The audio should continue playing.

### File 2: `src/components/game/MilkHospitalScreen.tsx`

**Remove the local mourning audio creation (lines 48-60)**

This component should NOT create its own audio. Remove:
- Lines 48-60: Remove the mourning audio preload
- Lines 34, 56-59: Remove `mourningAudioRef` local ref

**Update `handleTakePuppyToHospital` (lines 64-81):**

Simply call `onStartMourningMusic?.()` - don't try to play local audio.

```tsx
const handleTakePuppyToHospital = () => {
  // Call parent to handle mourning music (stops Music 1, starts Music 2)
  onStartMourningMusic?.();
  
  // Go to mourning phase
  setPhase('mourning');
  setWaitingForUserTap(false);
  
  // ... rest of flash effects
};
```

### File 3: `src/components/game/AirplaneAnimation.tsx`

**The mourning music should already be playing from the parent**

No changes needed for music - the `mourningAudioRef` in `FeedKPGame` persists.

**For the video**: Since user wants video audio allowed, keep the video unmuted. The mourning music will continue playing underneath (or we can pause it during video).

---

## Technical Implementation

### FeedKPGame.tsx Changes:

```tsx
// Line 46-59: CHANGE the keep-audio effect
// Only stop the interval when mourningAudioRef exists (mourning started)
useEffect(() => {
  // Keep Music 1 playing UNTIL mourning music starts
  if (gameStarted && audioRef.current && !mourningAudioRef.current) {
    const checkAudio = setInterval(() => {
      if (audioRef.current && audioRef.current.paused && !mourningAudioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }, 1000);

    return () => clearInterval(checkAudio);
  }
}, [gameStarted]);

// Line 61-72: REMOVE the showAirplane effect (unnecessary)
// Music 1 is already stopped by handleStartMourningMusic

// handleStartMourningMusic (lines 118-151): Keep as-is
// It correctly stops Music 1 and starts Music 2
```

### MilkHospitalScreen.tsx Changes:

```tsx
// REMOVE lines 34, 48-60 (local mourningAudioRef)
// Keep only image preloading

// SIMPLIFY handleTakePuppyToHospital:
const handleTakePuppyToHospital = () => {
  // Parent handles all audio (stops Music 1, starts Music 2)
  onStartMourningMusic?.();
  
  setPhase('mourning');
  setWaitingForUserTap(false);
  
  // Flash effects...
  setShowMourningFlash(true);
  // ... rest unchanged
};

// REMOVE cleanup in useEffect (lines 55-60)
```

---

## Summary of Files to Modify

| File | Action |
|------|--------|
| `src/components/game/FeedKPGame.tsx` | Fix keep-audio effect to check `mourningAudioRef` instead of `showMilkHospital`; Remove redundant showAirplane effect |
| `src/components/game/MilkHospitalScreen.tsx` | Remove local mourning audio; Simplify button handler to just call parent callback |

---

## Expected Behavior After Fix

1. **Tap to start** → Music 1 starts playing
2. **Feed KP** → Music 1 continues
3. **Cow Fight** → Music 1 continues
4. **Milk Hospital crash** → Music 1 continues
5. **Tap "Take puppy to hospital"** → Music 1 STOPS, Music 2 STARTS
6. **Mourning scene** → Music 2 playing
7. **End screen (Airplane)** → Music 2 continues
8. **Watch leaked video** → Music 2 continues + Video audio plays
9. **Go to Home** → Music 2 stops, game resets

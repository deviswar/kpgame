
# Add Rizz Scene Audio

## Overview
Add a dedicated audio track that plays **only** during the rizz scene (Phase 2 of the Welcome Screen). The audio will:
1. Start when user clicks "Click here to see my rizz" button
2. Play during the entire rizz scene
3. Stop when user clicks "Tap to start the game" button
4. Then Music 1 (background.mp3) starts as usual

---

## File Changes

### 1. Copy Audio File to Project
Copy the uploaded audio file to the public music folder for consistent audio file organization.

| Source | Destination |
|--------|-------------|
| `user-uploads://audio.mp4` | `public/music/rizz.mp4` |

---

### 2. Update WelcomeScreen Component

**File:** `src/components/game/WelcomeScreen.tsx`

**Changes:**

1. **Add useRef for audio management:**
```typescript
import { useState, useRef, useEffect } from 'react';

const rizzAudioRef = useRef<HTMLAudioElement | null>(null);
```

2. **Add cleanup effect:**
```typescript
useEffect(() => {
  return () => {
    // Cleanup audio on unmount
    if (rizzAudioRef.current) {
      rizzAudioRef.current.pause();
      rizzAudioRef.current = null;
    }
  };
}, []);
```

3. **Create handler for "see my rizz" button:**
```typescript
const handleShowRizz = () => {
  setShowRizzScene(true);
  
  // Start rizz audio
  const audio = new Audio('/music/rizz.mp4');
  audio.volume = 0.5;
  audio.loop = true;
  audio.play().catch(e => console.error('Rizz audio failed:', e));
  rizzAudioRef.current = audio;
};
```

4. **Create handler for "start game" button:**
```typescript
const handleStartGame = () => {
  // Stop rizz audio
  if (rizzAudioRef.current) {
    rizzAudioRef.current.pause();
    rizzAudioRef.current = null;
  }
  
  // Call original onStart (which triggers Music 1)
  onStart();
};
```

5. **Update button onClick handlers:**
   - "Click here to see my rizz" button: `onClick={handleShowRizz}` (instead of inline setState)
   - "Tap to start the game" button: `onClick={handleStartGame}` (instead of `onStart`)

---

## Audio Flow Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                      WELCOME SCREEN                          │
│                                                              │
│  Phase 1: Fun Facts                                          │
│  ┌──────────────────────────────────┐                        │
│  │  "Click here to see my rizz" 🥰  │ ── Click ──┐          │
│  └──────────────────────────────────┘            │          │
│                                                   ▼          │
│  Phase 2: Rizz Scene                     🎵 RIZZ AUDIO       │
│  ┌──────────────────────────────────┐    (starts playing)    │
│  │  👆 Tap to start the game        │ ── Click ──┐          │
│  └──────────────────────────────────┘            │          │
│                                                   ▼          │
└─────────────────────────────────────────────────────────────┘
                                                   │
                                          🔇 RIZZ AUDIO STOPS
                                          🎵 MUSIC 1 STARTS
                                                   │
                                                   ▼
                                        ┌──────────────────┐
                                        │   FEED KP GAME   │
                                        └──────────────────┘
```

---

## Summary

| Step | Action |
|------|--------|
| 1 | Copy `audio.mp4` to `public/music/rizz.mp4` |
| 2 | Add `useRef` and `useEffect` for audio management |
| 3 | Create `handleShowRizz()` to play rizz audio |
| 4 | Create `handleStartGame()` to stop rizz audio and call `onStart()` |
| 5 | Update both button onClick handlers |

The rizz audio will loop continuously during the rizz scene, giving it its own unique vibe before transitioning to the main game with Music 1.

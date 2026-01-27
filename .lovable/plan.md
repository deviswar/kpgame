

# Fix Music Playback: Music 1 (Welcome to Hospital) and Music 2 (Mourning to End)

## The Problem

There are 3 audio issues happening:

1. **Music 1 plays on end screen**: The code in FeedKPGame keeps trying to restart Music 1 even after Music 2 should be playing
2. **Music 2 stops when leaving mourning scene**: When MilkHospitalScreen unmounts, it cleans up and stops Music 2
3. **Music 1 doesn't play on game replay**: The audio state gets confused between replays

## The Solution

Move Music 2 management to the parent component (FeedKPGame) so it persists across scene transitions.

## Music Flow

```text
Welcome Screen -> Feed Game -> Cow Fight -> Milk Hospital
      |______________ MUSIC 1 _______________|
                                                    
                                   Mourning Phase -> Airplane End Screen -> Go Home
                                   |_______ MUSIC 2 ___________________|      |
                                                                              v
                                                                    (Stop Music 2)
                                                                              |
                                                                              v
                                                              Welcome Screen (Music 1 on tap)
```

## Technical Changes

### File 1: FeedKPGame.tsx

**Add mourning audio ref at component level:**
```typescript
const mourningAudioRef = useRef<HTMLAudioElement | null>(null);
```

**Update the audio check effect to not restart Music 1 when Music 2 is playing:**
```typescript
useEffect(() => {
  if (gameStarted && audioRef.current && !showMilkHospital && !showAirplane) {
    const checkAudio = setInterval(() => {
      // Only keep Music 1 playing if mourning music is NOT playing
      if (audioRef.current && audioRef.current.paused && !mourningAudioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }, 1000);
    return () => clearInterval(checkAudio);
  }
}, [gameStarted, showMilkHospital, showAirplane]);
```

**Add callback to start mourning music (passed to MilkHospitalScreen):**
```typescript
const handleStartMourningMusic = useCallback(() => {
  // Stop Music 1 completely
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
  // Start Music 2 and keep it playing
  const mourningAudio = new Audio('/music/mourning.mp3');
  mourningAudio.volume = 0.5;
  mourningAudio.loop = true;
  mourningAudio.play().catch(() => {});
  mourningAudioRef.current = mourningAudio;
}, []);
```

**Update handleGoHome to stop Music 2:**
```typescript
const handleGoHome = () => {
  // Stop Music 2 if playing
  if (mourningAudioRef.current) {
    mourningAudioRef.current.pause();
    mourningAudioRef.current = null;
  }
  // Stop Music 1 if playing
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
  // ... rest of reset logic
};
```

**Pass the callback to MilkHospitalScreen:**
```typescript
<MilkHospitalScreen 
  onComplete={handleMilkHospitalComplete} 
  onStartMourningMusic={handleStartMourningMusic}
/>
```

### File 2: MilkHospitalScreen.tsx

**Update props interface:**
```typescript
interface MilkHospitalScreenProps {
  onComplete: () => void;
  onStartMourningMusic?: () => void;
}
```

**Remove local mourning audio handling, call parent callback instead:**
```typescript
// At 17000ms (1 second into mourning):
timers.push(setTimeout(() => {
  // Call parent to handle music switch
  onStartMourningMusic?.();
  
  // 5 transparent flashes (keep this logic)
  setShowMourningFlash(true);
  // ... flash timing code stays the same
}, 17000));
```

**Remove mourning audio cleanup from component** (parent now manages it)

## Summary of Changes

| File | What Changes |
|------|--------------|
| `FeedKPGame.tsx` | Add `mourningAudioRef`, `handleStartMourningMusic` callback, update audio check effect, stop Music 2 in `handleGoHome` |
| `MilkHospitalScreen.tsx` | Remove `audioRef` prop, add `onStartMourningMusic` prop, remove local mourning audio logic, call parent callback for music switch |

## Result

- Music 1: Plays from Welcome through Hospital scene only
- Music 2: Starts in mourning phase, continues through Airplane end screen
- On "Go Home": Music 2 stops, game resets, Music 1 plays again on tap start


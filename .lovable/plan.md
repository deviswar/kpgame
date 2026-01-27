

# Enhance Mourning Scene with Bigger Images, Longer Duration, and Music Switch

## Overview
Make the mourning scene more impactful by:
1. Making the pug memorial and grave images larger and closer to KP
2. Extending the scene duration by 3 seconds
3. Switching from music 1 to music 2 after 1 second of the mourning scene

## Changes Summary

### 1. Mourning Scene Layout Changes
**Current**: Images are `w-40 md:w-56` (top) and `w-48 md:w-64` (bottom), spread apart with `justify-between`  
**New**: Images will be `w-56 md:w-72` (top) and `w-64 md:w-80` (bottom), using `justify-center gap-4` to bring them closer to KP

### 2. Timing Adjustments
| Event | Current | New |
|-------|---------|-----|
| Mourning starts | 16000ms | 16000ms (unchanged) |
| Switch to music 2 | - | 17000ms (1 second after mourning) |
| Scene complete | 22000ms | 25000ms (+3 seconds) |

### 3. Music Switching Logic
- Add a new audio file: `public/music/mourning.mp3` (you'll upload this)
- At mourning phase + 1 second: fade out music 1, start music 2
- The component will need access to control the audio (pass audioRef as prop or manage internally)

## Technical Details

### Files to Modify/Create

| File | Changes |
|------|---------|
| `public/music/mourning.mp3` | Add the new music file (you'll upload) |
| `src/components/game/MilkHospitalScreen.tsx` | Update image sizes, layout, timing, and add music switching logic |
| `src/components/game/FeedKPGame.tsx` | Pass audio ref to MilkHospitalScreen for music control |

### Updated MilkHospitalScreen Props
```typescript
interface MilkHospitalScreenProps {
  onComplete: () => void;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}
```

### Music Switch Logic in MilkHospitalScreen
```typescript
const [mourningMusicRef, setMourningMusicRef] = useState<HTMLAudioElement | null>(null);

// When mourning phase starts + 1 second:
timers.push(setTimeout(() => {
  // Fade out original music
  if (audioRef?.current) {
    audioRef.current.pause();
  }
  // Start mourning music
  const mourningAudio = new Audio('/music/mourning.mp3');
  mourningAudio.volume = 0.5;
  mourningAudio.play();
  setMourningMusicRef(mourningAudio);
}, 17000)); // 1 second after mourning starts at 16000ms
```

### Updated Mourning Scene Layout
```typescript
{isMourningScene && (
  <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600 
                  flex flex-col items-center justify-center gap-4 py-4 animate-fade-in">
    {/* Top - Pug Memorial Photo - BIGGER */}
    <div className="w-56 md:w-72 rounded-xl overflow-hidden shadow-2xl border-4 border-amber-600 animate-scale-in">
      <img src={pugMemorial} alt="Pug Memorial" className="w-full h-auto" />
    </div>
    
    {/* Center - KP Crying */}
    <div className="flex flex-col items-center">
      <KPCharacter scale={1} isCrying={true} isHappy={false} happiness={0} />
      <p className="text-white text-xl font-bold mt-2">Sorry... 😢</p>
    </div>
    
    {/* Bottom - Pug Grave - BIGGER */}
    <div className="w-64 md:w-80 rounded-xl overflow-hidden shadow-2xl animate-scale-in">
      <img src={pugGrave} alt="Pug Grave" className="w-full h-auto" />
    </div>
  </div>
)}
```

## Next Steps
Please upload the mourning music file (music 2) and I'll implement all these changes together.


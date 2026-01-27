

# Welcome Screen and Milk Hospital Scene Enhancements

## Overview
Two areas need updates:
1. **Welcome Screen**: Add volume hint text with blinking/bouncing animation
2. **Milk Hospital Scene**: Adjust timing, positioning, and sizes

---

## Part 1: Welcome Screen Changes

### Current State
- "Powered by Rapido" text at line 56-58
- No volume hint exists

### Changes
Add a new line below "Powered by Rapido" with special animation:

**New text**: "Turn your volume up for the best experience"
- Emoji: speaker icon (🔊)
- Animation: Blink 3 times + bounce once, then stop

**Implementation**:
- Add the text after the Rapido line
- Create a custom animation class that combines blinking (3x) and one bounce
- The animation runs once on page load

---

## Part 2: Milk Hospital Scene Changes

### 2a. Extend Scene by 1.5 Seconds

Current timing progression:
| Phase | Current Time |
|-------|--------------|
| Hospital shows | 2000ms |
| KP exits | 4000ms |
| Popup appears | 6000ms |
| Enter car | 8000ms |

**New timing** (add 1.5s buffer to kp-exit and popup phases):

| Phase | New Time |
|-------|----------|
| Hospital shows | 2000ms |
| KP exits | 3500ms (+1.5s for walking to left) |
| Popup appears | 5500ms (simultaneous with left position) |
| Enter car | 7500ms |
| Driving | 9500ms |
| Dog appears | 11500ms |
| Crash | 14000ms |
| Aftermath | 15500ms |
| Mourning | 17500ms |
| Music switch | 18500ms |
| Complete | 28000ms |

### 2b. KP Exits Door and Moves to LEFT (not center)

**Current behavior** (lines 171-182):
- KP starts at center (`left-1/2`) and stays at center
- In `enter-car` phase, moves to right (`left-[65%]`)

**New behavior**:
- `kp-exit`: KP appears at door (center), then transitions to LEFT side (`left-[25%]`)
- `popup`: KP stays at left position while popup shows on RIGHT

### 2c. Energy Popup on RIGHT Side

**Current** (lines 184-195):
- Popup appears centered (`left-1/2 -translate-x-1/2`)

**New**:
- Position on right side: `right-[10%]` or `left-[70%]`
- Keep the same animation and styling

### 2d. Ad Banners - Make BIGGER and Same Size

**Current sizes** (lines 151-167):
- Left banner: `w-20 h-28 md:w-28 md:h-40`
- Right banner: `w-20 h-28 md:w-28 md:h-40`

**New sizes** (all same, bigger):
- Both banners: `w-28 h-40 md:w-36 md:h-52`

### 2e. Hospital Building - Make Smaller

**Current sizes** (lines 120-149):
- Roof: `w-48 h-8`
- Building body: `w-44 h-40`

**New sizes** (reduce by ~20%):
- Roof: `w-40 h-6`
- Building body: `w-36 h-32`
- Adjust windows and door proportionally

---

## Technical Details

### File 1: src/index.css

Add new keyframe animation for the volume hint:

```css
@keyframes blink-bounce {
  0%, 20%, 40% { opacity: 0; transform: translateY(0); }
  10%, 30%, 50% { opacity: 1; transform: translateY(0); }
  60% { opacity: 1; transform: translateY(-8px); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-blink-bounce {
  animation: blink-bounce 2s ease-out forwards;
}
```

### File 2: src/components/game/WelcomeScreen.tsx

Add volume hint text after line 58:

```tsx
<p className="text-primary-foreground/80 text-xs md:text-sm font-medium">
  Powered by <span className="text-yellow-400 font-bold">Rapido</span>
</p>
{/* Volume hint with blinking and bounce animation */}
<p className="text-primary-foreground/70 text-xs md:text-sm font-medium animate-blink-bounce">
  🔊 Turn your volume up for the best experience
</p>
```

### File 3: src/components/game/MilkHospitalScreen.tsx

**Timing changes** (useEffect timers):
```typescript
// Adjusted timings (+1.5s total)
timers.push(setTimeout(() => setPhase('kp-exit'), 2000));
timers.push(setTimeout(() => setPhase('popup'), 3500));  // Was 4000
timers.push(setTimeout(() => setPhase('enter-car'), 5500)); // Was 6000
timers.push(setTimeout(() => setPhase('driving'), 7500));  // Was 8000
// ... continue shifting all subsequent timers by +1500ms
```

**KP positioning** (update lines 171-182):
```tsx
{(phase === 'kp-exit' || phase === 'popup' || phase === 'enter-car') && (
  <div 
    className={`absolute transition-all duration-1000 ease-out ${
      phase === 'kp-exit' ? 'top-[52%] left-[25%]' :  // Move to LEFT
      phase === 'popup' ? 'top-[58%] left-[25%]' :     // Stay at LEFT
      'top-[60%] left-[65%] scale-75 opacity-0'
    }`}
  >
    <KPCharacter scale={0.7} isHappy={true} happiness={100} />
  </div>
)}
```

**Energy popup on RIGHT** (update lines 184-195):
```tsx
{phase === 'popup' && (
  <div className="absolute top-[50%] right-[15%] animate-energy-popup z-10">
    {/* ... same popup content ... */}
  </div>
)}
```

**Smaller hospital building**:
```tsx
{/* Roof - smaller */}
<div className="absolute -top-5 left-1/2 -translate-x-1/2 w-40 h-6 ..." />

{/* Building Body - smaller */}
<div className="w-36 h-32 bg-gradient-to-b ...">
  {/* Adjust interior elements proportionally */}
</div>
```

**Bigger ad banners (same size)**:
```tsx
{/* Left Banner */}
<div className="absolute -left-28 md:-left-40 top-0 w-28 h-40 md:w-36 md:h-52 ...">

{/* Right Banner */}
<div className="absolute -right-28 md:-right-40 top-0 w-28 h-40 md:w-36 md:h-52 ...">
```

---

## Summary of All Changes

| File | Changes |
|------|---------|
| `src/index.css` | Add `blink-bounce` keyframe animation |
| `src/components/game/WelcomeScreen.tsx` | Add volume hint text with animation below "Powered by Rapido" |
| `src/components/game/MilkHospitalScreen.tsx` | Extend timing by 1.5s, move KP to left, popup to right, bigger banners, smaller hospital |




# Add Mourning Scene After Car Crash

## Overview
After the car hits the pug dog, a new emotional scene will appear showing KP crying in the center with two memorial images - one at the top and one at the bottom.

## The New Scene Layout

```text
+--------------------------------+
|                                |
|     [Pug Memorial Photo]       |  <- pug1.jpeg (framed with garland)
|                                |
|                                |
|         😢 KP Crying 😢        |  <- KP character with isCrying=true
|                                |
|                                |
|      [Pug Grave Scene]         |  <- pug2.jpeg (grave with photo)
|                                |
+--------------------------------+
```

## Implementation Steps

### 1. Copy Uploaded Images to Assets
- Copy `pug1.jpeg` to `src/assets/pug-memorial.jpg` (the framed photo with garland)
- Copy `pug2.jpeg` to `src/assets/pug-grave.jpg` (the grave scene)

### 2. Update Phase Types
Add a new `mourning` phase to the Phase type:
```typescript
type Phase = 'hospital' | 'kp-exit' | 'popup' | 'enter-car' | 'driving' | 'dog-appears' | 'crash' | 'aftermath' | 'mourning';
```

### 3. Update Phase Timing
Adjust the sequence timing:
- Current `aftermath` phase: 14000ms
- New `mourning` phase: 16000ms (after the crash text has been shown)
- Move `onComplete()` call to 22000ms to give time for mourning scene

### 4. Create Mourning Scene UI
A new scene section with:
- Sad gradient background (dark/somber colors)
- Top image: Pug memorial photo with decorative frame styling
- Center: KP character with `isCrying={true}` prop
- Bottom image: Pug grave scene
- Optional sad emojis or text like "RIP" or "Sorry..."

### 5. Update Scene Conditionals
Add `mourning` to the scene logic and hide the road scene when mourning begins.

## Technical Details

### Files to Modify
| File | Changes |
|------|---------|
| `src/assets/pug-memorial.jpg` | Copy pug1.jpeg |
| `src/assets/pug-grave.jpg` | Copy pug2.jpeg |
| `src/components/game/MilkHospitalScreen.tsx` | Add mourning phase, imports, and UI |

### New Phase Timing Sequence
| Phase | Time (ms) | Description |
|-------|-----------|-------------|
| hospital | 0 | Building fades in |
| kp-exit | 2000 | KP exits door |
| popup | 4000 | Energy boosted popup |
| enter-car | 6000 | KP walks to car |
| driving | 8000 | Car starts moving |
| dog-appears | 10000 | Dog enters from right |
| crash | 12500 | Collision with BONK text |
| aftermath | 14000 | After crash effects |
| mourning | 16000 | KP crying scene |
| complete | 22000 | Transition to airplane |

### Mourning Scene Structure
```typescript
{phase === 'mourning' && (
  <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600 flex flex-col items-center justify-between py-8">
    {/* Top - Pug Memorial Photo */}
    <div className="w-40 md:w-56 rounded-xl overflow-hidden shadow-2xl border-4 border-amber-600">
      <img src={pugMemorial} alt="Pug Memorial" className="w-full h-auto" />
    </div>
    
    {/* Center - KP Crying */}
    <div className="flex flex-col items-center">
      <KPCharacter scale={1} isCrying={true} isHappy={false} happiness={0} />
      <p className="text-white text-xl font-bold mt-4">Sorry... 😢</p>
    </div>
    
    {/* Bottom - Pug Grave */}
    <div className="w-48 md:w-64 rounded-xl overflow-hidden shadow-2xl">
      <img src={pugGrave} alt="Pug Grave" className="w-full h-auto" />
    </div>
  </div>
)}
```


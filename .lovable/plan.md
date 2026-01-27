
# Milk Hospital & Dog Crash Sequence

## Overview
After the cow fight KO, a new "Milk Hospital" screen will appear with an animated sequence:
1. Hospital building with ad banners displayed
2. KP emerges from the hospital
3. "Drank milk, energy boosted!" popup appears for 2 seconds
4. KP enters the Honda Amaze car
5. Car drives forward on a road
6. Pug dog appears on the road
7. Car hits the dog

---

## Game Flow Update

```text
+------------------+     +----------------+     +-------------------+     +------------------+
| Welcome Screen   | --> | Feeding Screen | --> | Cow Fight Screen  | --> | Milk Hospital    |
+------------------+     +----------------+     +-------------------+     +------------------+
                                                                                    |
                                                                                    v
                                                                          +------------------+
                                                                          | End Screen       |
                                                                          | (Airplane)       |
                                                                          +------------------+
```

---

## Implementation Steps

### Step 1: Copy All Images to Project Assets
Copy the uploaded images to `src/assets/`:
- `honda-amaze-car.jpg` - Honda Amaze car image
- `pug-dog.webp` - Pug dog image  
- `rose-milk-banner.png` - Gomatha Village Rose Milk banner
- `village-milk-banner.png` - Village Raw Milk banner (Telugu)

### Step 2: Create MilkHospitalScreen Component
New file: `src/components/game/MilkHospitalScreen.tsx`

**Visual Layout:**
- Dark blue/purple gradient background (similar to cow fight arena)
- Hospital building in the center-bottom area with:
  - Building facade with windows
  - Large "MILK HOSPITAL" sign on top
  - Red cross symbols
  - Two ad banners (Rose Milk & Village Milk) on building sides
  - Hospital entrance door at bottom

**Animation Phases:**
1. **Phase 1 (0-2s)**: Hospital building fades in
2. **Phase 2 (2-4s)**: KP walks out from hospital door
3. **Phase 3 (4-6s)**: Popup "Drank milk, energy boosted! +100% Energy" appears with milk emoji
4. **Phase 4 (6-8s)**: KP walks toward car, car appears on right side
5. **Phase 5 (8-10s)**: KP enters car (shrinks/fades into car)
6. **Phase 6 (10-14s)**: Scene transitions to road view, car drives left-to-right
7. **Phase 7 (14-16s)**: Pug dog appears walking on road from right side
8. **Phase 8 (16-17s)**: Car hits dog - impact animation with screen shake
9. **Phase 9 (17-19s)**: Brief pause showing aftermath
10. **Phase 10 (19s+)**: Transition to Airplane/End screen

### Step 3: Add New Keyframe Animations to CSS

Add to `src/index.css`:
```css
/* Milk Hospital animations */
@keyframes walk-out {
  0% { transform: translateX(0) scale(0.3); opacity: 0; }
  50% { transform: translateX(30px) scale(0.7); opacity: 1; }
  100% { transform: translateX(60px) scale(1); opacity: 1; }
}

@keyframes car-drive {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); }
}

@keyframes dog-walk {
  0% { transform: translateX(100vw) scaleX(-1); }
  100% { transform: translateX(40vw) scaleX(-1); }
}

@keyframes car-crash {
  0% { transform: translateX(var(--car-x)) rotate(0deg); }
  30% { transform: translateX(calc(var(--car-x) + 20px)) rotate(-5deg); }
  60% { transform: translateX(calc(var(--car-x) - 10px)) rotate(3deg); }
  100% { transform: translateX(var(--car-x)) rotate(0deg); }
}

@keyframes dog-hit {
  0% { transform: translateX(40vw) scaleX(-1) rotate(0deg); }
  30% { transform: translateX(50vw) scaleX(-1) rotate(45deg) translateY(-30px); }
  60% { transform: translateX(60vw) scaleX(-1) rotate(90deg) translateY(10px); }
  100% { transform: translateX(70vw) scaleX(-1) rotate(180deg) translateY(0); }
}

@keyframes energy-popup {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes building-fade-in {
  0% { opacity: 0; transform: translateY(50px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

### Step 4: Update Game Flow in FeedKPGame.tsx

Modify `FeedKPGame.tsx` to:
1. Add new state: `showMilkHospital`
2. After cow fight completes, show Milk Hospital screen instead of Airplane
3. After Milk Hospital completes, show Airplane/End screen

```text
Current flow:
  CowFight -> onComplete() -> showAirplane = true

New flow:
  CowFight -> onComplete() -> showMilkHospital = true
  MilkHospital -> onComplete() -> showAirplane = true
```

---

## Technical Details

### MilkHospitalScreen Component Structure

```text
MilkHospitalScreen
├── Background (gradient + road)
├── Hospital Building
│   ├── Main Structure (windows, door)
│   ├── "MILK HOSPITAL" Sign
│   ├── Red Cross Symbols
│   ├── Left Banner (Rose Milk)
│   └── Right Banner (Village Raw Milk)
├── KP Character (animated walk out)
├── Energy Popup ("Drank milk, energy boosted!")
├── Honda Amaze Car (animated entry + drive)
├── Road Scene
│   ├── Road with lane markings
│   └── Simple background (trees/buildings silhouettes)
├── Pug Dog (animated walk + crash)
└── Crash Effects (stars, shake, impact text)
```

### Props Interface
```typescript
interface MilkHospitalScreenProps {
  onComplete: () => void;
}
```

### State Management
```typescript
type Phase = 'hospital' | 'kp-exit' | 'popup' | 'enter-car' | 'driving' | 'dog-appears' | 'crash' | 'aftermath';
const [phase, setPhase] = useState<Phase>('hospital');
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/assets/honda-amaze-car.jpg` | Create | Copy Honda Amaze image |
| `src/assets/pug-dog.webp` | Create | Copy Pug dog image |
| `src/assets/rose-milk-banner.png` | Create | Copy Rose Milk banner |
| `src/assets/village-milk-banner.png` | Create | Copy Village Raw Milk banner |
| `src/components/game/MilkHospitalScreen.tsx` | Create | New hospital + car crash sequence component |
| `src/index.css` | Modify | Add new animation keyframes |
| `src/components/game/FeedKPGame.tsx` | Modify | Add MilkHospital state and flow |

---

## Visual Quality Notes

- Hospital building will be CSS-drawn with gradient backgrounds, shadows, and glow effects
- Ad banners will be displayed as images with perspective/skew transforms for realistic placement
- Car and dog images will have drop shadows and smooth animations
- Impact effects include screen shake, star particles, and "BONK!" text
- Road scene will have lane markings and simple ambient details
- All animations will be smooth with proper easing (ease-out, ease-in-out)
- Mobile-first design optimized for 100dvh viewport


# Cow Fight Screen Implementation Plan

## Overview
After KP finishes eating (100% happiness), a new "Cow Fight" screen will appear before the airplane end screen. This screen features KP being punched by a boxing cow in an epic showdown.

## Game Flow Update
```text
[Feeding Screen] -> [NEW: Cow Fight Screen] -> [Airplane End Screen]
     100%                  3 punches                   bye bye
```

## New Components

### 1. CowFightScreen.tsx
The main new screen component with the following features:

**Background Setup:**
- Honda Amaze car image positioned on the right side
- Cement bags image positioned on the left side
- Dramatic arena-style gradient background (dark with spotlights effect)

**Character Entrances (after 4 seconds):**
- KP slides in from the right with a smooth entrance animation
- Boxing Cow slides in from the left with menacing entrance

**Boxing Cow Character:**
- Built using CSS/div elements (similar to KPCharacter.tsx)
- White/cream colored body with cow spots
- Red boxing gloves on front legs
- Angry expression with flared nostrils
- Sweat drops during punching

**Gameplay:**
- "Touch KP to punch" popup appears after characters enter
- Tapping near KP triggers the cow's punch animation
- Health bar for KP (3 hearts or health meter)
- After 3 punches, KP loses and transitions to end screen

### 2. BoxingCow.tsx
A dedicated component for the animated boxing cow:
- Idle stance with subtle breathing animation
- Punch animation with glove extending forward
- Victory celebration after winning

## Detailed Animations

### Professional Animation List:

1. **Character Entrance Animations**
   - `slide-in-from-right`: KP enters with a bounce
   - `slide-in-from-left`: Cow enters with a menacing shake

2. **Boxing Cow Animations**
   - `cow-idle`: Subtle bobbing, breathing effect
   - `cow-punch`: Fast jab with glove extending, body lunging forward
   - `cow-victory`: Raising gloves in triumph

3. **KP Hit Reactions**
   - `kp-hit`: KP recoils backward, stars appear around head
   - `kp-dizzy`: Swirly eyes effect when taking damage

4. **Screen Effects**
   - `screen-shake`: Entire screen shakes on punch impact
   - `flash-impact`: White flash on hit
   - `dust-particles`: Ground dust when characters land

5. **Health System**
   - 3 heart icons that break/disappear on each hit
   - Red damage flash overlay

## CSS Keyframes to Add

```text
@keyframes slide-from-right {
  0% { transform: translateX(100vw); }
  70% { transform: translateX(-20px); }
  100% { transform: translateX(0); }
}

@keyframes slide-from-left {
  0% { transform: translateX(-100vw) rotate(-5deg); }
  70% { transform: translateX(20px) rotate(5deg); }
  100% { transform: translateX(0) rotate(0); }
}

@keyframes cow-punch {
  0% { transform: translateX(0); }
  20% { transform: translateX(-30px) rotate(-10deg); }
  40% { transform: translateX(80px) rotate(5deg); }
  60% { transform: translateX(60px); }
  100% { transform: translateX(0); }
}

@keyframes screen-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-10px); }
  40%, 80% { transform: translateX(10px); }
}

@keyframes hit-flash {
  0% { opacity: 0; }
  50% { opacity: 0.5; }
  100% { opacity: 0; }
}

@keyframes stars-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes heart-break {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); }
  100% { transform: scale(0); opacity: 0; }
}
```

## Screen States

1. **Loading** (0-4s): Background visible, characters haven't entered
2. **Entrance** (4-5s): Characters slide in from opposite sides
3. **Ready**: "Touch KP to punch!" popup appears
4. **Fighting**: Player can tap KP, cow punches
5. **KO**: KP loses, transition to airplane screen

## Files to Create/Modify

### New Files:
1. `src/components/game/CowFightScreen.tsx` - Main fight screen
2. `src/components/game/BoxingCow.tsx` - Animated cow character

### Modified Files:
1. `src/components/game/FeedKPGame.tsx` - Update flow to include fight screen
2. `src/index.css` - Add new keyframe animations

## Technical Implementation Details

### FeedKPGame.tsx Flow Update:
```text
Current:  gameStarted -> feeding -> showAirplane
New:      gameStarted -> feeding -> showCowFight -> showAirplane
```

### Image Assets:
- Copy Honda Amaze image to `src/assets/honda-amaze.jpg`
- Copy Cement bags image to `src/assets/cement-bags.jpg`
- Import and use in CowFightScreen background

### BoxingCow Component Structure:
- Body: Oval white shape with black spots
- Head: Rounded with horns, pink nose, angry eyes
- Front legs: With red boxing gloves (animated)
- Back legs: Stationary
- Tail: Swishing animation
- Expression changes: Normal -> Punching -> Victory

### Touch Detection:
- Create a touch zone around KP
- On tap, trigger cow punch animation
- After punch animation completes, reduce KP health
- Screen shake effect on impact

### Health Display:
- 3 heart emojis at top of screen
- Hearts animate out when KP takes damage
- At 0 health, 2-second delay then transition to airplane

## Visual Style
Matching the existing game's professional mobile-first aesthetic with:
- Bouncy, satisfying animations
- Clear visual feedback for actions
- Fredoka font for text
- Consistent color palette from existing screens

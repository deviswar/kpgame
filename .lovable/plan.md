
# Make Cow Rush Towards KP When Punching

## Current Problem
The cow stays in its original position and only moves its glove slightly. This looks fake because the cow doesn't actually approach KP to punch.

## Solution
Add a "rush forward" animation where the entire cow moves towards KP, lands the punch, and then retreats back to its original position.

## Technical Changes

### File: `src/components/game/CowFightScreen.tsx`

**1. Add new state to track cow position**
- Add `isCowRushing` state to control cow's forward/backward movement

**2. Update the punch sequence timing**
- When punch starts: cow rushes forward
- At 300ms: impact happens (cow is near KP)
- At 600ms: cow retreats back

**3. Update cow container styling**
- Add transition classes for smooth movement
- When `isCowRushing` is true: translate cow to the right (towards KP) by ~40% of screen
- When false: return to original position

## Animation Flow

```text
Click KP
    |
    v
[Cow starts rushing right] -----> [300ms: Impact!] -----> [600ms: Cow retreats back]
    |                                    |                         |
    v                                    v                         v
  isCowRushing=true              Hit effects play           isCowRushing=false
  isPunching=true                KP reacts                  isPunching=false
```

## Code Changes Preview

State addition:
```tsx
const [isCowRushing, setIsCowRushing] = useState(false);
```

In handlePunch:
```tsx
// Cow rushes forward
setIsCowRushing(true);
setIsPunching(true);

// After impact, cow retreats
setTimeout(() => {
  setIsCowRushing(false);
  setIsPunching(false);
}, 600);
```

Cow container styling:
```tsx
<div 
  className="transition-all duration-300 ease-out"
  style={{
    transform: isCowRushing 
      ? 'translateX(calc(50vw - 100px))' // Rush towards KP
      : 'translateX(0)', // Normal position
  }}
>
  <BoxingCow ... />
</div>
```

This will make the cow physically move across the arena to punch KP and then return, making the fight look much more realistic!

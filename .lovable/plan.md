

# Rizz Scene - Welcome Screen Enhancement

## Overview
Add a two-phase welcome screen experience:
1. **Phase 1**: Current welcome content with a new "Click here to see my rizz" button
2. **Phase 2**: New "Rizz Scene" showing KP trying to impress a girl (QT), followed by "Tap to start game" button

---

## Current Flow vs New Flow

```text
CURRENT:
Welcome Screen → [Tap to start] → Feed Game

NEW:
Welcome Screen → [Click here to see my rizz] → Rizz Scene → [Tap to start] → Feed Game
```

---

## Technical Implementation

### File 1: src/components/game/QTCharacter.tsx (NEW FILE)

Create a new girl character component similar to KPCharacter but styled as a female:
- Same proportions as KP but feminine styling
- Pink/purple dress instead of yellow t-shirt
- Long black hair with ponytail
- Angry expression (to match the 😡🤬 dialogue)
- Pink bow accessory

### File 2: src/components/game/WelcomeScreen.tsx (MODIFY)

Add state management and new scene:

**State Changes:**
```typescript
const [showRizzScene, setShowRizzScene] = useState(false);
```

**Phase 1 (Initial Welcome):**
- Keep all current content (title, fun facts, footer)
- Replace "Tap to start the game" button with "Click here to see my rizz" button
- When clicked, set `showRizzScene = true`

**Phase 2 (Rizz Scene):**
When `showRizzScene` is true, render:

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│     ┌─────┐                            ┌─────┐     │
│     │ KP  │                            │ QT  │     │
│     └─────┘                            └─────┘     │
│                                                     │
│     ┌───────────────────┐                          │
│     │ "my name is bava, │                          │
│     │  nuvvu okkasari   │                          │
│     │  rava"            │                          │
│     └───────────────────┘                          │
│                            ┌───────────────────┐   │
│                            │     😡🤬          │   │
│                            └───────────────────┘   │
│                                                     │
│   ┌───────────────────────────────────────────┐    │
│   │ [QT Character - angry girl]   │           │    │
│   └───────────────────────────────────────────┘    │
│                                                     │
│        [👆 Tap to start the game]                  │
│                                                     │
│        Powered by Rapido                            │
│        🔊 Turn your volume up...                   │
└─────────────────────────────────────────────────────┘
```

**Layout for Rizz Scene:**
- Use `flex` layout with KP on LEFT and QT on RIGHT
- Name badges ("KP" and "QT") positioned above each character
- Speech bubbles with pointed tails directed at each character
- KP's dialogue in a rounded bubble pointing from him
- QT's angry response (😡🤬) in a bubble pointing from her
- "Tap to start the game" button at the bottom
- Keep footer elements

### File 3: src/index.css (MODIFY)

Add speech bubble animations:

```css
@keyframes speech-bubble-pop {
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.animate-speech-bubble {
  animation: speech-bubble-pop 0.4s ease-out forwards;
}
```

---

## Detailed Component Structure

### QTCharacter Component

The girl character will have:
- **Head**: Rounded shape with fair skin tone
- **Hair**: Long black hair with side ponytail
- **Expression**: Angry eyes (slanted eyebrows) and frowning mouth
- **Body**: Pink/magenta dress with short sleeves
- **Arms**: Similar proportions to KP, hanging straight
- **Legs**: Same style as KP but in black leggings
- **Accessory**: Pink bow in hair

### Speech Bubbles

Style both speech bubbles with:
- Rounded corners (`rounded-xl`)
- White/cream background
- Border for definition
- Tail/pointer using CSS triangle (::before or ::after pseudo-element)
- Text inside with appropriate padding

**KP's bubble**: Points to the left (toward KP)
**QT's bubble**: Points to the right (toward QT)

### Rizz Scene Layout

```tsx
<div className="flex items-center justify-center gap-8 md:gap-16">
  {/* KP Side */}
  <div className="flex flex-col items-center">
    {/* Name Badge */}
    <div className="bg-blue-500 px-4 py-1 rounded-lg mb-2">
      <span className="text-white font-bold">KP</span>
    </div>
    {/* KP Character */}
    <KPCharacter scale={0.8} isHappy={true} happiness={80} />
    {/* Speech Bubble */}
    <div className="speech-bubble-left bg-white rounded-xl px-4 py-2 mt-2 shadow-lg">
      <p className="text-gray-800 text-sm">"my name is bava, nuvvu okkasari rava"</p>
    </div>
  </div>

  {/* QT Side */}
  <div className="flex flex-col items-center">
    {/* Name Badge */}
    <div className="bg-pink-500 px-4 py-1 rounded-lg mb-2">
      <span className="text-white font-bold">QT</span>
    </div>
    {/* QT Character */}
    <QTCharacter scale={0.8} isAngry={true} />
    {/* Speech Bubble */}
    <div className="speech-bubble-right bg-white rounded-xl px-4 py-2 mt-2 shadow-lg">
      <p className="text-2xl">😡🤬</p>
    </div>
  </div>
</div>
```

---

## Summary of Changes

| File | Changes |
|------|---------|
| `src/components/game/QTCharacter.tsx` | NEW - Create girl character component with angry expression |
| `src/components/game/WelcomeScreen.tsx` | Add state for rizz scene, replace button text, add new scene layout with both characters and dialogue |
| `src/index.css` | Add speech bubble animation and styles |

---

## Button Flow

1. **"Click here to see my rizz"** → Shows Rizz Scene (same screen, state change)
2. **"Tap to start the game"** → Calls `onStart()` to begin the game (same as before)

This maintains the original game flow while adding the new rizz interaction in between.


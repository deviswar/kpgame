

# Letter-by-Letter Wave Animation for "Turn Up Your Volume" Text

## Overview
Replace the current gradient shine effect with a **letter-by-letter scaling animation** where each character gets slightly bigger one at a time, moving from left to right like a wave.

---

## Technical Approach

Since CSS cannot animate individual letters within a text string, we need to:
1. Create a **reusable React component** that splits text into individual `<span>` elements
2. Apply **staggered CSS animations** to each letter with increasing delays
3. Each letter will scale up slightly and return to normal size

---

## Implementation Details

### 1. Create New Component: `WaveText.tsx`

**File:** `src/components/game/WaveText.tsx`

A simple component that:
- Takes a text string as a prop
- Splits it into individual characters
- Wraps each character in a `<span>` with a staggered animation delay

```tsx
interface WaveTextProps {
  text: string;
  className?: string;
}

const WaveText = ({ text, className }: WaveTextProps) => {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block animate-letter-wave"
          style={{ 
            animationDelay: `${index * 0.05}s`,
            // Preserve spaces
            whiteSpace: char === ' ' ? 'pre' : 'normal'
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};
```

---

### 2. Add CSS Animation

**File:** `src/index.css`

Add a new keyframes animation for the letter wave effect:

```css
/* Letter-by-letter wave animation */
@keyframes letter-wave {
  0%, 100% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.3); 
  }
}

.animate-letter-wave {
  display: inline-block;
  animation: letter-wave 1.5s ease-in-out infinite;
}
```

The animation:
- Each letter scales from 1 → 1.3 → 1 (gets bigger then returns)
- Duration: 1.5s per letter cycle
- Delay: 0.05s between each letter (creates the wave effect)
- Loops infinitely

---

### 3. Update WelcomeScreen

**File:** `src/components/game/WelcomeScreen.tsx`

Replace the current static text with the WaveText component:

**Before (lines 105-107):**
```tsx
<p className="text-primary-foreground/70 text-xs md:text-sm font-medium animate-blink-bounce animate-text-shine">
  🔊 Turn up your volume for the best experience
</p>
```

**After:**
```tsx
<p className="text-primary-foreground/70 text-xs md:text-sm font-medium animate-blink-bounce">
  🔊 <WaveText text="Turn up your volume for the best experience" />
</p>
```

Same update needed for the rizz scene (line 187-189).

---

## Visual Effect

```text
Time 0.0s:  T u r n   u p   y o u r   v o l u m e
            ↑
           (big)

Time 0.05s: T u r n   u p   y o u r   v o l u m e
              ↑
             (big)

Time 0.10s: T u r n   u p   y o u r   v o l u m e
                ↑
               (big)

... continues left to right, then loops
```

---

## Files to Change

| File | Action |
|------|--------|
| `src/components/game/WaveText.tsx` | **Create** - New component for letter animation |
| `src/index.css` | **Add** - `@keyframes letter-wave` and `.animate-letter-wave` |
| `src/components/game/WelcomeScreen.tsx` | **Update** - Use `WaveText` component in both phases |

---

## Animation Tuning

The animation can be customized:
- **Speed**: Change `1.5s` duration (faster = quicker pulse)
- **Wave speed**: Change `0.05s` delay multiplier (smaller = faster wave travel)
- **Scale amount**: Change `1.3` scale factor (bigger = more dramatic effect)


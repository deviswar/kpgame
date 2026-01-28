

# Fix Letter-by-Letter Wave Animation (Sequential, Not Simultaneous)

## The Problem
Currently, each letter has its own 1.5s animation cycle. After the first wave passes, all letters continue pulsing at their own independent times, making them all animate simultaneously.

## The Solution
Adjust the animation timing so the animation duration spans the **entire sentence**, with each letter only getting "big" during its specific window. This creates a true left-to-right sequential wave where only one letter is enlarged at any given moment.

---

## Technical Changes

### Update CSS Animation (`src/index.css`)

The sentence "Turn up your volume for the best experience" has 45 characters.

**New timing calculation:**
- Each letter gets 0.05s delay between them
- Total sentence span: ~2.25s (45 chars × 0.05s)
- Animation duration: ~3s (enough to complete wave + small gap before restart)
- Each letter only "pulses" for a tiny fraction of the total cycle

**Updated keyframes:**
```css
@keyframes letter-wave {
  0%, 8%, 100% { 
    transform: scale(1); 
  }
  4% { 
    transform: scale(1.3); 
  }
}

.animate-letter-wave {
  display: inline-block;
  animation: letter-wave 3s ease-in-out infinite;
}
```

This means:
- 0-4%: Letter grows (scale 1 → 1.3)
- 4-8%: Letter shrinks (scale 1.3 → 1)
- 8-100%: Letter stays normal (waiting for next wave cycle)

With 45 letters and 0.05s delays, the wave travels across in ~2.25s, then there's a ~0.75s pause before the next wave starts.

---

## Visual Effect (Fixed)

```text
Time 0.0s:  [T] u  r  n     u  p     y  o  u  r  ...
             ↑
            BIG (only T is big)

Time 0.15s:  T  u  r [n]    u  p     y  o  u  r  ...
                      ↑
                     BIG (only n is big)

Time 0.50s:  T  u  r  n     u  p     y [o] u  r  ...
                                       ↑
                                      BIG (only o is big)

... wave continues left to right, one letter at a time
```

---

## File to Change

| File | Change |
|------|--------|
| `src/index.css` | Update `@keyframes letter-wave` to use percentage-based timing |


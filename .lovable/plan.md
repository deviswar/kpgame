

## Plan: Three Changes to WelcomeScreen

### 1. Home screen (Phase 1) — Change abuse button to black
- Line 147: Change `bg-red-500` to `bg-black` and `hover:bg-red-600` to `hover:bg-gray-800`, remove `border-red-400/50` → `border-white/20`

### 2. Rizz scene (Phase 2) — Bike image bigger + "L00B :)" box beside it
- Lines 172-173: Replace the standalone `<img>` with a flex row:
  - Left: bike image, bigger (`w-44 h-32` instead of `w-36 h-24`)
  - Right: black box with "L00B" in white and ":)" in orange

### 3. Rizz scene (Phase 2) — Remove abuse button, restore volume text
- Lines 242-246: Remove the red abuse button
- Line 253: Change `text-xs md:text-sm` back to `text-sm md:text-base` and add `animate-blink-bounce` to match Phase 1 style

### File: `src/components/game/WelcomeScreen.tsx`


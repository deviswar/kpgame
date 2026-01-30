
# Fix: Move Content Down on Welcome Screen

## Problem
After increasing text sizes for the fun facts and volume hint, the "KP Game" title and KP character are positioned too high on the screen due to a large negative margin (`-mt-48`).

## Solution
Reduce the negative margin on the header section to bring all content down, creating better visual balance.

## Change
**File:** `src/components/game/WelcomeScreen.tsx`

**Line 68** - Change the header margin:
- **From:** `-mt-48` (pushes content way up)  
- **To:** `-mt-24` (more balanced, moves content down)

This single change will shift the "KP Game" title and character down toward the center, making everything fit nicely above the version number.


# Fix Blank White Screen on Mobile + Audio Issues

## Problem Analysis

After deep investigation, I've identified **5 critical issues** causing the blank white screen on mobile devices when visiting kpgame.vercel.app:

### Critical Issues Found:

1. **Missing `vercel.json` Configuration**
   - The project is deployed to Vercel but lacks a `vercel.json` file for SPA routing
   - When users directly access routes like `/feed` or refresh the page, Vercel returns a 404 instead of serving `index.html`
   - This can cause blank screens on direct URL access

2. **No Error Boundary**
   - The app has no React Error Boundary, meaning any JavaScript error crashes the entire app to a blank white screen
   - Audio errors, network failures, or asset loading issues will show nothing to users

3. **`requestIdleCallback` Not Polyfilled for Safari/iOS**
   - `requestIdleCallback` is used in `WelcomeScreen.tsx` but is NOT supported in Safari/iOS browsers
   - This causes a JavaScript error that crashes the app on iPhone Safari
   - The current fallback (`requestIdleCallback ? ... : setTimeout(...)`) may fail due to how the ternary evaluates

4. **Unhandled Promise Rejections**
   - Audio operations in `audioManager.ts` can throw unhandled rejections on mobile
   - The retry logic with `setTimeout` can cause race conditions
   - No global error handler catches these rejections

5. **Font Loading May Block Render**
   - External font import from Google Fonts (`@import url(...)` in CSS) can block initial render
   - On slow mobile connections, this can cause extended white screen periods

---

## Solution Overview

```text
+-------------------+     +-------------------+     +-------------------+
|  1. vercel.json   | --> |  2. ErrorBoundary | --> |  3. Polyfills     |
|  (SPA Routing)    |     |  (Catch crashes)  |     |  (iOS Support)    |
+-------------------+     +-------------------+     +-------------------+
         |                         |                         |
         v                         v                         v
+-------------------+     +-------------------+     +-------------------+
| 4. Global Error   | --> | 5. Font Loading   | --> |  6. Audio Fixes   |
|    Handler        |     |    Optimization   |     |  (Mobile Safari)  |
+-------------------+     +-------------------+     +-------------------+
```

---

## Implementation Steps

### Step 1: Create `vercel.json` for SPA Routing
Create a new file `vercel.json` in the project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all routes are handled by React Router instead of returning 404s.

---

### Step 2: Add React Error Boundary
Create `src/components/ErrorBoundary.tsx`:

```tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App crashed:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen game-gradient flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h1>
          <p className="text-white/80 mb-6">The game had an issue loading.</p>
          <button
            onClick={this.handleRetry}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold"
          >
            Reload Game
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

### Step 3: Fix `requestIdleCallback` for Safari/iOS
Update `src/components/game/WelcomeScreen.tsx`:

Replace the problematic line:
```tsx
// OLD (causes error on iOS Safari)
requestIdleCallback ? requestIdleCallback(preloadImages) : setTimeout(preloadImages, 100);
```

With a safer check:
```tsx
// NEW (works on all browsers)
if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
  window.requestIdleCallback(preloadImages);
} else {
  setTimeout(preloadImages, 100);
}
```

---

### Step 4: Add Global Unhandled Rejection Handler
Update `src/App.tsx` to catch unhandled promise rejections:

```tsx
import { useEffect } from "react";
import { toast } from "sonner";

// Inside App component, add:
useEffect(() => {
  const handleRejection = (event: PromiseRejectionEvent) => {
    console.error("Unhandled rejection:", event.reason);
    event.preventDefault(); // Prevent crash
  };

  window.addEventListener("unhandledrejection", handleRejection);
  return () => window.removeEventListener("unhandledrejection", handleRejection);
}, []);
```

Also wrap the app with the ErrorBoundary.

---

### Step 5: Optimize Font Loading
Update `src/index.css` to use `font-display: swap`:

Replace:
```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Bangers&family=Bungee+Shade&display=swap');
```

With a preload approach in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Bangers&family=Bungee+Shade&display=swap" rel="stylesheet">
```

And update CSS:
```css
/* Remove @import, add fallback font-family */
body {
  font-family: 'Fredoka', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

### Step 6: Make Audio Manager More Resilient
Update `src/lib/audioManager.ts` to wrap all audio operations in try-catch:

```tsx
export const primeRizzAudio = () => {
  try {
    if (!rizzAudio) {
      rizzAudio = new Audio('/music/rizz.mp4');
      rizzAudio.volume = 0;
      rizzAudio.loop = true;
      rizzAudio.preload = 'auto';
    }
    
    const primePromise = rizzAudio.play();
    if (primePromise !== undefined) {
      primePromise.then(() => {
        rizzAudio?.pause();
        if (rizzAudio) {
          rizzAudio.currentTime = 0;
          rizzAudio.volume = 0.5;
        }
        rizzPreloaded = true;
      }).catch(() => {
        // Silently handle - audio will work on next user interaction
        rizzAudio?.load();
      });
    }
  } catch (e) {
    console.warn('Audio priming failed (will retry on interaction):', e);
  }
};
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `vercel.json` | **Create** - SPA routing config |
| `src/components/ErrorBoundary.tsx` | **Create** - Error boundary component |
| `src/App.tsx` | **Modify** - Add error handler + wrap with ErrorBoundary |
| `src/components/game/WelcomeScreen.tsx` | **Modify** - Fix requestIdleCallback polyfill |
| `src/lib/audioManager.ts` | **Modify** - Add try-catch safety wrappers |
| `src/index.css` | **Modify** - Remove blocking @import |
| `index.html` | **Modify** - Add font preload links |

---

## Technical Details

### Why These Fixes Work:

1. **vercel.json**: Tells Vercel to always serve index.html for any route, letting React Router handle navigation
2. **ErrorBoundary**: Catches React rendering errors and shows a friendly "retry" screen instead of blank white
3. **requestIdleCallback check**: Uses proper feature detection instead of relying on ternary evaluation order
4. **Global handler**: Prevents unhandled promise rejections from crashing the app
5. **Font optimization**: Uses `font-display: swap` so text renders immediately with fallback fonts
6. **Audio safety**: Wraps all audio in try-catch so failures are silent, not crashes

### Expected Outcome:
- Game loads instantly on mobile
- No more blank white screens
- Audio plays reliably on mobile (after first tap)
- Errors show a friendly retry screen instead of crashing

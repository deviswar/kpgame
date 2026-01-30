

# Fix: Pink Strip at Top of Screen (iOS Safe Area Issue)

## What's Happening

On your iPhone, there's a "safe area" at the very top (status bar area). The game content starts BELOW this area, allowing the body's pink gradient background to peek through as a strip.

## The Root Cause

- Body background: `linear-gradient(135deg, orange → pink)` - at 135°, the **top-left shows PINK**
- Game screens use the same gradient but don't extend into the iOS safe area
- Result: pink body background visible at the top

## The Fix (3 changes)

### 1. Add `viewport-fit=cover` to the viewport meta tag
This tells iOS to extend the web content under the notch/status bar area.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
```

### 2. Update body and #root styles to use safe-area-inset
Add padding for safe areas so content still looks correct:

```css
html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  min-height: 100dvh;
  overflow-x: hidden;
}
#root {
  margin: 0;
  padding: 0;
  padding-top: env(safe-area-inset-top);
  min-height: 100%;
  min-height: 100dvh;
  width: 100%;
  position: relative;
  /* Apply the SAME game gradient to #root so it fills the safe area */
  background: linear-gradient(135deg, hsl(25 100% 70%), hsl(340 70% 65%));
}
```

### 3. Keep body background as fallback but ensure #root covers it completely

The #root container will now have the same gradient AND extend into the safe area, so no body background will peek through.

---

## Files to Change

| File | Change |
|------|--------|
| `index.html` | Add `viewport-fit=cover` to meta tag + update #root CSS |

---

## Technical Details

The key insight is that iOS requires `viewport-fit=cover` in the viewport meta tag to allow content to extend behind the status bar. Then we use `env(safe-area-inset-top)` to add padding so the actual interactive content isn't hidden behind the status bar, while the background color extends all the way up.

By applying the game gradient directly to `#root`, the gradient will fill the entire screen including the safe area, eliminating the pink strip completely.


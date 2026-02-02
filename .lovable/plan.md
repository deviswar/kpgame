

## Summary
Two timing and UI adjustments:
1. Replace the "Thank you" popup with an animated loading bar on the "I ate enough dengulu" screen
2. Reduce the mourning "Sorry..." screen duration by 1 second

---

## Changes

### 1. Replace "Thank You" with Loading Bar
**File:** `src/components/game/FeedKPGame.tsx`

Replace the "Thank you 🙏" popup (lines 134-139) with an animated progress bar that fills from 0% to 100% over the 4-second screen duration.

**Current:**
```tsx
{/* Thank you popup */}
<div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl border-4 border-green-400/50 animate-fade-in max-w-[200px] mt-4">
  <p className="text-gray-800 text-lg md:text-xl font-bold text-center">
    Thank you 🙏
  </p>
</div>
```

**New:**
```tsx
{/* Loading bar */}
<div className="w-64 md:w-80 mt-4">
  <div className="bg-gray-300 rounded-full h-4 overflow-hidden shadow-inner border-2 border-gray-400">
    <div 
      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-none"
      style={{
        width: '100%',
        animation: 'loadingFill 4s linear forwards'
      }}
    />
  </div>
  <p className="text-white text-sm mt-2 text-center font-medium">Loading next adventure...</p>
</div>
```

### 2. Add CSS Animation for Loading Bar
**File:** `src/index.css`

Add a new keyframe animation:
```css
@keyframes loadingFill {
  from { width: 0%; }
  to { width: 100%; }
}
```

### 3. Reduce Mourning Scene Duration
**File:** `src/components/game/MilkHospitalScreen.tsx`

Change line 77:
- **Current:** `setTimeout(() => onComplete(), 9300);`
- **New:** `setTimeout(() => onComplete(), 8300);`

This reduces the "Sorry..." screen with the 3 images by 1 second.

---

## Result
- The "I ate dengulu" screen will show a loading bar that smoothly fills up over 4 seconds instead of "Thank you"
- The mourning scene ends 1 second earlier (8.3s instead of 9.3s)




## Summary
Add a glowing "Don't Click 🤡" button on the leaked video screen that opens WhatsApp with a pre-filled message when tapped.

---

## Changes

### 1. Add Glowing Button Animation
**File:** `src/index.css`

Add a new pulsing glow animation for the button edge:

```css
@keyframes glow-pulse {
  0%, 100% { 
    box-shadow: 0 0 10px #ff6b6b, 0 0 20px #ff6b6b, 0 0 30px #ff6b6b;
  }
  50% { 
    box-shadow: 0 0 15px #ff4757, 0 0 30px #ff4757, 0 0 45px #ff4757, 0 0 60px #ff4757;
  }
}

.animate-glow-pulse {
  animation: glow-pulse 1.5s ease-in-out infinite;
}
```

---

### 2. Add WhatsApp Button to Video Screen
**File:** `src/components/game/AirplaneAnimation.tsx`

Add a circular overlay button positioned at the bottom-right of the video container (inside lines 99-122):

```tsx
{/* Video container - takes most space */}
<div className="flex-1 w-full flex flex-col items-center justify-center">
  {/* Video wrapper with relative positioning for overlay button */}
  <div className="relative w-full max-w-md">
    <video ... />
    
    {/* Don't Click button - bottom right overlay */}
    <a
      href="https://api.whatsapp.com/send/?phone=919573725363&text=sir+meeru+erripuk+ah?+🤡&type=phone_number&app_absent=0"
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex flex-col items-center justify-center animate-glow-pulse z-10"
    >
      <span className="text-white text-[10px] font-bold text-center leading-tight">
        Don't Click
      </span>
      <span className="text-lg">🤡</span>
    </a>
  </div>
  
  {/* Brutal popup below video */}
  ...
</div>
```

---

## Visual Result

The video screen will have:
- A circular button positioned at the bottom-right corner of the video
- Red/pink gradient background with pulsing glow effect on the edge
- Text "Don't Click" on top, "🤡" emoji below
- Opens WhatsApp with pre-filled Telugu message when tapped


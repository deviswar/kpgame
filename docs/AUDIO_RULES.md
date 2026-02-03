# Audio System Architecture Rules

## The Golden Rule

**Audio MUST be created AND played in the SAME user click/tap event.**

This is a hard requirement from iOS Safari. There are no workarounds.

---

## Working Pattern ✅

```
User taps button (pointerdown/touchstart)
  → Create new Audio() 
  → Call audio.play()
  → Works on all browsers including iOS Safari!
```

## Broken Pattern ❌

```
Page loads
  → Create new Audio() and buffer it
  → ...time passes...
User taps button  
  → Call play() on pre-created audio
  → FAILS on iOS Safari! Audio is "stale".
```

---

## Preloading Strategy

1. **On page mount**: Only set ready flags, don't create Audio elements
2. **On first user interaction**: Play the primary audio immediately
3. **After 1200ms delay**: Preload secondary audio tracks (to avoid network contention)

---

## iOS Safari Specific Rules

### Use Early Events
- ✅ `onPointerDown`, `onTouchStart` - Fire early, before `onClick`
- ❌ `onClick` alone - Fires after touchend, may lose gesture context

### Avoid Competing Audio
- ✅ Call main `audio.play()` FIRST, then silent unlocker
- ❌ Starting silent unlocker before main audio steals iOS audio pipeline

### Never Pre-warm
- ❌ `warmRizzAudio()`, `preloadWithCanPlayThrough()`
- ✅ Just mark as "ready", create Audio on demand in gesture

---

## Files to Know

| File | Purpose |
|------|---------|
| `src/lib/audioManager.ts` | All audio logic - has Golden Rules at top |
| `src/components/game/WelcomeScreen.tsx` | Entry point for first audio |
| `src/test/audio-architecture.test.ts` | Automated pattern tests |
| `src/components/game/DebugPanel.tsx` | Debug diagnostics (?debug=1) |

---

## Testing Checklist

Before deploying audio changes, verify on iPhone Safari:

1. **Cold open**: Tap "Click here to see my rizz" → audio starts immediately
2. **Same-tab refresh**: First tap still plays reliably
3. **Music transitions**: Music 2 and 3 work without overlap
4. **Debug check**: Add `?debug=1` to URL to see latency and errors

---

## Automated Guardrails

The test file `src/test/audio-architecture.test.ts` will fail if:
- `warmRizzAudio` or similar pre-warming functions are added
- `playRizz` doesn't create `new Audio()` inside the function
- `preloadAllAudio()` is called on mount
- Early event handlers are removed

Run tests with: `npm test`

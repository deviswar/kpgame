
## What you said (confirmed requirements)

There are exactly **3** music tracks:

1) **Music 1** = rizz scene only  
- Plays only during the “rizz scene”
- Must stop when user taps **“Tap to start the game”**

2) **Music 2** = full gameplay background  
- Starts when user taps **“Tap to start the game”**
- Plays through **Feeding → Cow Fight → Milk Hospital crash scene**
- **Stops immediately** when user taps **“Touch to take puppy to hospital”** (the moment mourning begins)

3) **Music 3** = mourning + everything after  
- Starts when user taps **“Touch to take puppy to hospital”**
- Continues through **mourning scene → end screen → leaked video scene**
- Stops only when user taps **“Go to Home”** on the leaked video screen

Critical: **Music 2 and Music 3 must never overlap**. When Music 3 starts, Music 2 must already be stopped.

---

## What’s actually wrong in the current code (root causes)

### A) Overlap bug in the main “/” flow (FeedKPGame)
In `src/components/game/FeedKPGame.tsx`:
- Music 2 = `audioRef` (`/music/background.mp3`)
- Music 3 = `mourningAudioRef` (`/music/mourning.mp3`)

You *do* pause Music 2 when starting Music 3, but:
- There’s a “keep playing” interval that keeps trying to resume Music 2 until `mourningAudioRef.current` is set.
- `mourningAudioRef.current` is only set **after** `mourningAudio.play()` resolves (async).
- So there is a real window where:
  - Music 2 is paused,
  - but the interval resumes it,
  - while Music 3 starts → overlap.

### B) Music 3 not continuing on end screen / leaked video when using route pages
The app has two flows:
- Main sequential flow: `/` uses `FeedKPGame` (audio refs live as long as it stays mounted)
- Admin/route flow: `/milk-hospital` → `/airplane` uses page components

In the route flow:
- `src/pages/MilkHospitalPage.tsx` creates its own `mourningAudioRef`
- When navigating to `/airplane`, `MilkHospitalPage` unmounts → its audio ref gets cleaned up → Music 3 stops
- `src/pages/AirplanePage.tsx` doesn’t start or keep Music 3 at all

So depending on how you test (main flow vs admin routes), you can get “no music on end screen”.

---

## Implementation approach (make it impossible to overlap, and make Music 3 persist everywhere)

### Key design decision
Create **one single, shared audio controller** used by both:
- Main flow (`FeedKPGame`)
- Route pages (`WelcomePage`, `MilkHospitalPage`, `AirplanePage`)

This controller will:
- Own **exactly 3 audio elements** (Music 1/2/3)
- Provide safe functions:
  - `playRizz()`, `stopRizz()`
  - `playGameMusic()`, `stopGameMusic()`
  - `playMourningMusic()`, `stopMourningMusic()`
  - `stopAll()`
- Enforce rules:
  - When starting Music 3 → it **immediately** stops Music 2 before any async play.
  - Uses a **synchronous “mourningStarting” flag** to prevent any “keep playing” logic from restarting Music 2.

This will permanently fix:
- Overlap in mourning phase
- Missing music on end/video screens in route navigation

---

## Step-by-step changes

### 1) Add a shared audio manager (new file)
Create something like:
- `src/lib/audioManager.ts`

It will:
- Store module-level singletons (persist across route navigations)
- Expose functions to start/stop each track
- Track state flags:
  - `mourningStartingOrPlaying` (true immediately when user taps hospital button)
  - `gameMusicPlaying`
  - etc.
- Ensure idempotency:
  - If mourning is already started, calling `playMourningMusic()` again does nothing (prevents duplicates)

Important behavior:
- `playMourningMusic()` will:
  1) Set `mourningStartingOrPlaying = true` immediately (sync)
  2) Stop/pause/reset Music 2 immediately
  3) Start Music 3 and loop it
  4) Store the ref immediately (not only after promise), and handle play retry

### 2) Update WelcomeScreen (Music 1 only)
File: `src/components/game/WelcomeScreen.tsx`
- Replace local `rizzAudioRef` with calls to the shared audio manager:
  - When entering rizz scene: `playRizz()`
  - When tapping “Tap to start the game”: `stopRizz()` then call `onStart()` (which starts Music 2)

This ensures Music 1 never leaks into gameplay.

### 3) Update FeedKPGame (Music 2 + Music 3)
File: `src/components/game/FeedKPGame.tsx`
- Remove local audio element creation logic (`audioRef`, `mourningAudioRef`, `audioInitialized`)
- Replace with audio manager calls:
  - `handleStartGame` → `playGameMusic()`
  - `handleStartMourningMusic` → `playMourningMusic()` (this will stop Music 2 instantly and start Music 3)
  - `handleGoHome` → `stopAll()` then reset UI state

Also remove the “interval keep-alive” logic entirely, or rewrite it to consult the audio manager’s `mourningStartingOrPlaying` flag.
- Best: remove it; it’s currently the source of the overlap problem.
- If you keep it, it must never run once mourning is starting (not “once mourningAudioRef is set”, but immediately on click).

### 4) Ensure MilkHospitalScreen ONLY triggers the transition (no audio ownership)
File: `src/components/game/MilkHospitalScreen.tsx`
- Keep as already adjusted: it should only call `onStartMourningMusic?.()` on the button tap.
- No local audio creation.

### 5) Fix route pages so Music 3 persists to /airplane and video
Files:
- `src/pages/MilkHospitalPage.tsx`
  - Remove its local mourning audio code entirely
  - On hospital button, call audio manager `playMourningMusic()`
- `src/pages/AirplanePage.tsx`
  - Do not create audio
  - Just render `AirplaneAnimation`
  - When user goes home, call audio manager `stopAll()` (or rely on the home handler)

This ensures that even when using admin routes, Music 3 continues across pages.

### 6) Video behavior (already mostly correct)
File: `src/components/game/AirplaneAnimation.tsx`
- Video already has `loop`, `preload="auto"`, `autoPlay`, `playsInline`
- Since you want **video audio allowed**, we keep it unmuted.
- Mourning music will also continue underneath unless we explicitly pause it when video opens.
  - Your requirement: Music 3 should keep playing on leaked video scene.
  - So we will NOT stop Music 3 when video starts.

---

## Acceptance tests (what you should verify after implementation)

### Main flow (/)
1) Go to `/`
2) Tap “Click here to see my rizz” → **ONLY Music 1 plays**
3) Tap “Tap to start the game” → Music 1 stops, **Music 2 starts**
4) Finish Feeding + Cow Fight + go to Milk Hospital crash scene → **Music 2 still playing**
5) Tap “Touch to take puppy to hospital” → **Music 2 stops immediately**, **Music 3 starts immediately**, no overlap
6) Wait through mourning → go to end screen → **Music 3 still playing**
7) Tap “Watch my leaked video” → video plays with sound, **Music 3 still playing**
8) Tap “Go to Home” on video screen → **Music 3 stops**

### Admin route flow (/admin)
1) Go to `/admin` then open `/milk-hospital`
2) At crash, tap hospital button → Music 3 starts
3) Auto-navigate to `/airplane` → **Music 3 must still be playing**
4) Open leaked video → **Music 3 still playing**
5) Go home → all music stops

---

## Notes / guardrails (to prevent future regressions)
- No component should ever do `new Audio(...)` except the shared audio manager.
- Never use “set ref only after play() succeeds” for gating; set a synchronous flag immediately on user tap so Music 2 cannot restart.
- Route transitions must not own audio lifecycles; only the audio manager owns them.


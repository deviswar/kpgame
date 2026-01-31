
Goal: Make “Click here to see my rizz” reliably play rizz music on FIRST TAP in iPhone/iPad Safari, with zero visible “audio ready” UI, and without requiring any extra taps.

What I believe is happening (the actual issue)
1) `playRizz()` currently sets `rizzPlaying = true` even if audio fails to start.
   - If Safari blocks the first `AudioContext` start OR `HTMLAudioElement.play()` rejects, the code still flips `rizzPlaying` to true at the end.
   - That means subsequent taps won’t retry (because `if (rizzPlaying) return;`), making it look like “it doesn’t play at all”.
2) iOS Safari sometimes needs an explicit “unlock” action for WebAudio on the first user gesture (a tiny silent buffer start) and/or handling `interrupted` state. Just calling `resume()` and `start(0)` is sometimes not enough across iOS versions.

How we will fix it (no UI changes)
We’ll make playback “retryable” and add a proper iOS unlock sequence inside the same user gesture.

Implementation steps (code changes)
A) Fix `rizzPlaying` logic so we only mark playing when sound actually starts
File: `src/lib/audioManager.ts`
- Change `playRizz()` so:
  - It does NOT set `rizzPlaying = true` unconditionally at the end.
  - It sets `rizzPlaying = true` only when:
    - WebAudio buffer source is successfully started, OR
    - HTMLAudio `play()` promise resolves (or at least doesn’t reject).
  - If WebAudio attempt fails and HTMLAudio attempt fails, keep `rizzPlaying = false` so the user can tap again.

B) Add a Safari/iOS “unlock” routine that runs synchronously in the click
File: `src/lib/audioManager.ts`
- Add an internal helper like `unlockIOSWebAudio(ctx)`:
  - If `ctx.state` is `suspended` OR `interrupted`:
    - Call `ctx.resume()` (do not await).
    - Also play a 1-sample (or 1-frame) silent buffer via `createBufferSource().start(0)` connected to destination.
      - This is a widely used workaround for “first start doesn’t play” in iOS Safari.
- Then start the real `rizzBufferSource` immediately after (still within the click handler).

C) Make the fallback truly reliable and retry-friendly
File: `src/lib/audioManager.ts`
- Ensure `rizzHtmlAudio` is fully configured:
  - `playsInline = true` (important for iOS behavior consistency)
  - `preload = 'auto'`, `loop = true`, `volume = 0.5`
- In the fallback branch:
  - Attempt `rizzHtmlAudio.play()`
  - If it rejects, log the error and keep `rizzPlaying = false`
  - Also consider calling `rizzHtmlAudio.load()` before `play()` if needed (still sync-safe)

D) Ensure “Stop All” stops the HTML fallback too
File: `src/lib/audioManager.ts`
- In `stopAll()`, also pause/reset `rizzHtmlAudio` (today it only stops the WebAudio source).
- This prevents weird states across restarts and avoids Safari keeping the element in a bad state.

E) (Optional but recommended) Remove duplicated preload calls
File: `src/components/game/WelcomeScreen.tsx`
- Right now it calls both `precacheRizzAudio()` and `preloadAllAudio()` (which calls `precacheRizzAudio()` again).
- This shouldn’t break audio, but we can simplify to one call to reduce duplicated fetch/decode.

How we’ll validate (on iPhone Safari)
1) Hard refresh the page.
2) First tap “Click here to see my rizz”.
3) Expected: sound starts immediately.
4) If not, second tap should still attempt again (because `rizzPlaying` will remain false on failure), rather than being “stuck forever”.

Why this approach is the most likely to work
- It directly fixes a real logic bug: “we mark playing even when nothing is playing”.
- It adds the known iOS WebAudio unlock pattern used in production apps.
- It preserves the “no visible UI” requirement.

Risks / constraints
- iOS Safari behavior varies by OS version; the unlock buffer approach is the most battle-tested workaround.
- If the device has extremely restrictive settings (e.g., content blockers or Safari experimental flags), we can’t fully control that, but the retryable logic prevents permanent failure.

If you’re stuck / want to compare versions
You can open History to compare with the last known version where it “used to play”.

<lov-actions>
  <lov-open-history>View History</lov-open-history>
  <lov-link url="https://docs.lovable.dev/tips-tricks/troubleshooting">Troubleshooting docs</lov-link>
</lov-actions>

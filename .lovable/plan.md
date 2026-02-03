
Goal
- Keep the current “fast load + rizz plays” behavior stable long-term, and reduce the remaining “small delay” and “refresh messes rizz up” issues on iPhone Safari.
- Add guardrails so future edits don’t accidentally reintroduce iOS-breaking patterns (pre-warm on mount, competing preloads, async gesture loss).

What’s happening (why only rizz is still fragile)
- Rizz is the only track that must start on the very first interaction, immediately after a cold load or refresh.
- On iPhone Safari, the first media play after a refresh is the strictest case: it’s sensitive to:
  1) Gesture timing (must be initiated directly inside a user event)
  2) Network/cache timing (mp3 might not be in cache even with <link rel="preload">; iOS can deprioritize/ignore audio preload)
  3) Competing “unlock” audio (your silent unlocker is another audio play call at the same moment, which can steal attention/time)
- Music 2 and 3 work “better” because they start later (after the app is loaded and caches are warmer) and are not your first critical interaction.

Key improvements to make it future-proof + reduce remaining delay
A) Make the “gesture path” even stricter and earlier
1) Trigger rizz playback on pointer/touch DOWN (not on click)
- On iOS, onClick fires after touchend and after some delay; starting audio on onPointerDown/onTouchStart typically starts earlier and more reliably.
- Implementation approach:
  - In WelcomeScreen, change the “Click here to see my rizz” button to:
    - onPointerDown (and/or onTouchStart as fallback) => call playRizz() immediately
    - onClick => only do UI state transition (setShowRizzScene(true)) and schedule preloadAllAudio() after 1200ms
  - Add an internal ref/flag so playRizz is only invoked once per entry (avoid double-calls from pointerDown + click).

2) Keep “play first, state later” invariant enforced
- Preserve your existing rule: playRizz() must run before setShowRizzScene(true).
- Add a small inline comment in WelcomeScreen that this is a non-negotiable iOS rule.

B) Reduce contention inside playRizz (silent unlocker vs main audio)
3) Prioritize rizz over the silent unlocker
- Right now playRizz() calls startSilentUnlocker() before creating/playing rizz.
- Proposed tweak:
  - Create rizz Audio and call audio.play() first (the critical path).
  - Start silent unlocker second within the same gesture (or start it only if iOS is detected).
- This reduces the chance that iOS Safari “spends” the first-play pipeline on the silent unlocker and delays the real track.

4) Add a deterministic retry strategy only for iOS
- If play() rejects or takes too long (e.g. still not playing after ~600–900ms), show the existing “Tap to enable sound” CTA (you already do this in RizzScene).
- Improve it slightly by:
  - Triggering the retry CTA sooner when we detect iOS + not playing.
  - Recording a “play attempt timestamp” in audioManager for debug and analytics.

C) Prevent future regressions with guardrails (so edits don’t break audio again)
5) Add “Audio Golden Rules” documentation in-code
- Add a prominent comment block at the top of src/lib/audioManager.ts explaining:
  - “Never create rizz Audio on mount”
  - “Never preload all audio on mount”
  - “Rizz must be created+played in the same user gesture”
  - “Prefer pointerdown/touchstart for first-play on iOS”
- This is the fastest “human-proofing”.

6) Add automated tests that fail when someone reintroduces iOS-breaking patterns
- Add a vitest test file that reads the source strings and asserts:
  - No warmRizzAudio/prewarming functions exist
  - playRizz contains “new Audio(” inside it
  - WelcomeScreen does not call preloadAllAudio() in the mount useEffect
  - WelcomeScreen triggers playRizz from pointerdown/touchstart handler (or at least not from a delayed async path)
- These are lightweight “lint-style” tests that prevent accidental regressions.

7) Add a build/version fingerprint to confirm production is running the latest code
- Add a build id string printed in the welcome screen and in DebugPanel:
  - Example: “version - 8008.69 | build: 2026-02-03-1”
- This avoids the common situation where Vercel cache/stale deploy makes it look like fixes “didn’t work”.

D) Add optional diagnostics for iPhone Safari “refresh got messed up”
8) Add a debug-only “audio timeline” panel (?debug=1)
- Extend DebugPanel to show:
  - last play attempt time
  - last play resolved time (if any)
  - last error
  - rizzHtmlAudio.readyState / networkState (where available)
- This will make any future report actionable immediately.

Files that will be changed / added
- Modify: src/components/game/WelcomeScreen.tsx
  - Add pointerdown/touchstart handler to start rizz earlier
  - Ensure play is called once via a local flag/ref
  - Keep click handler for UI transition + delayed preloadAllAudio
- Modify: src/lib/audioManager.ts
  - Reorder/conditionalize silent unlocker so it does not steal priority
  - Add minimal timing/debug fields for rizz attempts
  - Add “Golden Rules” comment header
- Modify: src/components/game/DebugPanel.tsx
  - Display rizz timing diagnostics + build id
- Add: src/test/audio-architecture.test.ts (or similar)
  - String-based architectural regression tests
- (Optional) Add: docs/AUDIO_RULES.md
  - Human-readable rules for future edits

Acceptance criteria (what you’ll verify on iPhone Safari)
1) Cold open: tap “Click here to see my rizz” → audio starts with minimal delay (improved vs now).
2) Same-tab refresh: first tap again → still plays reliably; if it fails, the “Tap to enable sound” appears quickly and works immediately.
3) No regressions:
   - Images/screens remain fast
   - Music 2 and 3 unchanged
4) Debug proof:
   - With ?debug=1, you can see play attempts and whether iOS is delaying/networking.

Questions I would normally ask (not blocking, but helps tune)
- Which iPhone/iOS version? (e.g., iOS 16/17/18)
- Is Low Power Mode on?
- Are you on cellular data or Wi‑Fi when you see “small delay”?
(We can proceed without this, but it helps decide whether to enable a more aggressive retry threshold.)

Implementation sequencing
1) WelcomeScreen pointerdown/touchstart change + one-call guard
2) audioManager silent unlocker prioritization + timing fields
3) DebugPanel enhancements
4) Add tests + (optional) docs
5) Re-test on iPhone Safari (cold load + refresh)

// Centralized Audio Manager - handles all 3 music tracks
// Music 1: Rizz scene only (rizz.mp3) - USES WEB AUDIO API for Safari compatibility
// Music 2: Gameplay - from "Tap to start" until hospital button (background.mp3)
// Music 3: Mourning - from hospital button through end screen + leaked video (mourning.mp3)

// ============ WEB AUDIO API FOR RIZZ (Safari-compatible) ============
// This is the ONLY way to get instant audio playback on iPhone Safari
let audioContext: AudioContext | null = null;
let rizzAudioBuffer: AudioBuffer | null = null;
let rizzBufferSource: AudioBufferSourceNode | null = null;
let rizzGainNode: GainNode | null = null;
// Fallback for devices/browsers where WebAudio starts but remains silent
let rizzHtmlAudio: HTMLAudioElement | null = null;

// Module-level singletons for other audio (persist across route navigations)
let gameMusicAudio: HTMLAudioElement | null = null;
let mourningAudio: HTMLAudioElement | null = null;

// Synchronous flags to prevent overlap
let mourningStartingOrPlaying = false;
let gameMusicPlaying = false;
let rizzPlaying = false;

// Preload flags
let gameMusicPreloaded = false;
let mourningPreloaded = false;
let rizzPreloaded = false;

// ============ CHECK IF RIZZ AUDIO IS READY ============
export const isRizzAudioReady = (): boolean => {
  return rizzPreloaded;
};

// iOS unlock flag - only need to unlock once per session
let iosAudioUnlocked = false;

// ============ iOS SILENT MODE BYPASS ============
// Playing a silent HTMLAudioElement alongside WebAudio forces iOS to treat
// the audio session as "media" rather than "ringer", bypassing silent mode
let silentAudioUnlocker: HTMLAudioElement | null = null;

// Silent MP3 data URL (0.1 second of silence, ~1KB)
const SILENT_MP3 = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRBr0AAAAAAAAAAAAAAAAAAAA//tQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQZB4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';

const startSilentUnlocker = (): void => {
  if (silentAudioUnlocker) return;
  
  try {
    silentAudioUnlocker = new Audio(SILENT_MP3);
    silentAudioUnlocker.loop = true;
    silentAudioUnlocker.volume = 0.01; // Nearly silent but not zero
    // iOS attributes
    (silentAudioUnlocker as any).playsInline = true;
    silentAudioUnlocker.setAttribute('playsinline', '');
    silentAudioUnlocker.setAttribute('webkit-playsinline', '');
    
    const playPromise = silentAudioUnlocker.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => console.log('✅ Silent unlocker started - iOS silent mode bypassed'))
        .catch(() => console.log('Silent unlocker failed (ok if not iOS)'));
    }
  } catch (e) {
    console.log('Silent unlocker error:', e);
  }
};

const stopSilentUnlocker = (): void => {
  if (silentAudioUnlocker) {
    silentAudioUnlocker.pause();
    silentAudioUnlocker = null;
  }
};

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass();
  }
  return audioContext;
};

// ============ iOS WEBAUDIO UNLOCK ROUTINE ============
// This is a battle-tested workaround for iOS Safari's audio restrictions
// Plays a silent buffer to "unlock" the AudioContext on first user gesture
const unlockIOSWebAudio = (ctx: AudioContext): void => {
  // Only unlock once per session
  if (iosAudioUnlocked) return;
  
  try {
    // Check if context needs unlocking
    const state = ctx.state as string; // Cast to handle 'interrupted' which isn't in TypeScript types
    if (state === 'suspended' || state === 'interrupted') {
      // Resume without awaiting - must stay synchronous
      void ctx.resume();
      console.log('AudioContext resume requested for unlock');
    }
    
    // Play a tiny silent buffer - this is the key iOS unlock trick
    // Creates a 1-sample (essentially silent) buffer and plays it immediately
    const silentBuffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    const silentSource = ctx.createBufferSource();
    silentSource.buffer = silentBuffer;
    silentSource.connect(ctx.destination);
    silentSource.start(0);
    
    iosAudioUnlocked = true;
    console.log('✅ iOS WebAudio unlock performed (silent buffer played)');
  } catch (e) {
    console.warn('iOS unlock attempt failed:', e);
  }
};

// ============ PRE-CACHE RIZZ AUDIO (Web Audio API) ============
// Fetch and decode audio EARLY so it's ready for instant playback
export const precacheRizzAudio = async () => {
  if (rizzAudioBuffer) {
    console.log('Rizz audio already cached in AudioBuffer');
    return;
  }

  // iOS Safari: avoid early WebAudio work (slow + can cause weird unlock states).
  // We rely on HTMLAudio for iOS reliability.
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    try {
      if (!rizzHtmlAudio) {
        rizzHtmlAudio = new Audio('/music/rizz.mp3');
        rizzHtmlAudio.volume = 0.5;
        rizzHtmlAudio.loop = true;
        rizzHtmlAudio.preload = 'auto';
        (rizzHtmlAudio as any).playsInline = true;
        rizzHtmlAudio.setAttribute('playsinline', '');
        rizzHtmlAudio.setAttribute('webkit-playsinline', '');
      }
      rizzHtmlAudio.load();
      rizzPreloaded = true;
      console.log('📱 iOS: Rizz HTMLAudio warmed (skipped WebAudio decode)');
    } catch (e) {
      console.error('❌ iOS: Failed to warm rizz HTMLAudio:', e);
    }
    return;
  }
  
  try {
    console.log('Starting rizz audio pre-cache with Web Audio API...');
    const ctx = getAudioContext();
    // IMPORTANT: Use MP3 for iOS Safari reliability. Safari often fails `decodeAudioData`
    // for MP4/AAC depending on encoding/container.
    const response = await fetch('/music/rizz.mp3');
    const arrayBuffer = await response.arrayBuffer();
    
    // Decode audio data into AudioBuffer - this is the key step
    rizzAudioBuffer = await ctx.decodeAudioData(arrayBuffer);
    rizzPreloaded = true;
    console.log('✅ Rizz audio decoded into AudioBuffer - ready for INSTANT playback');

    // Also warm up HTMLAudioElement as a fallback (no autoplay; just cache)
    if (!rizzHtmlAudio) {
      rizzHtmlAudio = new Audio('/music/rizz.mp3');
      rizzHtmlAudio.volume = 0.5;
      rizzHtmlAudio.loop = true;
      rizzHtmlAudio.preload = 'auto';
      // CRITICAL for iOS: must set playsInline
      (rizzHtmlAudio as any).playsInline = true;
      rizzHtmlAudio.setAttribute('playsinline', '');
      rizzHtmlAudio.setAttribute('webkit-playsinline', '');
    }
    // Ensure the browser starts caching it
    rizzHtmlAudio.load();
  } catch (e) {
    console.error('❌ Failed to pre-cache rizz audio:', e);
  }
};

const ensureRizzHtmlAudio = (): HTMLAudioElement => {
  if (!rizzHtmlAudio) {
    rizzHtmlAudio = new Audio('/music/rizz.mp3');
    rizzHtmlAudio.volume = 0.5;
    rizzHtmlAudio.loop = true;
    rizzHtmlAudio.preload = 'auto';
    // CRITICAL for iOS: must set playsInline
    (rizzHtmlAudio as any).playsInline = true;
    rizzHtmlAudio.setAttribute('playsinline', '');
    rizzHtmlAudio.setAttribute('webkit-playsinline', '');
  }
  return rizzHtmlAudio;
};

const playRizzIOS = (): void => {
  const audio = ensureRizzHtmlAudio();

  // IMPORTANT (iOS Safari): the *first* media play call must be the real audio,
  // otherwise Safari may reject the second play() as not user-initiated.
  // So: start rizz first, then kick the silent unlocker.
  try {
    // Use a tiny volume for the very first tick to help iOS treat it as media,
    // then raise it immediately after (doesn't need to be in gesture).
    audio.volume = 0.01;
    audio.currentTime = 0;

    const p = audio.play();
    rizzPlaying = true; // set sync so other tracks won't start over it

    // Start silent unlocker after rizz play is initiated
    setTimeout(() => startSilentUnlocker(), 0);

    if (p !== undefined) {
      p.then(() => {
        audio.volume = 0.5;
        console.log('🎵 iOS: Rizz started via HTMLAudio');
      }).catch((e) => {
        // Retry once with muted-toggle trick
        console.error('❌ iOS: Rizz HTMLAudio play failed:', e);
        try {
          audio.muted = true;
          const p2 = audio.play();
          if (p2 !== undefined) {
            p2.then(() => {
              audio.muted = false;
              audio.volume = 0.5;
              console.log('🎵 iOS: Rizz started after retry');
            }).catch((e2) => {
              console.error('❌ iOS: Rizz retry failed:', e2);
              rizzPlaying = false;
            });
          } else {
            audio.muted = false;
            audio.volume = 0.5;
            console.log('🎵 iOS: Rizz started (retry no-promise)');
          }
        } catch (e2) {
          console.error('❌ iOS: Rizz retry threw:', e2);
          rizzPlaying = false;
        }
      });
    } else {
      audio.volume = 0.5;
      console.log('🎵 iOS: Rizz started via HTMLAudio (no promise)');
    }
  } catch (e) {
    console.error('❌ iOS: Rizz HTMLAudio threw:', e);
    rizzPlaying = false;
  }
};

// ============ MUSIC 1: RIZZ (Web Audio API) ============
export const playRizz = () => {
  if (rizzPlaying) {
    console.log('Rizz already playing, skipping');
    return;
  }
  
  // Detect iOS Safari - they need special handling
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  // Ensure HTMLAudio element exists
  ensureRizzHtmlAudio();

  let webAudioStarted = false;
  let htmlAudioStarted = false;

  // ============ iOS SAFARI: HTMLAudio FIRST (SYNCHRONOUS) ============
  // iOS Safari requires audio play to happen SYNCHRONOUSLY in user gesture
  // The silent unlocker and WebAudio unlock can consume the gesture "budget"
  // So on iOS, we play HTMLAudio FIRST before anything else
  if (isIOS) {
    console.log('📱 iOS detected - using isolated iOS HTMLAudio path');
    playRizzIOS();
    return;
  }

  // ============ NON-iOS: WebAudio with HTMLAudio fallback ============
  // CRITICAL: Start silent unlocker FIRST to bypass iOS silent mode
  startSilentUnlocker();

  try {
    const ctx = getAudioContext();

    // CRITICAL: Run iOS unlock routine FIRST - plays silent buffer to prime AudioContext
    unlockIOSWebAudio(ctx);

    // CRITICAL: Resume context - Safari requires this in user gesture
    const state = ctx.state as string;
    if (state === 'suspended' || state === 'interrupted') {
      void ctx.resume();
      console.log('AudioContext resume requested');
    }

    // Stop any existing source
    if (rizzBufferSource) {
      try { rizzBufferSource.stop(); } catch {}
      rizzBufferSource.disconnect();
      rizzBufferSource = null;
    }

    if (rizzAudioBuffer) {
      rizzBufferSource = ctx.createBufferSource();
      rizzBufferSource.buffer = rizzAudioBuffer;
      rizzBufferSource.loop = true;

      if (!rizzGainNode) {
        rizzGainNode = ctx.createGain();
        rizzGainNode.gain.value = 0.5;
        rizzGainNode.connect(ctx.destination);
      }

      rizzBufferSource.connect(rizzGainNode);
      rizzBufferSource.start(0);
      webAudioStarted = true;
      rizzPlaying = true;
      console.log('🎵 Rizz audio started via Web Audio API');
    } else {
      console.warn('Rizz AudioBuffer missing; will rely on HTMLAudio fallback');
      void precacheRizzAudio();
    }
  } catch (e) {
    console.error('❌ WebAudio rizz start failed, falling back to HTMLAudio:', e);
  }

  // Fallback: if WebAudio didn't start, try HTMLAudio
  if (!webAudioStarted && rizzHtmlAudio) {
    try {
      rizzHtmlAudio.currentTime = 0;
      const playPromise = rizzHtmlAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            htmlAudioStarted = true;
            rizzPlaying = true;
            console.log('🎵 Rizz audio started via HTMLAudio fallback');
          })
          .catch((e) => {
            console.error('❌ HTMLAudio rizz play failed:', e);
          });
      } else {
        htmlAudioStarted = true;
        rizzPlaying = true;
        console.log('🎵 Rizz audio started via HTMLAudio fallback (no promise)');
      }
    } catch (e) {
      console.error('❌ HTMLAudio fallback threw:', e);
    }
  }

  console.log(`playRizz complete: webAudioStarted=${webAudioStarted}, htmlAudioStarted=${htmlAudioStarted}, rizzPlaying=${rizzPlaying}`);
};

/**
 * AGGRESSIVE RIZZ STOP - Ensures rizz audio CANNOT leak to other screens
 * 
 * On iOS 15-16, Safari may "queue" audio.play() requests. When another audio
 * starts later, it can inadvertently "release" the queued rizz audio.
 * 
 * This function aggressively stops rizz audio by:
 * 1. Setting the flag immediately (sync)
 * 2. Stopping the silent unlocker
 * 3. Stopping AND disconnecting WebAudio source
 * 4. Pausing, resetting, AND clearing event listeners on HTMLAudio
 */
export const stopRizz = () => {
  rizzPlaying = false;
  
  // Stop silent unlocker (iOS silent mode bypass)
  stopSilentUnlocker();
  
  // Stop WebAudio source
  if (rizzBufferSource) {
    try { 
      rizzBufferSource.stop(); 
    } catch (e) {
      // Ignore - might already be stopped
    }
    rizzBufferSource.disconnect();
    rizzBufferSource = null;
  }
  
  // CRITICAL: Aggressively stop HTMLAudio to prevent iOS "queued" playback
  if (rizzHtmlAudio) {
    rizzHtmlAudio.pause();
    rizzHtmlAudio.currentTime = 0;
    // Clear any event listeners that might re-trigger playback
    rizzHtmlAudio.onplay = null;
    rizzHtmlAudio.oncanplay = null;
    rizzHtmlAudio.oncanplaythrough = null;
    rizzHtmlAudio.onplaying = null;
  }
  
  console.log('🛑 Rizz audio FORCE STOPPED');
};

/**
 * Force-stop rizz - call this at the START of other music functions
 * to ensure rizz cannot "leak" into other screens
 */
export const forceStopRizz = () => {
  // Only do work if rizz might be playing
  if (!rizzPlaying && !rizzBufferSource && (!rizzHtmlAudio || rizzHtmlAudio.paused)) {
    return;
  }
  
  console.log('🚨 Force-stopping rizz before other audio');
  stopRizz();
};

// ============ PRELOAD ALL AUDIO ============
// Call this early (e.g., on WelcomeScreen mount) to ensure audio is ready
export const preloadAllAudio = () => {
  // Pre-cache rizz audio using Web Audio API
  precacheRizzAudio();
  
  // Preload Game Music (Music 2)
  if (!gameMusicAudio) {
    gameMusicAudio = new Audio('/music/background.mp3');
    gameMusicAudio.volume = 0.5;
    gameMusicAudio.loop = true;
    gameMusicAudio.preload = 'auto';
    gameMusicAudio.load();
    gameMusicAudio.oncanplaythrough = () => {
      gameMusicPreloaded = true;
      console.log('Game music preloaded');
    };
  }
  
  // Preload Mourning (Music 3)
  if (!mourningAudio) {
    mourningAudio = new Audio('/music/mourning.mp3');
    mourningAudio.volume = 0.5;
    mourningAudio.loop = true;
    mourningAudio.preload = 'auto';
    mourningAudio.load();
    mourningAudio.oncanplaythrough = () => {
      mourningPreloaded = true;
      console.log('Mourning audio preloaded');
    };
  }
};

// Specific preload for mourning music - call this when entering milk hospital
export const preloadMourningMusic = () => {
  if (!mourningAudio) {
    mourningAudio = new Audio('/music/mourning.mp3');
    mourningAudio.volume = 0.5;
    mourningAudio.loop = true;
    mourningAudio.preload = 'auto';
  }
  
  // Force reload to ensure it's cached
  mourningAudio.load();
  
  // Also try to "prime" the audio by playing silently for a moment
  const originalVolume = mourningAudio.volume;
  mourningAudio.volume = 0;
  mourningAudio.currentTime = 0;
  
  const primePromise = mourningAudio.play();
  if (primePromise !== undefined) {
    primePromise.then(() => {
      // Immediately pause after priming
      mourningAudio!.pause();
      mourningAudio!.currentTime = 0;
      mourningAudio!.volume = originalVolume;
      mourningPreloaded = true;
      console.log('Mourning audio primed and ready');
    }).catch(() => {
      // If priming fails, at least the load() will help
      mourningAudio!.volume = originalVolume;
      console.log('Mourning audio loaded (prime failed, but ready)');
    });
  }
};

// ============ MUSIC 2: GAME MUSIC ============
export const playGameMusic = () => {
  // CRITICAL: Force-stop rizz FIRST to prevent iOS audio leak
  forceStopRizz();
  
  // CRITICAL: Never start game music if mourning has started
  if (mourningStartingOrPlaying || gameMusicPlaying) return;
  
  try {
    // Ensure audio is created if not preloaded
    if (!gameMusicAudio) {
      gameMusicAudio = new Audio('/music/background.mp3');
      gameMusicAudio.volume = 0.5;
      gameMusicAudio.loop = true;
      gameMusicAudio.preload = 'auto';
    }
    
    gameMusicAudio.currentTime = 0;
    gameMusicPlaying = true;
    
    const playPromise = gameMusicAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        console.error('Game music failed:', e);
        // Retry once
        setTimeout(() => {
          if (gameMusicPlaying && !mourningStartingOrPlaying && gameMusicAudio) {
            gameMusicAudio.play().catch(() => {});
          }
        }, 200);
      });
    }
  } catch (e) {
    console.error('Game music error:', e);
    gameMusicPlaying = false;
  }
};

export const stopGameMusic = () => {
  gameMusicPlaying = false;
  if (gameMusicAudio) {
    gameMusicAudio.pause();
    gameMusicAudio.currentTime = 0;
  }
};

// Check if game music should keep playing (for keep-alive logic)
export const canGameMusicPlay = (): boolean => {
  return !mourningStartingOrPlaying;
};

export const isGameMusicPlaying = (): boolean => {
  return gameMusicPlaying && !mourningStartingOrPlaying;
};

// ============ MUSIC 3: MOURNING ============
export const playMourningMusic = () => {
  // CRITICAL: Force-stop rizz FIRST to prevent iOS audio leak
  forceStopRizz();
  
  // Prevent duplicate calls
  if (mourningStartingOrPlaying) return;
  
  // CRITICAL: Set flag IMMEDIATELY (sync) before any async operations
  mourningStartingOrPlaying = true;
  
  // CRITICAL: Stop game music IMMEDIATELY
  gameMusicPlaying = false;
  if (gameMusicAudio) {
    gameMusicAudio.pause();
    gameMusicAudio.currentTime = 0;
  }
  
  console.log('Starting mourning music - game music stopped');
  
  try {
    // Ensure audio is created if not preloaded
    if (!mourningAudio) {
      mourningAudio = new Audio('/music/mourning.mp3');
      mourningAudio.volume = 0.5;
      mourningAudio.loop = true;
      mourningAudio.preload = 'auto';
    }
    
    mourningAudio.currentTime = 0;
    
    const playPromise = mourningAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        console.error('Mourning music failed:', e);
        // Retry once
        setTimeout(() => {
          if (mourningStartingOrPlaying && mourningAudio) {
            mourningAudio.play().catch(() => {});
          }
        }, 200);
      });
    }
  } catch (e) {
    console.error('Mourning music error:', e);
  }
};

export const stopMourningMusic = () => {
  mourningStartingOrPlaying = false;
  if (mourningAudio) {
    mourningAudio.pause();
    mourningAudio.currentTime = 0;
  }
};

export const isMourningMusicPlaying = (): boolean => {
  return mourningStartingOrPlaying;
};

// ============ STOP ALL ============
export const stopAll = () => {
  console.log('Stopping all audio');
  
  // CRITICAL: Force-stop rizz FIRST
  forceStopRizz();
  
  // Reset all flags
  rizzPlaying = false;
  gameMusicPlaying = false;
  mourningStartingOrPlaying = false;
  
  // Stop silent unlocker (iOS silent mode bypass)
  stopSilentUnlocker();
  
  // Stop rizz (Web Audio API)
  if (rizzBufferSource) {
    try { rizzBufferSource.stop(); } catch {}
    rizzBufferSource.disconnect();
    rizzBufferSource = null;
  }
  
  // IMPORTANT: Also stop HTML fallback for rizz
  if (rizzHtmlAudio) {
    rizzHtmlAudio.pause();
    rizzHtmlAudio.currentTime = 0;
  }
  
  // Stop other audio
  if (gameMusicAudio) {
    gameMusicAudio.pause();
    gameMusicAudio.currentTime = 0;
  }
  
  if (mourningAudio) {
    mourningAudio.pause();
    mourningAudio.currentTime = 0;
  }
};

// ============ CLEANUP ============
// Call this only when completely leaving the game (rare)
export const destroyAll = () => {
  stopAll();
  
  // Clean up Web Audio API resources
  if (rizzGainNode) {
    rizzGainNode.disconnect();
    rizzGainNode = null;
  }
  rizzAudioBuffer = null;
  
  // Reset iOS unlock flag
  iosAudioUnlocked = false;
  
  if (gameMusicAudio) {
    gameMusicAudio.src = '';
    gameMusicAudio = null;
  }
  
  if (mourningAudio) {
    mourningAudio.src = '';
    mourningAudio = null;
  }
  
  if (rizzHtmlAudio) {
    rizzHtmlAudio.src = '';
    rizzHtmlAudio = null;
  }
  
  // Close AudioContext
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
};

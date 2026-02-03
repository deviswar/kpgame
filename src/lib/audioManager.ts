// Centralized Audio Manager - handles all 3 music tracks
// Music 1: Rizz scene only (rizz.mp3) - USES WEB AUDIO API for Safari compatibility
// Music 2: Gameplay - from "Tap to start" until hospital button (background.mp3)
// Music 3: Mourning - from hospital button through end screen + leaked video (mourning.mp3)

import { publicAssetUrl } from '@/lib/assetUrl';
import { debug } from '@/lib/debug';

// ============ WEB AUDIO API FOR RIZZ (Safari-compatible) ============
let audioContext: AudioContext | null = null;
let rizzAudioBuffer: AudioBuffer | null = null;
let rizzBufferSource: AudioBufferSourceNode | null = null;
let rizzGainNode: GainNode | null = null;
let rizzHtmlAudio: HTMLAudioElement | null = null;

// Module-level singletons for other audio
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

// Debug status tracking
let rizzLastMethod: 'webaudio' | 'htmlaudio' | 'ios-htmlaudio' | null = null;
let rizzLastError: string | null = null;

// ============ GET RIZZ STATUS FOR DEBUG UI ============
export const getRizzStatus = () => ({
  isPlaying: rizzPlaying,
  preloaded: rizzPreloaded,
  method: rizzLastMethod,
  lastError: rizzLastError,
  htmlAudioState: rizzHtmlAudio ? {
    readyState: rizzHtmlAudio.readyState,
    paused: rizzHtmlAudio.paused,
    currentTime: rizzHtmlAudio.currentTime,
  } : null,
});

// ============ CHECK IF RIZZ AUDIO IS READY ============
export const isRizzAudioReady = (): boolean => rizzPreloaded;

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
    silentAudioUnlocker.volume = 0.01;
    (silentAudioUnlocker as any).playsInline = true;
    silentAudioUnlocker.setAttribute('playsinline', '');
    silentAudioUnlocker.setAttribute('webkit-playsinline', '');
    
    const playPromise = silentAudioUnlocker.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => debug.log('✅ Silent unlocker started'))
        .catch(() => debug.log('Silent unlocker failed (ok if not iOS)'));
    }
  } catch (e) {
    debug.log('Silent unlocker error:', e);
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
const unlockIOSWebAudio = (ctx: AudioContext): void => {
  if (iosAudioUnlocked) return;
  
  try {
    const state = ctx.state as string;
    if (state === 'suspended' || state === 'interrupted') {
      void ctx.resume();
      debug.log('AudioContext resume requested for unlock');
    }
    
    const silentBuffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    const silentSource = ctx.createBufferSource();
    silentSource.buffer = silentBuffer;
    silentSource.connect(ctx.destination);
    silentSource.start(0);
    
    iosAudioUnlocked = true;
    debug.log('✅ iOS WebAudio unlock performed');
  } catch (e) {
    debug.warn('iOS unlock attempt failed:', e);
  }
};

// ============ PRE-CACHE RIZZ AUDIO ============
export const precacheRizzAudio = async () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS) {
    // iOS: CANNOT preload audio - gesture requirements prevent it from working
    // Just mark as ready - we'll create FRESH audio in the click handler
    rizzPreloaded = true;
    debug.log('📱 iOS: Rizz ready (will create fresh audio on play)');
    return;
  }
  
  // Non-iOS: Create and preload HTMLAudio for instant playback
  if (!rizzHtmlAudio) {
    rizzHtmlAudio = new Audio(publicAssetUrl('music/rizz.mp3'));
    rizzHtmlAudio.volume = 0.5;
    rizzHtmlAudio.loop = true;
    rizzHtmlAudio.preload = 'auto';
    (rizzHtmlAudio as any).playsInline = true;
    rizzHtmlAudio.setAttribute('playsinline', '');
    rizzHtmlAudio.setAttribute('webkit-playsinline', '');
    rizzHtmlAudio.load();
    
    // Mark ready IMMEDIATELY for non-iOS
    rizzPreloaded = true;
    debug.log('✅ Rizz HTMLAudio ready (instant playback available)');
  }

  // Already decoded? Skip WebAudio
  if (rizzAudioBuffer) {
    debug.log('Rizz WebAudio already cached');
    return;
  }
  
  // Background decode for WebAudio (upgrade path for better quality on desktop)
  try {
    debug.log('Starting WebAudio decode in background...');
    const ctx = getAudioContext();
    const response = await fetch(publicAssetUrl('music/rizz.mp3'));
    const arrayBuffer = await response.arrayBuffer();
    
    rizzAudioBuffer = await ctx.decodeAudioData(arrayBuffer);
    debug.log('✅ Rizz WebAudio decoded (quality upgrade available)');
  } catch (e) {
    debug.warn('WebAudio decode failed, HTMLAudio fallback active:', e);
  }
};

/**
 * iOS RIZZ PLAYBACK - CRITICAL FIX
 * 
 * iOS Safari requires audio elements to be created INSIDE the user gesture context.
 * Pre-created audio elements (from preload) are NOT allowed to play.
 * 
 * This is why game music works (it creates audio in handler) but rizz failed
 * (it tried to use a preloaded audio element).
 * 
 * Solution: Create a FRESH Audio element right here, in the click handler.
 */
const playRizzIOS = (): void => {
  debug.log('📱 playRizzIOS: Creating FRESH audio in gesture context');
  
  // CRITICAL: Create NEW audio element inside user gesture
  // This is blessed by iOS Safari's gesture requirement
  const audio = new Audio(publicAssetUrl('music/rizz.mp3'));
  audio.volume = 0.5;
  audio.loop = true;
  (audio as any).playsInline = true;
  audio.setAttribute('playsinline', '');
  audio.setAttribute('webkit-playsinline', '');
  
  // Store for later stop/control
  rizzHtmlAudio = audio;
  
  rizzPlaying = true;
  rizzLastMethod = 'ios-htmlaudio';
  rizzLastError = null;
  
  // Play immediately - will work because we're in gesture context
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        debug.log('🎵 iOS: Rizz playing (fresh audio in gesture)');
        rizzLastError = null;
        startSilentUnlocker();
      })
      .catch((error) => {
        debug.error('❌ iOS: Rizz failed:', error);
        rizzPlaying = false;
        rizzLastError = `iOS play failed: ${error.message || error}`;
      });
  } else {
    debug.log('🎵 iOS: Rizz started (no promise)');
    startSilentUnlocker();
  }
};

// ============ MUSIC 1: RIZZ ============
export const playRizz = () => {
  if (rizzPlaying) {
    debug.log('Rizz already playing, skipping');
    return;
  }
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // iOS: Use fresh audio creation (CRITICAL for gesture requirement)
  if (isIOS) {
    debug.log('📱 iOS detected - creating fresh audio in gesture');
    playRizzIOS();
    return;
  }

  // Non-iOS path: Use preloaded audio or WebAudio
  let webAudioStarted = false;
  let htmlAudioStarted = false;

  startSilentUnlocker();

  try {
    const ctx = getAudioContext();
    unlockIOSWebAudio(ctx);

    const state = ctx.state as string;
    if (state === 'suspended' || state === 'interrupted') {
      void ctx.resume();
      debug.log('AudioContext resume requested');
    }

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
      rizzLastMethod = 'webaudio';
      rizzLastError = null;
      debug.log('🎵 Rizz started via WebAudio');
    } else {
      debug.warn('Rizz AudioBuffer missing; using HTMLAudio fallback');
      void precacheRizzAudio();
    }
  } catch (e) {
    debug.error('❌ WebAudio rizz failed, falling back:', e);
  }

  if (!webAudioStarted && rizzHtmlAudio) {
    try {
      rizzHtmlAudio.currentTime = 0;
      const playPromise = rizzHtmlAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            htmlAudioStarted = true;
            rizzPlaying = true;
            rizzLastMethod = 'htmlaudio';
            rizzLastError = null;
            debug.log('🎵 Rizz started via HTMLAudio fallback');
          })
          .catch((e: any) => {
            debug.error('❌ HTMLAudio rizz failed:', e);
            rizzLastError = `HTMLAudio fallback failed: ${e.message || e}`;
          });
      } else {
        htmlAudioStarted = true;
        rizzPlaying = true;
        debug.log('🎵 Rizz started via HTMLAudio (no promise)');
      }
    } catch (e) {
      debug.error('❌ HTMLAudio fallback threw:', e);
    }
  }

  debug.log(`playRizz complete: webAudio=${webAudioStarted}, htmlAudio=${htmlAudioStarted}`);
};

/**
 * AGGRESSIVE RIZZ STOP - Ensures rizz audio CANNOT leak to other screens
 */
export const stopRizz = () => {
  rizzPlaying = false;
  stopSilentUnlocker();
  
  if (rizzBufferSource) {
    try { rizzBufferSource.stop(); } catch {}
    rizzBufferSource.disconnect();
    rizzBufferSource = null;
  }
  
  if (rizzHtmlAudio) {
    rizzHtmlAudio.pause();
    rizzHtmlAudio.currentTime = 0;
    rizzHtmlAudio.onplay = null;
    rizzHtmlAudio.oncanplay = null;
    rizzHtmlAudio.oncanplaythrough = null;
    rizzHtmlAudio.onplaying = null;
  }
  
  debug.log('🛑 Rizz audio FORCE STOPPED');
};

/**
 * Force-stop rizz - call this at the START of other music functions
 */
export const forceStopRizz = () => {
  if (!rizzPlaying && !rizzBufferSource && (!rizzHtmlAudio || rizzHtmlAudio.paused)) {
    return;
  }
  
  debug.log('🚨 Force-stopping rizz before other audio');
  stopRizz();
};

// ============ PRELOAD ALL AUDIO ============
export const preloadAllAudio = () => {
  precacheRizzAudio();
  
  if (!gameMusicAudio) {
    gameMusicAudio = new Audio(publicAssetUrl('music/background.mp3'));
    gameMusicAudio.volume = 0.5;
    gameMusicAudio.loop = true;
    gameMusicAudio.preload = 'auto';
    gameMusicAudio.load();
    gameMusicAudio.oncanplaythrough = () => {
      gameMusicPreloaded = true;
      debug.log('Game music preloaded');
    };
  }
  
  if (!mourningAudio) {
    mourningAudio = new Audio(publicAssetUrl('music/mourning.mp3'));
    mourningAudio.volume = 0.5;
    mourningAudio.loop = true;
    mourningAudio.preload = 'auto';
    mourningAudio.load();
    mourningAudio.oncanplaythrough = () => {
      mourningPreloaded = true;
      debug.log('Mourning audio preloaded');
    };
  }
};

export const preloadMourningMusic = () => {
  if (!mourningAudio) {
    mourningAudio = new Audio(publicAssetUrl('music/mourning.mp3'));
    mourningAudio.volume = 0.5;
    mourningAudio.loop = true;
    mourningAudio.preload = 'auto';
  }
  
  mourningAudio.load();
  
  const originalVolume = mourningAudio.volume;
  mourningAudio.volume = 0;
  mourningAudio.currentTime = 0;
  
  const primePromise = mourningAudio.play();
  if (primePromise !== undefined) {
    primePromise.then(() => {
      mourningAudio!.pause();
      mourningAudio!.currentTime = 0;
      mourningAudio!.volume = originalVolume;
      mourningPreloaded = true;
      debug.log('Mourning audio primed and ready');
    }).catch(() => {
      mourningAudio!.volume = originalVolume;
      debug.log('Mourning audio loaded (prime failed)');
    });
  }
};

// ============ MUSIC 2: GAME MUSIC ============
export const playGameMusic = () => {
  forceStopRizz();
  
  if (mourningStartingOrPlaying || gameMusicPlaying) return;
  
  try {
    if (!gameMusicAudio) {
      gameMusicAudio = new Audio(publicAssetUrl('music/background.mp3'));
      gameMusicAudio.volume = 0.5;
      gameMusicAudio.loop = true;
      gameMusicAudio.preload = 'auto';
    }
    
    gameMusicAudio.currentTime = 0;
    gameMusicPlaying = true;
    
    const playPromise = gameMusicAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        debug.error('Game music failed:', e);
        setTimeout(() => {
          if (gameMusicPlaying && !mourningStartingOrPlaying && gameMusicAudio) {
            gameMusicAudio.play().catch(() => {});
          }
        }, 200);
      });
    }
  } catch (e) {
    debug.error('Game music error:', e);
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
  forceStopRizz();
  
  if (mourningStartingOrPlaying) return;
  
  mourningStartingOrPlaying = true;
  
  gameMusicPlaying = false;
  if (gameMusicAudio) {
    gameMusicAudio.pause();
    gameMusicAudio.currentTime = 0;
  }
  
  debug.log('Starting mourning music - game music stopped');
  
  try {
    if (!mourningAudio) {
      mourningAudio = new Audio(publicAssetUrl('music/mourning.mp3'));
      mourningAudio.volume = 0.5;
      mourningAudio.loop = true;
      mourningAudio.preload = 'auto';
    }
    
    mourningAudio.currentTime = 0;
    
    const playPromise = mourningAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        debug.error('Mourning music failed:', e);
        setTimeout(() => {
          if (mourningStartingOrPlaying && mourningAudio) {
            mourningAudio.play().catch(() => {});
          }
        }, 200);
      });
    }
  } catch (e) {
    debug.error('Mourning music error:', e);
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
  debug.log('Stopping all audio');
  
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

// Centralized Audio Manager - handles all 3 music tracks
// Music 1: Rizz scene only (rizz.mp3) - PRE-WARMED for instant playback
// Music 2: Gameplay - from "Tap to start" until hospital button (background.mp3)
// Music 3: Mourning - from hospital button through end screen + leaked video (mourning.mp3)

import { publicAssetUrl } from '@/lib/assetUrl';
import { debug } from '@/lib/debug';

// ============ PRE-WARMED RIZZ AUDIO (ZERO DELAY) ============
let rizzWarmAudio: HTMLAudioElement | null = null;
let rizzWarmedUp = false;

// Legacy references (kept for stopRizz compatibility)
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
let rizzLastMethod: 'webaudio' | 'htmlaudio' | 'ios-htmlaudio' | 'prewarmed' | null = null;
let rizzLastError: string | null = null;

// ============ GET RIZZ STATUS FOR DEBUG UI ============
export const getRizzStatus = () => ({
  isPlaying: rizzPlaying,
  preloaded: rizzPreloaded,
  warmedUp: rizzWarmedUp,
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

// ============ WARM RIZZ AUDIO (ZERO-DELAY PRELOAD) ============
/**
 * Creates the audio element and waits for 'canplaythrough' event
 * This ensures the audio is FULLY BUFFERED before user clicks
 * 
 * Call this on WelcomeScreen mount for instant playback
 */
export const warmRizzAudio = (): Promise<void> => {
  return new Promise((resolve) => {
    // Already warmed? Return immediately
    if (rizzWarmedUp && rizzWarmAudio) {
      debug.log('🔥 Rizz already warmed up');
      resolve();
      return;
    }
    
    debug.log('🔥 Starting Rizz audio warm-up...');
    
    // Create audio element immediately
    rizzWarmAudio = new Audio(publicAssetUrl('music/rizz.mp3'));
    rizzWarmAudio.volume = 0.5;
    rizzWarmAudio.loop = true;
    rizzWarmAudio.preload = 'auto';
    (rizzWarmAudio as any).playsInline = true;
    rizzWarmAudio.setAttribute('playsinline', '');
    rizzWarmAudio.setAttribute('webkit-playsinline', '');
    
    // Track if we've resolved to avoid double-resolution
    let resolved = false;
    
    const markReady = (source: string) => {
      if (resolved) return;
      resolved = true;
      rizzWarmedUp = true;
      rizzPreloaded = true;
      debug.log(`🔥 Rizz audio READY (${source})`);
      resolve();
    };
    
    // Wait for full buffer - this is the key to instant playback
    rizzWarmAudio.addEventListener('canplaythrough', () => {
      markReady('canplaythrough - fully buffered');
    }, { once: true });
    
    // Also listen to 'canplay' as early indicator
    rizzWarmAudio.addEventListener('canplay', () => {
      debug.log('🔥 Rizz canplay event (partial buffer)');
    }, { once: true });
    
    // Fallback timeout (3 seconds max wait)
    setTimeout(() => {
      markReady('timeout fallback');
    }, 3000);
    
    // Start loading
    rizzWarmAudio.load();
  });
};

// ============ PRE-CACHE RIZZ AUDIO (delegates to warmRizzAudio) ============
export const precacheRizzAudio = async () => {
  await warmRizzAudio();
};

// ============ iOS FALLBACK (only used if pre-warm fails) ============
const playRizzIOSFallback = (): void => {
  debug.log('📱 playRizzIOSFallback: Creating fresh audio');
  
  const audio = new Audio(publicAssetUrl('music/rizz.mp3'));
  audio.volume = 0.5;
  audio.loop = true;
  (audio as any).playsInline = true;
  audio.setAttribute('playsinline', '');
  audio.setAttribute('webkit-playsinline', '');
  
  rizzHtmlAudio = audio;
  rizzPlaying = true;
  rizzLastMethod = 'ios-htmlaudio';
  
  audio.play()
    .then(() => {
      debug.log('🎵 Rizz playing (iOS fallback)');
      startSilentUnlocker();
    })
    .catch((e) => {
      debug.error('❌ iOS fallback failed:', e);
      rizzPlaying = false;
      rizzLastError = `iOS fallback failed: ${e.message || e}`;
    });
};

// ============ MUSIC 1: RIZZ (INSTANT PLAYBACK) ============
export const playRizz = () => {
  if (rizzPlaying) {
    debug.log('Rizz already playing, skipping');
    return;
  }
  
  startSilentUnlocker();
  
  // PRIMARY PATH: Use pre-warmed audio (INSTANT!)
  if (rizzWarmAudio && rizzWarmedUp) {
    debug.log('🚀 Playing pre-warmed rizz audio (INSTANT)');
    
    rizzWarmAudio.currentTime = 0;
    rizzPlaying = true;
    rizzHtmlAudio = rizzWarmAudio; // Store for stop control
    rizzLastMethod = 'prewarmed';
    rizzLastError = null;
    
    const playPromise = rizzWarmAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          debug.log('🎵 Rizz playing INSTANTLY (pre-warmed)');
        })
        .catch((e) => {
          debug.warn('Pre-warmed audio failed, trying iOS fallback:', e);
          rizzPlaying = false;
          playRizzIOSFallback();
        });
    }
    return;
  }
  
  // FALLBACK: Not warmed yet - create fresh audio
  debug.log('⚠️ Rizz not pre-warmed, using fallback');
  playRizzIOSFallback();
};

/**
 * AGGRESSIVE RIZZ STOP - Ensures rizz audio CANNOT leak to other screens
 */
export const stopRizz = () => {
  rizzPlaying = false;
  stopSilentUnlocker();
  
  // Stop WebAudio if it was used
  if (rizzBufferSource) {
    try { rizzBufferSource.stop(); } catch {}
    rizzBufferSource.disconnect();
    rizzBufferSource = null;
  }
  
  // Stop HTMLAudio (includes pre-warmed audio)
  if (rizzHtmlAudio) {
    rizzHtmlAudio.pause();
    rizzHtmlAudio.currentTime = 0;
    rizzHtmlAudio.onplay = null;
    rizzHtmlAudio.oncanplay = null;
    rizzHtmlAudio.oncanplaythrough = null;
    rizzHtmlAudio.onplaying = null;
  }
  
  // Also stop the warm audio if it's different
  if (rizzWarmAudio && rizzWarmAudio !== rizzHtmlAudio) {
    rizzWarmAudio.pause();
    rizzWarmAudio.currentTime = 0;
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
  // Rizz is handled by warmRizzAudio() which is called first
  // This just ensures it's triggered if not already
  if (!rizzWarmedUp) {
    warmRizzAudio();
  }
  
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

export const isMourningPlaying = (): boolean => {
  return mourningStartingOrPlaying;
};

// ============ STOP ALL AUDIO ============
export const stopAllAudio = () => {
  stopRizz();
  stopGameMusic();
  stopMourningMusic();
  stopSilentUnlocker();
};

// Alias for backward compatibility
export const stopAll = stopAllAudio;

// ============ RESET FOR GAME RESTART ============
export const resetAudioState = () => {
  stopAllAudio();
  mourningStartingOrPlaying = false;
  gameMusicPlaying = false;
  rizzPlaying = false;
  
  // Keep pre-warmed audio intact for replay
  // rizzWarmedUp stays true, rizzWarmAudio stays loaded
  
  debug.log('Audio state reset for game restart');
};

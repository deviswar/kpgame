// Centralized Audio Manager - handles all 3 music tracks
// Music 1: Rizz scene only (rizz.mp3) - Created fresh on gesture for iOS compatibility
// Music 2: Gameplay - from "Tap to start" until hospital button (background.mp3)
// Music 3: Mourning - from hospital button through end screen + leaked video (mourning.mp3)

import { publicAssetUrl } from '@/lib/assetUrl';
import { debug } from '@/lib/debug';

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

// ============ PRE-CACHE RIZZ AUDIO (simplified - just marks ready) ============
export const precacheRizzAudio = async () => {
  // Just mark as ready - audio will be created on demand in gesture context
  rizzPreloaded = true;
};

// ============ MUSIC 1: RIZZ (SIMPLE PATTERN - CREATE ON GESTURE) ============
export const playRizz = () => {
  if (rizzPlaying) {
    debug.log('Rizz already playing, skipping');
    return;
  }
  
  startSilentUnlocker();
  
  // Create fresh audio in gesture context (iOS requirement!)
  const audio = new Audio(publicAssetUrl('music/rizz.mp3'));
  audio.preload = 'auto';
  audio.volume = 0.5;
  audio.loop = true;
  (audio as any).playsInline = true;
  audio.setAttribute('playsinline', '');
  audio.setAttribute('webkit-playsinline', '');
  // Kick off loading immediately (some iOS Safari versions behave better with an explicit load())
  try { audio.load(); } catch {}
  
  rizzHtmlAudio = audio;
  rizzPlaying = true;
  rizzLastMethod = 'htmlaudio';
  rizzLastError = null;
  
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => debug.log('🎵 Rizz playing (fresh audio in gesture)'))
      .catch((e) => {
        debug.error('❌ Rizz failed:', e);
        rizzPlaying = false;
        rizzLastError = e.message || String(e);
      });
  }
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
  
  // Stop HTMLAudio
  if (rizzHtmlAudio) {
    rizzHtmlAudio.pause();
    rizzHtmlAudio.currentTime = 0;
    rizzHtmlAudio.onplay = null;
    rizzHtmlAudio.oncanplay = null;
    rizzHtmlAudio.oncanplaythrough = null;
    rizzHtmlAudio.onplaying = null;
    rizzHtmlAudio = null;
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
  // Mark rizz as ready (will be created on demand)
  rizzPreloaded = true;
  
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
  debug.log('Audio state reset for game restart');
};

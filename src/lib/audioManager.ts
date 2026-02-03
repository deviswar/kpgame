/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    AUDIO MANAGER - ARCHITECTURE RULES                         ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                              ║
 * ║  🚨 iOS SAFARI AUDIO REQUIREMENTS - DO NOT VIOLATE 🚨                        ║
 * ║                                                                              ║
 * ║  1. Audio MUST be created AND played in the SAME user gesture context       ║
 * ║     - ✅ onClick → new Audio() → audio.play()                                ║
 * ║     - ❌ onMount → new Audio() ... later onClick → audio.play()              ║
 * ║                                                                              ║
 * ║  2. Pre-warming/pre-buffering audio BREAKS iOS playback                     ║
 * ║     - ❌ warmRizzAudio(), preloadWithCanPlayThrough()                        ║
 * ║     - ✅ Just mark as "ready", create Audio on demand in gesture             ║
 * ║                                                                              ║
 * ║  3. Do NOT call preloadAllAudio() on mount - saturates bandwidth            ║
 * ║     - ✅ Call preloadAllAudio() AFTER first user interaction                 ║
 * ║     - ✅ Use 1200ms delay to let primary audio start first                   ║
 * ║                                                                              ║
 * ║  4. Prefer pointerdown/touchstart over onClick for first-play on iOS        ║
 * ║     - These events fire earlier and more reliably on mobile Safari          ║
 * ║                                                                              ║
 * ║  5. Silent unlocker must start AFTER main audio.play() call                 ║
 * ║     - Reduces contention for iOS audio pipeline                              ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// Centralized Audio Manager - handles all 3 music tracks
// Music 1: Rizz scene only (rizz.mp3) - Created fresh on gesture for iOS compatibility
// Music 2: Gameplay - from "Tap to start" until hospital button (background.mp3)
// Music 3: Mourning - from hospital button through end screen + leaked video (mourning.mp3)

import { publicAssetUrl } from '@/lib/assetUrl';
import { debug } from '@/lib/debug';

// ═══════════════════════════════════════════════════════════════════════════════
// STATE VARIABLES
// ═══════════════════════════════════════════════════════════════════════════════

// Rizz audio (Music 1) - created on demand in gesture context
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

// Debug/timing tracking for diagnostics
let rizzLastMethod: 'htmlaudio' | null = null;
let rizzLastError: string | null = null;
let rizzPlayAttemptTime: number | null = null;
let rizzPlayResolvedTime: number | null = null;

// ═══════════════════════════════════════════════════════════════════════════════
// CACHE WARMING (NO AUDIO ELEMENTS)
// ═══════════════════════════════════════════════════════════════════════════════
// iOS Safari can ignore/deprioritize <audio preload>. A safe improvement is to
// warm the HTTP cache using fetch() (no play(), no gesture requirement).
const warmHttpCache = async (url: string): Promise<void> => {
  try {
    // Use GET (not HEAD) so the media bytes can be cached.
    // keepalive helps on iOS when a navigation is happening.
    await fetch(url, { method: 'GET', cache: 'force-cache', keepalive: true });
  } catch (e) {
    // Non-fatal: cache warming is best-effort.
    debug.log('Cache warm failed:', url, e);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEBUG STATUS FOR DebugPanel
// ═══════════════════════════════════════════════════════════════════════════════

export const getRizzStatus = () => ({
  isPlaying: rizzPlaying,
  preloaded: rizzPreloaded,
  method: rizzLastMethod,
  lastError: rizzLastError,
  playAttemptTime: rizzPlayAttemptTime,
  playResolvedTime: rizzPlayResolvedTime,
  latencyMs: rizzPlayAttemptTime && rizzPlayResolvedTime 
    ? rizzPlayResolvedTime - rizzPlayAttemptTime 
    : null,
  htmlAudioState: rizzHtmlAudio ? {
    readyState: rizzHtmlAudio.readyState,
    networkState: rizzHtmlAudio.networkState,
    paused: rizzHtmlAudio.paused,
    currentTime: rizzHtmlAudio.currentTime,
  } : null,
});

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export const isRizzAudioReady = (): boolean => rizzPreloaded;

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
  // Best-effort: warm HTTP cache without creating Audio elements.
  // Audio will still be created on-demand in the gesture.
  rizzPreloaded = true;
  void warmHttpCache(publicAssetUrl('music/rizz.mp3'));
};

// ═══════════════════════════════════════════════════════════════════════════════
// MUSIC 1: RIZZ (SIMPLE PATTERN - CREATE ON GESTURE)
// ═══════════════════════════════════════════════════════════════════════════════

export const playRizz = () => {
  if (rizzPlaying) {
    debug.log('Rizz already playing, skipping');
    return;
  }
  
  // Record attempt time for diagnostics
  rizzPlayAttemptTime = Date.now();
  rizzPlayResolvedTime = null;
  rizzLastError = null;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // 🔑 CRITICAL: Create audio FIRST, play() FIRST, THEN silent unlocker.
  // This ensures iOS Safari prioritizes the real audio over the silent hack.
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Create fresh audio in gesture context (iOS requirement!)
  const audio = new Audio(publicAssetUrl('music/rizz.mp3'));
  audio.preload = 'auto';
  audio.volume = 0.5;
  audio.loop = true;
  (audio as any).playsInline = true;
  audio.setAttribute('playsinline', '');
  audio.setAttribute('webkit-playsinline', '');
  
  // Kick off loading immediately
  try { audio.load(); } catch {}
  
  rizzHtmlAudio = audio;
  rizzPlaying = true;
  rizzLastMethod = 'htmlaudio';
  
  // 🎵 PLAY FIRST - This is the critical path
  const playPromise = audio.play();
  
  // 🔇 THEN start silent unlocker (lower priority, helps with iOS silent mode)
  startSilentUnlocker();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        rizzPlayResolvedTime = Date.now();
        const latency = rizzPlayResolvedTime - (rizzPlayAttemptTime || 0);
        debug.log(`🎵 Rizz playing (latency: ${latency}ms)`);
      })
      .catch((e) => {
        debug.error('❌ Rizz failed:', e);
        rizzLastError = (e as any)?.message || String(e);
        // IMPORTANT: fully clean up so future tracks aren't affected.
        stopRizz();
      });
  }
};

/**
 * AGGRESSIVE RIZZ STOP - Ensures rizz audio CANNOT leak to other screens
 */
export const stopRizz = () => {
  rizzPlaying = false;
  stopSilentUnlocker();
  
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
  if (!rizzPlaying && (!rizzHtmlAudio || rizzHtmlAudio.paused)) {
    return;
  }
  
  debug.log('🚨 Force-stopping rizz before other audio');
  stopRizz();
};

// ============ PRELOAD ALL AUDIO ============
export const preloadAllAudio = () => {
  // Mark rizz as ready (will be created on demand)
  rizzPreloaded = true;

  // Warm HTTP cache for all tracks (best-effort, no Audio elements required)
  void warmHttpCache(publicAssetUrl('music/rizz.mp3'));
  void warmHttpCache(publicAssetUrl('music/background.mp3'));
  void warmHttpCache(publicAssetUrl('music/mourning.mp3'));
  
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
  // IMPORTANT (iOS): never call play() here; it can be blocked and cause
  // confusing state. Preload = cache-warm + create Audio instance only.
  mourningPreloaded = true;
  void warmHttpCache(publicAssetUrl('music/mourning.mp3'));

  if (!mourningAudio) {
    mourningAudio = new Audio(publicAssetUrl('music/mourning.mp3'));
    mourningAudio.volume = 0.5;
    mourningAudio.loop = true;
    mourningAudio.preload = 'auto';
    try { mourningAudio.load(); } catch {}
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

     // Keep iOS in “media playback” mode after the user gesture.
     // (Does nothing on non‑iOS; startSilentUnlocker() is idempotent.)
     startSilentUnlocker();

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

     // Keep iOS in “media playback” mode after the user gesture.
     startSilentUnlocker();

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

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

// ============ WEB AUDIO CONTEXT HELPER ============
const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass();
  }
  return audioContext;
};

// ============ PRE-CACHE RIZZ AUDIO (Web Audio API) ============
// Fetch and decode audio EARLY so it's ready for instant playback
export const precacheRizzAudio = async () => {
  if (rizzAudioBuffer) {
    console.log('Rizz audio already cached in AudioBuffer');
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
  } catch (e) {
    console.error('❌ Failed to pre-cache rizz audio:', e);
  }
};

// ============ MUSIC 1: RIZZ (Web Audio API) ============
export const playRizz = () => {
  if (rizzPlaying) {
    console.log('Rizz already playing, skipping');
    return;
  }
  
  const ctx = getAudioContext();
  
  // CRITICAL: Resume context FIRST - Safari requires this in user gesture
  if (ctx.state === 'suspended') {
    ctx.resume();
    console.log('AudioContext resumed');
  }
  
  // Stop any existing source
  if (rizzBufferSource) {
    try { rizzBufferSource.stop(); } catch {}
    rizzBufferSource.disconnect();
    rizzBufferSource = null;
  }
  
  if (!rizzAudioBuffer) {
    console.error('❌ Rizz audio not preloaded! Attempting emergency load...');
    // Emergency fallback - try to load now (will have delay but better than nothing)
    precacheRizzAudio().then(() => {
      if (rizzAudioBuffer) {
        playRizz();
      }
    });
    return;
  }
  
  // Create new buffer source (MUST create fresh each time - can't reuse)
  rizzBufferSource = ctx.createBufferSource();
  rizzBufferSource.buffer = rizzAudioBuffer;
  rizzBufferSource.loop = true;
  
  // Create gain node for volume control (reuse if exists)
  if (!rizzGainNode) {
    rizzGainNode = ctx.createGain();
    rizzGainNode.gain.value = 0.5;
    rizzGainNode.connect(ctx.destination);
  }
  
  rizzBufferSource.connect(rizzGainNode);
  
  // START IMMEDIATELY - this is synchronous and instant!
  rizzBufferSource.start(0);
  rizzPlaying = true;
  
  console.log('🎵 Rizz audio playing INSTANTLY via Web Audio API');
};

export const stopRizz = () => {
  rizzPlaying = false;
  if (rizzBufferSource) {
    try { 
      rizzBufferSource.stop(); 
    } catch (e) {
      // Ignore - might already be stopped
    }
    rizzBufferSource.disconnect();
    rizzBufferSource = null;
  }
  console.log('Rizz audio stopped');
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
  
  // Reset all flags
  rizzPlaying = false;
  gameMusicPlaying = false;
  mourningStartingOrPlaying = false;
  
  // Stop rizz (Web Audio API)
  if (rizzBufferSource) {
    try { rizzBufferSource.stop(); } catch {}
    rizzBufferSource.disconnect();
    rizzBufferSource = null;
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
  
  if (gameMusicAudio) {
    gameMusicAudio.src = '';
    gameMusicAudio = null;
  }
  
  if (mourningAudio) {
    mourningAudio.src = '';
    mourningAudio = null;
  }
  
  // Close AudioContext
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
};

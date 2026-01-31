// Centralized Audio Manager - handles all 3 music tracks
// Music 1: Rizz scene only (rizz.mp4)
// Music 2: Gameplay - from "Tap to start" until hospital button (background.mp3)
// Music 3: Mourning - from hospital button through end screen + leaked video (mourning.mp3)

// Module-level singletons (persist across route navigations)
let rizzAudio: HTMLAudioElement | null = null;
let gameMusicAudio: HTMLAudioElement | null = null;
let mourningAudio: HTMLAudioElement | null = null;

// Synchronous flags to prevent overlap
let mourningStartingOrPlaying = false;
let gameMusicPlaying = false;
let rizzPlaying = false;

// Preload flags
let rizzPreloaded = false;
let gameMusicPreloaded = false;
let mourningPreloaded = false;

// ============ PRELOAD ALL AUDIO ============
// Call this early (e.g., on WelcomeScreen mount) to ensure audio is ready
// NOTE: We do NOT preload Rizz audio - it must be created fresh in user gesture context
export const preloadAllAudio = () => {
  // Skip Rizz preload - it MUST be created synchronously in click handler
  // to preserve user gesture context for mobile browsers
  rizzPreloaded = true; // Mark as "ready" since we'll create it on demand
  console.log('Rizz audio will be created on demand (user gesture required)');
  
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

// ============ MUSIC 1: RIZZ ============
export const playRizz = () => {
  if (rizzPlaying) return;
  
  // CRITICAL: Always create a FRESH Audio element synchronously in user gesture context
  // This ensures mobile browsers recognize the user interaction and allow playback
  // Do NOT reuse preloaded audio - it loses user gesture context
  
  // Stop and clear any existing audio first
  if (rizzAudio) {
    rizzAudio.pause();
    rizzAudio.src = '';
    rizzAudio = null;
  }
  
  // Create NEW audio element right now (synchronous, in user gesture)
  rizzAudio = new Audio('/music/rizz.mp4');
  rizzAudio.volume = 0.5;
  rizzAudio.loop = true;
  
  // Set flag before play attempt
  rizzPlaying = true;
  
  // Add onended handler as fallback for browsers that don't respect loop
  rizzAudio.onended = () => {
    if (rizzPlaying && rizzAudio) {
      rizzAudio.currentTime = 0;
      rizzAudio.play().catch(() => {});
    }
  };
  
  // Add canplaythrough listener as safety net
  rizzAudio.addEventListener('canplaythrough', () => {
    if (rizzPlaying && rizzAudio && rizzAudio.paused) {
      rizzAudio.play().catch(() => {});
    }
  }, { once: true });
  
  // Play immediately - this is still in user gesture context
  const playPromise = rizzAudio.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log('Rizz audio playing successfully');
      })
      .catch((e) => {
        console.error('Rizz play failed:', e);
        rizzPlaying = false;
      });
  }
};

export const stopRizz = () => {
  rizzPlaying = false;
  if (rizzAudio) {
    rizzAudio.pause();
    rizzAudio.currentTime = 0;
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
  
  // Stop all audio
  if (rizzAudio) {
    rizzAudio.pause();
    rizzAudio.currentTime = 0;
  }
  
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
  
  if (rizzAudio) {
    rizzAudio.src = '';
    rizzAudio = null;
  }
  
  if (gameMusicAudio) {
    gameMusicAudio.src = '';
    gameMusicAudio = null;
  }
  
  if (mourningAudio) {
    mourningAudio.src = '';
    mourningAudio = null;
  }
};

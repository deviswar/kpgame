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

// ============ MUSIC 1: RIZZ ============
export const playRizz = () => {
  if (rizzPlaying) return;
  
  try {
    if (!rizzAudio) {
      rizzAudio = new Audio('/music/rizz.mp4');
      rizzAudio.volume = 0.5;
      rizzAudio.loop = true;
      rizzAudio.preload = 'auto';
    }
    
    rizzAudio.currentTime = 0;
    rizzPlaying = true;
    
    rizzAudio.play().catch((e) => {
      console.error('Rizz audio failed:', e);
      rizzPlaying = false;
    });
  } catch (e) {
    console.error('Rizz audio error:', e);
    rizzPlaying = false;
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
    if (!gameMusicAudio) {
      gameMusicAudio = new Audio('/music/background.mp3');
      gameMusicAudio.volume = 0.5;
      gameMusicAudio.loop = true;
      gameMusicAudio.preload = 'auto';
    }
    
    gameMusicAudio.currentTime = 0;
    gameMusicPlaying = true;
    
    gameMusicAudio.play().catch((e) => {
      console.error('Game music failed:', e);
      // Retry once
      setTimeout(() => {
        if (gameMusicPlaying && !mourningStartingOrPlaying && gameMusicAudio) {
          gameMusicAudio.play().catch(() => {});
        }
      }, 200);
    });
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
    if (!mourningAudio) {
      mourningAudio = new Audio('/music/mourning.mp3');
      mourningAudio.volume = 0.5;
      mourningAudio.loop = true;
      mourningAudio.preload = 'auto';
    }
    
    mourningAudio.currentTime = 0;
    
    mourningAudio.play().catch((e) => {
      console.error('Mourning music failed:', e);
      // Retry once
      setTimeout(() => {
        if (mourningStartingOrPlaying && mourningAudio) {
          mourningAudio.play().catch(() => {});
        }
      }, 200);
    });
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

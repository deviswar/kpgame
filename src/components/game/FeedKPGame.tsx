import { useState, useCallback, useRef, useEffect } from 'react';
import HappinessMeter from './HappinessMeter';
import KPCharacter from './KPCharacter';
import DenguluFood from './DenguluFood';
import AirplaneAnimation from './AirplaneAnimation';
import WelcomeScreen from './WelcomeScreen';
import CowFightScreen from './CowFightScreen';
import MilkHospitalScreen from './MilkHospitalScreen';

const FeedKPGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [happiness, setHappiness] = useState(0);
  const [isHappy, setIsHappy] = useState(false);
  const [feedCount, setFeedCount] = useState(0);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [showCowFight, setShowCowFight] = useState(false);
  const [showMilkHospital, setShowMilkHospital] = useState(false);
  const [showAirplane, setShowAirplane] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mourningAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioInitialized = useRef(false);
  const maxHappiness = 100;
  const happinessPerFeed = 20; // 5 feeds = 100%

  // Initialize audio - recreate fresh on every mount
  useEffect(() => {
    // Always create fresh audio instance
    const audio = new Audio('/music/background.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'auto';
    
    audioRef.current = audio;
    audioInitialized.current = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
        audioInitialized.current = false;
      }
    };
  }, []);

  // Keep audio playing when game is active (but NOT when mourning music is playing)
  useEffect(() => {
    if (gameStarted && audioRef.current && !showMilkHospital && !showAirplane) {
      const checkAudio = setInterval(() => {
        // Only keep Music 1 playing if mourning music is NOT playing
        if (audioRef.current && audioRef.current.paused && !mourningAudioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }, 1000);

      return () => clearInterval(checkAudio);
    }
  }, [gameStarted, showMilkHospital, showAirplane]);

  const handleStartGame = () => {
    setGameStarted(true);
    
    // Play audio with retry logic
    const playAudio = (attempts = 0) => {
      if (!audioRef.current || attempts > 3) return;
      
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => {
          console.log('Audio playing successfully');
        })
        .catch((error) => {
          console.error('Audio play failed, attempt:', attempts + 1, error);
          // Retry after a short delay
          setTimeout(() => playAudio(attempts + 1), 200);
        });
    };
    
    playAudio();
  };
  const handleFeed = useCallback(() => {
    if (happiness >= maxHappiness || showAirplane) return;
    const newHappiness = Math.min(happiness + happinessPerFeed, maxHappiness);
    setHappiness(newHappiness);

    // Trigger happy animation
    setIsHappy(true);
    setTimeout(() => setIsHappy(false), 100);

    // Show +20 indicator
    setShowPlusOne(true);
    setTimeout(() => setShowPlusOne(false), 500);

    // Increment feed count
    setFeedCount(prev => prev + 1);

    // Check for 100% happiness - go to cow fight first
    if (newHappiness >= maxHappiness) {
      setTimeout(() => setShowCowFight(true), 800);
    }
  }, [happiness, showAirplane]);
  // Callback to start mourning music - passed to MilkHospitalScreen
  const handleStartMourningMusic = useCallback(() => {
    console.log('Starting mourning music (Music 2)');
    
    // Stop Music 1 completely
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      console.log('Music 1 stopped');
    }
    
    // Start Music 2 and keep it playing
    const mourningAudio = new Audio('/music/mourning.mp3');
    mourningAudio.volume = 0.5;
    mourningAudio.loop = true;
    mourningAudio.preload = 'auto';
    
    mourningAudio.play()
      .then(() => {
        console.log('Music 2 playing successfully');
        mourningAudioRef.current = mourningAudio;
      })
      .catch((error) => {
        console.error('Music 2 play failed:', error);
        // Retry after a short delay
        setTimeout(() => {
          mourningAudio.play()
            .then(() => {
              console.log('Music 2 playing on retry');
              mourningAudioRef.current = mourningAudio;
            })
            .catch((e) => console.error('Music 2 retry failed:', e));
        }, 200);
      });
  }, []);

  const handleGoHome = () => {
    // Stop Music 2 if playing
    if (mourningAudioRef.current) {
      mourningAudioRef.current.pause();
      mourningAudioRef.current = null;
    }
    // Stop Music 1 if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Reset audio initialized flag so it can play again on restart
    audioInitialized.current = false;
    
    // Reset all state and go back to welcome screen
    setHappiness(0);
    setFeedCount(0);
    setShowCowFight(false);
    setShowMilkHospital(false);
    setShowAirplane(false);
    setGameStarted(false);
    
    // Recreate audio for next game
    const audio = new Audio('/music/background.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'auto';
    audioRef.current = audio;
    audioInitialized.current = true;
  };

  const handleCowFightComplete = () => {
    setShowCowFight(false);
    setShowMilkHospital(true);
  };

  const handleMilkHospitalComplete = () => {
    setShowMilkHospital(false);
    setShowAirplane(true);
  };
  const handleReset = () => {
    setHappiness(0);
    setFeedCount(0);
    setShowCowFight(false);
    setShowMilkHospital(false);
    setShowAirplane(false);
  };
  if (!gameStarted) {
    return <WelcomeScreen onStart={handleStartGame} />;
  }

  if (showCowFight) {
    return <CowFightScreen onComplete={handleCowFightComplete} />;
  }

  if (showMilkHospital) {
    return <MilkHospitalScreen onComplete={handleMilkHospitalComplete} onStartMourningMusic={handleStartMourningMusic} />;
  }

  if (showAirplane) {
    return <AirplaneAnimation onComplete={handleGoHome} />;
  }
  return <div className="h-screen h-[100dvh] game-gradient flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-2 flex items-center justify-between gap-2">
        <div className="bg-foreground/10 backdrop-blur-sm rounded-xl px-3 py-1 border border-primary-foreground/20">
          <span className="text-primary-foreground/70 text-xs">Feeds:</span>
          <span className="text-primary-foreground font-bold text-base ml-1">{feedCount}/5</span>
        </div>
        
        <h1 className="text-xl md:text-2xl font-bold text-primary-foreground text-shadow-game tracking-wider text-center">
          <span className="hidden sm:inline">🍚 </span>FEED KP<span className="hidden sm:inline"> 🍚</span>
        </h1>
        
        <button onClick={handleReset} className="bg-foreground/10 backdrop-blur-sm rounded-xl px-3 py-1 border border-primary-foreground/20 text-primary-foreground hover:bg-foreground/20 transition-colors text-sm">
          🔄 <span className="hidden sm:inline">Reset</span>
        </button>
      </header>

      {/* Game Area */}
      <main className="flex-1 flex items-start justify-center px-4 pt-2">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center md:justify-between gap-1 md:gap-8">
          
          {/* Left Side - KP */}
          <div className="flex flex-col items-center order-1 md:order-1">
            {/* Name Badge */}
            <div className="mb-1 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-1 rounded-xl border-4 border-blue-400/50 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-shadow-game tracking-widest">
                KP
              </h2>
            </div>
            
            {/* Happiness Meter */}
            <div className="mb-1 relative w-full max-w-[150px] md:max-w-[180px]">
              <HappinessMeter value={happiness} maxValue={maxHappiness} />
              
              {/* +20 indicator */}
              {showPlusOne && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-happiness text-lg md:text-xl font-bold animate-fade-in whitespace-nowrap">
                  +20% 😊
                </div>}
            </div>
            
            {/* Character Platform */}
            <div className="relative">
              {/* Shadow/Platform */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-foreground/20 rounded-[50%] blur-sm" style={{
              width: 60,
              height: 10
            }} />
              
              {/* Character */}
              <KPCharacter scale={0.9} isHappy={isHappy} happiness={happiness} />
            </div>
          </div>

          {/* Arrow - Right of KP on desktop */}
          <div className="hidden md:flex flex-col items-center gap-2 text-primary-foreground/60 order-2">
            <span className="text-2xl">➡️</span>
          </div>

          {/* Right Side - Dengulu */}
          <div className="flex flex-col items-center justify-center order-3 mt-4 md:mt-0">
            <DenguluFood onFeed={handleFeed} disabled={happiness >= maxHappiness} />
          </div>
        </div>
      </main>
    </div>;
};
export default FeedKPGame;
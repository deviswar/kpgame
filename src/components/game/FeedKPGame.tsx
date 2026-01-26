import { useState, useCallback, useEffect, useRef } from 'react';
import HappinessMeter from './HappinessMeter';
import KPCharacter from './KPCharacter';
import DenguluFood from './DenguluFood';
import AirplaneAnimation from './AirplaneAnimation';

const FeedKPGame = () => {
  const [happiness, setHappiness] = useState(0);
  const [isHappy, setIsHappy] = useState(false);
  const [feedCount, setFeedCount] = useState(0);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [showAirplane, setShowAirplane] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const maxHappiness = 100;
  const happinessPerFeed = 20; // 5 feeds = 100%

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/music/background.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play music on first interaction
  useEffect(() => {
    const startMusic = () => {
      if (!musicStarted && audioRef.current) {
        audioRef.current.play().catch(console.error);
        setMusicStarted(true);
      }
    };

    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('touchstart', startMusic, { once: true });

    return () => {
      document.removeEventListener('click', startMusic);
      document.removeEventListener('touchstart', startMusic);
    };
  }, [musicStarted]);

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
    
    // Check for 100% happiness
    if (newHappiness >= maxHappiness) {
      setTimeout(() => setShowAirplane(true), 800);
    }
  }, [happiness, showAirplane]);

  const handleReset = () => {
    setHappiness(0);
    setFeedCount(0);
    setShowAirplane(false);
  };

  if (showAirplane) {
    return <AirplaneAnimation onComplete={handleReset} />;
  }

  return (
    <div className="min-h-screen min-h-[100dvh] game-gradient flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-3 md:p-4 flex items-center justify-between gap-2">
        <div className="bg-foreground/10 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 py-1.5 md:px-4 md:py-2 border border-primary-foreground/20">
          <span className="text-primary-foreground/70 text-xs md:text-sm">Feeds:</span>
          <span className="text-primary-foreground font-bold text-base md:text-xl ml-1 md:ml-2">{feedCount}/5</span>
        </div>
        
        <h1 className="text-xl md:text-3xl font-bold text-primary-foreground text-shadow-game tracking-wider text-center">
          <span className="hidden sm:inline">🍚 </span>FEED KP<span className="hidden sm:inline"> 🍚</span>
        </h1>
        
        <button
          onClick={handleReset}
          className="bg-foreground/10 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 py-1.5 md:px-4 md:py-2 border border-primary-foreground/20 text-primary-foreground hover:bg-foreground/20 transition-colors text-sm md:text-base"
        >
          🔄 <span className="hidden sm:inline">Reset</span>
        </button>
      </header>

      {/* Game Area */}
      <main className="flex-1 flex items-center justify-center px-4 pb-4 md:pb-8">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-8">
          
          {/* Left Side - KP */}
          <div className="flex-1 flex flex-col items-center order-1 md:order-1">
            {/* Name Badge */}
            <div className="mb-2 md:mb-3 bg-gradient-to-r from-blue-500 to-blue-600 px-6 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl border-4 border-blue-400/50 shadow-lg">
              <h2 className="text-2xl md:text-4xl font-bold text-white text-shadow-game tracking-widest">
                KP
              </h2>
            </div>
            
            {/* Happiness Meter */}
            <div className="mb-3 md:mb-4 relative w-full max-w-[160px] md:max-w-[200px]">
              <HappinessMeter value={happiness} maxValue={maxHappiness} />
              
              {/* +20 indicator */}
              {showPlusOne && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-happiness text-xl md:text-2xl font-bold animate-fade-in whitespace-nowrap">
                  +20% 😊
                </div>
              )}
            </div>
            
            {/* Character Platform */}
            <div className="relative">
              {/* Shadow/Platform */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-foreground/20 rounded-[50%] blur-sm"
                style={{
                  width: 70,
                  height: 12,
                }}
              />
              
              {/* Character */}
              <KPCharacter 
                scale={1} 
                isHappy={isHappy}
                happiness={happiness}
              />
            </div>
          </div>

          {/* Arrow - Right of KP on desktop, between on mobile */}
          <div className="hidden md:flex flex-col items-center gap-2 text-primary-foreground/60 order-2">
            <div className="w-0.5 h-12 bg-primary-foreground/20" />
            <span className="text-2xl">➡️</span>
            <div className="w-0.5 h-12 bg-primary-foreground/20" />
          </div>

          {/* Mobile arrow - pointing down */}
          <div className="md:hidden text-primary-foreground/60 text-2xl order-2">
            ⬇️
          </div>

          {/* Right Side - Dengulu */}
          <div className="flex-1 flex flex-col items-center justify-center order-3">
            <DenguluFood onFeed={handleFeed} disabled={happiness >= maxHappiness} />
          </div>
        </div>
      </main>
      
      {/* Footer text */}
      <footer className="pb-4 md:pb-6 text-center px-4">
        <p className="text-white text-sm md:text-base font-medium">
          Give him 100 rupees cash, he will do PhonePe 💸
        </p>
      </footer>
    </div>
  );
};

export default FeedKPGame;

import { useState, useCallback } from 'react';
import HappinessMeter from './HappinessMeter';
import KPCharacter from './KPCharacter';
import DenguluFood from './DenguluFood';
import AirplaneAnimation from './AirplaneAnimation';
import WelcomeScreen from './WelcomeScreen';
import CowFightScreen from './CowFightScreen';
import MilkHospitalScreen from './MilkHospitalScreen';
import { playGameMusic, playMourningMusic, stopAll } from '@/lib/audioManager';
const FeedKPGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [happiness, setHappiness] = useState(0);
  const [isHappy, setIsHappy] = useState(false);
  const [feedCount, setFeedCount] = useState(0);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [showCowFight, setShowCowFight] = useState(false);
  const [showMilkHospital, setShowMilkHospital] = useState(false);
  const [showAirplane, setShowAirplane] = useState(false);
  const maxHappiness = 100;
  const happinessPerFeed = 20; // 5 feeds = 100%

  const handleStartGame = () => {
    setGameStarted(true);
    // Start Music 2 via audio manager
    playGameMusic();
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
  // This IMMEDIATELY stops Music 2 and starts Music 3
  const handleStartMourningMusic = useCallback(() => {
    // Audio manager handles stopping Music 2 and starting Music 3 atomically
    playMourningMusic();
  }, []);
  const handleGoHome = () => {
    // Stop all music via audio manager
    stopAll();

    // Reset all state and go back to welcome screen
    setHappiness(0);
    setFeedCount(0);
    setShowCowFight(false);
    setShowMilkHospital(false);
    setShowAirplane(false);
    setGameStarted(false);
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
              <h2 className="text-2xl md:text-3xl font-bold text-white text-shadow-game tracking-widest">FEED KP</h2>
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

          {/* Speech Bubble with Arrow - Mobile: below KP, Desktop: between KP and Dengulu */}
          <div className="flex flex-col items-center order-2 mt-2 md:mt-0">
            {/* Speech bubble */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border-2 border-amber-400/50 max-w-[140px] md:max-w-[160px]">
              <p className="text-gray-800 text-xs md:text-sm font-medium text-center">
                I love to eat this food! 😋
              </p>
              {/* Arrow pointing right on desktop */}
              <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 w-0 h-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-white/95" />
              {/* Arrow pointing down on mobile */}
              <div className="md:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-white/95" />
            </div>
            {/* Animated pointer arrow */}
            <div className="hidden md:flex items-center gap-1 mt-1 text-amber-400 animate-bounce">
              <span className="text-xl">➡️</span>
            </div>
            <div className="md:hidden flex items-center gap-1 mt-1 text-amber-400 animate-bounce">
              <span className="text-xl">⬇️</span>
            </div>
          </div>

          {/* Right Side - Dengulu */}
          <div className="flex flex-col items-center justify-center order-3 mt-2 md:mt-0">
            <DenguluFood onFeed={handleFeed} disabled={happiness >= maxHappiness} />
          </div>
        </div>
      </main>
    </div>;
};
export default FeedKPGame;
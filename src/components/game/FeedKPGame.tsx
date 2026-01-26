import { useState, useCallback } from 'react';
import HappinessMeter from './HappinessMeter';
import KPCharacter from './KPCharacter';
import DenguluFood from './DenguluFood';
import AirplaneAnimation from './AirplaneAnimation';

const FeedKPGame = () => {
  const [happiness, setHappiness] = useState(0);
  const [scale, setScale] = useState(1);
  const [isHappy, setIsHappy] = useState(false);
  const [feedCount, setFeedCount] = useState(0);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [showAirplane, setShowAirplane] = useState(false);

  const maxHappiness = 100;
  const maxScale = 1.5;
  const happinessPerFeed = 20; // 5 feeds = 100%

  const handleFeed = useCallback(() => {
    if (happiness >= maxHappiness || showAirplane) return;
    
    const newHappiness = Math.min(happiness + happinessPerFeed, maxHappiness);
    setHappiness(newHappiness);
    
    // Increase scale
    setScale(prev => Math.min(prev + 0.1, maxScale));
    
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
    setScale(1);
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
                className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-foreground/20 rounded-[50%] blur-sm transition-all duration-300"
                style={{
                  width: 70 * scale,
                  height: 12,
                }}
              />
              
              {/* Character */}
              <KPCharacter 
                scale={scale} 
                isHappy={isHappy}
                happiness={happiness}
              />
            </div>
            
            {/* Size indicator */}
            <div className="mt-2 md:mt-3 text-primary-foreground/70 text-xs md:text-sm">
              Size: {Math.round(scale * 100)}%
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
    </div>
  );
};

export default FeedKPGame;

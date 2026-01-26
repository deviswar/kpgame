import { useState, useCallback } from 'react';
import HappinessMeter from './HappinessMeter';
import KPCharacter from './KPCharacter';
import DenguluFood from './DenguluFood';

const FeedKPGame = () => {
  const [happiness, setHappiness] = useState(20);
  const [scale, setScale] = useState(1);
  const [isHappy, setIsHappy] = useState(false);
  const [feedCount, setFeedCount] = useState(0);
  const [showPlusOne, setShowPlusOne] = useState(false);

  const maxHappiness = 100;
  const maxScale = 2;

  const handleFeed = useCallback(() => {
    // Increase happiness
    setHappiness(prev => Math.min(prev + 10, maxHappiness));
    
    // Increase scale slightly
    setScale(prev => Math.min(prev + 0.05, maxScale));
    
    // Trigger happy animation
    setIsHappy(true);
    setTimeout(() => setIsHappy(false), 100);
    
    // Show +1 indicator
    setShowPlusOne(true);
    setTimeout(() => setShowPlusOne(false), 500);
    
    // Increment feed count
    setFeedCount(prev => prev + 1);
  }, []);

  const handleReset = () => {
    setHappiness(20);
    setScale(1);
    setFeedCount(0);
  };

  return (
    <div className="min-h-screen game-gradient flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="bg-foreground/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-primary-foreground/20">
          <span className="text-primary-foreground/70 text-sm">Feeds:</span>
          <span className="text-primary-foreground font-bold text-xl ml-2">{feedCount}</span>
        </div>
        
        <h1 className="text-3xl font-bold text-primary-foreground text-shadow-game tracking-wider">
          🍚 FEED KP 🍚
        </h1>
        
        <button
          onClick={handleReset}
          className="bg-foreground/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-primary-foreground/20 text-primary-foreground hover:bg-foreground/20 transition-colors"
        >
          🔄 Reset
        </button>
      </header>

      {/* Game Area */}
      <main className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-4xl flex items-center justify-between gap-8">
          
          {/* Left Side - KP */}
          <div className="flex-1 flex flex-col items-center">
            {/* Name Badge */}
            <div className="mb-4 bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 rounded-2xl border-4 border-blue-400/50 shadow-lg">
              <h2 className="text-4xl font-bold text-white text-shadow-game tracking-widest">
                KP
              </h2>
            </div>
            
            {/* Happiness Meter */}
            <div className="mb-6 relative">
              <HappinessMeter value={happiness} maxValue={maxHappiness} />
              
              {/* +1 indicator */}
              {showPlusOne && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-happiness text-2xl font-bold animate-fade-in">
                  +10 😊
                </div>
              )}
            </div>
            
            {/* Character Platform */}
            <div className="relative">
              {/* Shadow/Platform */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-foreground/20 rounded-[50%] blur-sm"
                style={{
                  width: 120 * scale * 0.9,
                  height: 20,
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
            <div className="mt-4 text-primary-foreground/70 text-sm">
              Size: {Math.round(scale * 100)}%
            </div>
          </div>

          {/* Center divider with animation */}
          <div className="hidden md:flex flex-col items-center gap-2 text-primary-foreground/40">
            <div className="w-0.5 h-20 bg-primary-foreground/20" />
            <span className="text-2xl">➡️</span>
            <div className="w-0.5 h-20 bg-primary-foreground/20" />
          </div>

          {/* Right Side - Dengulu */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <DenguluFood onFeed={handleFeed} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-primary-foreground/50 text-sm">
        Keep feeding KP to make him happy and grow! 🎮
      </footer>
    </div>
  );
};

export default FeedKPGame;

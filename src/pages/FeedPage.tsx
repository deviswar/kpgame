import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import HappinessMeter from '@/components/game/HappinessMeter';
import KPCharacter from '@/components/game/KPCharacter';
import DenguluFood from '@/components/game/DenguluFood';

const FeedPage = () => {
  const navigate = useNavigate();
  const [happiness, setHappiness] = useState(0);
  const [isHappy, setIsHappy] = useState(false);
  const [feedCount, setFeedCount] = useState(0);
  const [showPlusOne, setShowPlusOne] = useState(false);
  
  const maxHappiness = 100;
  const happinessPerFeed = 20;

  const handleFeed = useCallback(() => {
    if (happiness >= maxHappiness) return;
    const newHappiness = Math.min(happiness + happinessPerFeed, maxHappiness);
    setHappiness(newHappiness);

    setIsHappy(true);
    setTimeout(() => setIsHappy(false), 100);

    setShowPlusOne(true);
    setTimeout(() => setShowPlusOne(false), 500);

    setFeedCount(prev => prev + 1);

    if (newHappiness >= maxHappiness) {
      setTimeout(() => navigate('/cow-fight'), 800);
    }
  }, [happiness, navigate]);

  const handleReset = () => {
    setHappiness(0);
    setFeedCount(0);
  };

  return (
    <div className="h-screen h-[100dvh] game-gradient flex flex-col overflow-hidden">
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
              
              {showPlusOne && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-happiness text-lg md:text-xl font-bold animate-fade-in whitespace-nowrap">
                  +20% 😊
                </div>
              )}
            </div>
            
            {/* Character Platform */}
            <div className="relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-foreground/20 rounded-[50%] blur-sm" style={{
                width: 60,
                height: 10
              }} />
              <KPCharacter scale={0.9} isHappy={isHappy} happiness={happiness} />
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center gap-2 text-primary-foreground/60 order-2">
            <span className="text-2xl">➡️</span>
          </div>

          {/* Right Side - Dengulu */}
          <div className="flex flex-col items-center justify-center order-3 mt-4 md:mt-0">
            <DenguluFood onFeed={handleFeed} disabled={happiness >= maxHappiness} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeedPage;

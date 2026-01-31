import { useState, useCallback, useRef, useEffect } from 'react';
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
  
  // Track timers for cleanup
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const handleFeed = useCallback(() => {
    if (happiness >= maxHappiness) return;
    
    try {
      const newHappiness = Math.min(happiness + happinessPerFeed, maxHappiness);
      setHappiness(newHappiness);
      setIsHappy(true);
      
      const happyTimer = setTimeout(() => setIsHappy(false), 100);
      timersRef.current.push(happyTimer);
      
      setShowPlusOne(true);
      const plusOneTimer = setTimeout(() => setShowPlusOne(false), 500);
      timersRef.current.push(plusOneTimer);
      
      setFeedCount(prev => prev + 1);
      
      if (newHappiness >= maxHappiness) {
        const navTimer = setTimeout(() => {
          try {
            navigate('/cow-fight');
          } catch (e) {
            console.error('Navigation failed:', e);
            // Fallback - hard reload to home
            window.location.href = '/';
          }
        }, 800);
        timersRef.current.push(navTimer);
      }
    } catch (e) {
      console.error('Feed error:', e);
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
                FEED KP
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
    </div>
  );
};

export default FeedPage;

import { useState, useEffect, useCallback } from 'react';
import KPCharacter from './KPCharacter';
import BoxingCow from './BoxingCow';
import hondaAmazeImg from '@/assets/honda-amaze.jpg';
import cementBagsImg from '@/assets/cement-bags.jpg';

interface CowFightScreenProps {
  onComplete: () => void;
}

const CowFightScreen = ({ onComplete }: CowFightScreenProps) => {
  const [gameState, setGameState] = useState<'loading' | 'entrance' | 'ready' | 'fighting' | 'ko'>('loading');
  const [charactersEntered, setCharactersEntered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [health, setHealth] = useState(3);
  const [isPunching, setIsPunching] = useState(false);
  const [isKPHit, setIsKPHit] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [hitFlash, setHitFlash] = useState(false);
  const [cowVictory, setCowVictory] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [brokenHearts, setBrokenHearts] = useState<number[]>([]);

  // Stage timing
  useEffect(() => {
    // After 3 seconds, characters enter
    const entranceTimer = setTimeout(() => {
      setGameState('entrance');
      setCharactersEntered(true);
      
      // After entrance animation (1s), show popup
      setTimeout(() => {
        setGameState('ready');
        setShowPopup(true);
      }, 1200);
    }, 3000);

    return () => clearTimeout(entranceTimer);
  }, []);

  const handlePunch = useCallback(() => {
    if (gameState !== 'ready' && gameState !== 'fighting') return;
    if (isPunching || health <= 0) return;

    setGameState('fighting');
    setShowPopup(false);
    
    // Start punch animation
    setIsPunching(true);
    
    // Impact after 300ms (when punch lands)
    setTimeout(() => {
      setIsKPHit(true);
      setScreenShake(true);
      setHitFlash(true);
      setShowStars(true);
      
      // Reduce health
      const newHealth = health - 1;
      setHealth(newHealth);
      setBrokenHearts(prev => [...prev, 3 - newHealth]);
      
      // Clear effects
      setTimeout(() => {
        setScreenShake(false);
        setHitFlash(false);
      }, 300);
      
      // Only clear hit effects if NOT a KO
      if (newHealth > 0) {
        setTimeout(() => {
          setIsKPHit(false);
          setShowStars(false);
        }, 600);
      }
      
      // Check for KO
      if (newHealth <= 0) {
        // Keep KP crying and cow angry for 3 seconds
        setIsKPHit(true);
        setShowStars(true);
        
        setTimeout(() => {
          setGameState('ko');
          // Don't set cowVictory - keep cow in angry state
          
          // Show cow angry + KP crying for 3 seconds before end screen
          setTimeout(() => {
            onComplete();
          }, 3000);
        }, 500);
      }
    }, 300);
    
    // End punch animation
    setTimeout(() => {
      setIsPunching(false);
      if (health > 1) {
        setShowPopup(true);
        setGameState('ready');
      }
    }, 600);
  }, [gameState, isPunching, health, onComplete]);

  return (
    <div 
      className={`h-screen h-[100dvh] relative overflow-hidden ${screenShake ? 'animate-screen-shake' : ''}`}
      style={{
        background: 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 30%, #1a1a2e 100%)',
      }}
    >
      {/* Arena spotlights effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-32 h-64 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.8) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute top-0 right-1/4 w-32 h-64 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.8) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-80 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(255,200,100,0.6) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Background images - positioned at top */}
      <div className="absolute top-20 left-0 right-0 flex justify-between px-4 z-10">
        {/* Cement bags on the left */}
        <div 
          className="w-32 h-32 md:w-48 md:h-48 opacity-70"
          style={{
            backgroundImage: `url(${cementBagsImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Honda Amaze on the right */}
        <div 
          className="w-32 h-32 md:w-48 md:h-48 opacity-70"
          style={{
            backgroundImage: `url(${hondaAmazeImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      {/* Arena floor */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: 'linear-gradient(180deg, rgba(50,30,70,0.8) 0%, rgba(30,20,50,0.9) 100%)',
        }}
      />

      {/* Health bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {[1, 2, 3].map((heart) => (
          <div 
            key={heart}
            className={`text-3xl transition-all duration-300 ${
              brokenHearts.includes(heart) ? 'animate-heart-break opacity-0 scale-0' : ''
            }`}
          >
            {brokenHearts.includes(heart) ? '💔' : '❤️'}
          </div>
        ))}
      </div>

      {/* VS text */}
      {charactersEntered && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20">
          <h1 
            className="text-4xl md:text-6xl font-bold text-yellow-400 animate-pulse"
            style={{
              textShadow: '0 0 20px rgba(255,200,0,0.8), 0 0 40px rgba(255,200,0,0.4)',
            }}
          >
            VS
          </h1>
        </div>
      )}

      {/* Touch popup - centered in the middle of screen */}
      {showPopup && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-bounce">
          <div 
            className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border-4 border-yellow-400"
          >
            <p className="text-lg md:text-xl font-bold text-gray-800 whitespace-nowrap">
              Touch KP to punch! 🥊
            </p>
          </div>
        </div>
      )}

      {/* Hit flash overlay */}
      {hitFlash && (
        <div className="absolute inset-0 bg-red-500/30 z-40 animate-hit-flash pointer-events-none" />
      )}

      {/* Characters container */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-between items-end px-4 md:px-12">
        {/* Boxing Cow - left side */}
        <div 
          className={`transition-all duration-1000 ease-out ${
            charactersEntered 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-[100vw] opacity-0'
          }`}
          style={{
            transform: charactersEntered ? 'translateX(0) rotate(0)' : 'translateX(-100vw) rotate(-10deg)',
          }}
        >
          <BoxingCow 
            scale={1.1} 
            isPunching={isPunching} 
            isVictory={cowVictory} 
          />
          <div className="text-center mt-2">
            <span 
              className="bg-red-600 text-white px-2 py-1 rounded-lg font-bold text-sm md:text-base"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              CAR SCRATCHING COW
            </span>
          </div>
        </div>

        {/* KP - right side */}
        <div 
          className={`transition-all duration-1000 ease-out cursor-pointer ${
            charactersEntered 
              ? 'translate-x-0 opacity-100' 
              : 'translate-x-[100vw] opacity-0'
          } ${isKPHit ? 'animate-kp-hit' : ''}`}
          onClick={handlePunch}
          style={{
            transform: charactersEntered 
              ? `translateX(0) ${isKPHit ? 'translateX(20px)' : ''}` 
              : 'translateX(100vw)',
          }}
        >
          {/* Stars when hit */}
          {showStars && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 animate-stars-spin">
              <span className="text-xl">⭐</span>
              <span className="text-xl">💫</span>
              <span className="text-xl">⭐</span>
            </div>
          )}
          
          <KPCharacter 
            scale={1} 
            isHappy={false} 
            happiness={isKPHit ? 0 : 50}
            isCrying={isKPHit}
          />
          
          <div className="text-center mt-2">
            <span 
              className="bg-blue-600 text-white px-4 py-1 rounded-lg font-bold text-lg"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              KP
            </span>
          </div>
        </div>
      </div>

      {/* KO text */}
      {gameState === 'ko' && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div 
            className="text-6xl md:text-8xl font-bold text-red-500 animate-scale-in"
            style={{
              textShadow: '0 0 30px rgba(255,0,0,0.8), 0 0 60px rgba(255,0,0,0.4)',
            }}
          >
            K.O.!
          </div>
        </div>
      )}

      {/* Ground dust particles during entrance */}
      {gameState === 'entrance' && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-between px-8 pointer-events-none">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="w-2 h-2 bg-yellow-200/50 rounded-full animate-ping"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="w-2 h-2 bg-yellow-200/50 rounded-full animate-ping"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CowFightScreen;

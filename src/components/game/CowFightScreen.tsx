import { useState, useEffect, useCallback, useRef } from 'react';
import KPCharacter from './KPCharacter';
import BoxingCow, { PunchPhase } from './BoxingCow';
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
  
  // Pro animation states
  const [punchPhase, setPunchPhase] = useState<PunchPhase>('idle');
  const [cowPosition, setCowPosition] = useState(0); // 0 = start, percentage toward KP
  const [showImpactBurst, setShowImpactBurst] = useState(false);
  const [showDustTrail, setShowDustTrail] = useState(false);
  
  // Responsive rush distance - less on mobile
  const getRushDistance = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return 35; // Mobile: 35vw
    }
    return 55; // Desktop: 55vw
  };
  
  const healthRef = useRef(health);
  healthRef.current = health;

  // Stage timing
  useEffect(() => {
    // After 1 second, characters enter
    const entranceTimer = setTimeout(() => {
      setGameState('entrance');
      setCharactersEntered(true);
      
      // After entrance animation (1s), show popup
      setTimeout(() => {
        setGameState('ready');
        setShowPopup(true);
      }, 1200);
    }, 1000);

    return () => clearTimeout(entranceTimer);
  }, []);

  const handlePunch = useCallback(() => {
    if (gameState !== 'ready' && gameState !== 'fighting') return;
    if (isPunching || healthRef.current <= 0) return;

    setGameState('fighting');
    setShowPopup(false);
    setIsPunching(true);
    
    // ============ PHASE 1: WIND-UP (0-150ms) ============
    setPunchPhase('windup');
    
    // ============ PHASE 2: RUSH FORWARD (150-450ms) ============
    setTimeout(() => {
      setPunchPhase('rushing');
      setCowPosition(getRushDistance()); // Responsive rush distance
      setShowDustTrail(true);
    }, 150);
    
    // ============ PHASE 3: ARM RAISES (450-550ms) ============
    setTimeout(() => {
      setPunchPhase('arm-raise');
      setShowDustTrail(false);
    }, 450);
    
    // ============ PHASE 4: STRIKE! (550-700ms) ============
    setTimeout(() => {
      setPunchPhase('strike');
      setShowImpactBurst(true);
      
      // Trigger all impact effects
      setIsKPHit(true);
      setScreenShake(true);
      setHitFlash(true);
      setShowStars(true);
      
      // Reduce health
      const newHealth = healthRef.current - 1;
      setHealth(newHealth);
      setBrokenHearts(prev => [...prev, 3 - newHealth]);
      
      // Clear impact effects
      setTimeout(() => {
        setScreenShake(false);
        setHitFlash(false);
        setShowImpactBurst(false);
      }, 200);
      
      // Only clear hit effects if NOT a KO
      if (newHealth > 0) {
        setTimeout(() => {
          setIsKPHit(false);
          setShowStars(false);
        }, 500);
      }
      
      // Check for KO
      if (newHealth <= 0) {
        // Keep KP crying and cow angry for 3 seconds
        setIsKPHit(true);
        setShowStars(true);
        
        setTimeout(() => {
          setGameState('ko');
          setCowVictory(true);
          
          // Show cow victory + KP crying for 3 seconds before end screen
          setTimeout(() => {
            onComplete();
          }, 3000);
        }, 500);
      }
    }, 550);
    
    // ============ PHASE 5: RECOVERY (700-1200ms) ============
    setTimeout(() => {
      setPunchPhase('recovery');
      setCowPosition(0); // Retreat back
    }, 700);
    
    // Reset to idle
    setTimeout(() => {
      setPunchPhase('idle');
      setIsPunching(false);
      
      if (healthRef.current > 0) {
        setShowPopup(true);
        setGameState('ready');
      }
    }, 1200);
  }, [gameState, isPunching, onComplete]);

  // Physics-based transition timing
  const getCowTransitionStyle = () => {
    if (punchPhase === 'rushing') {
      return {
        transitionDuration: '300ms',
        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Overshoot for aggressive rush
      };
    }
    if (punchPhase === 'recovery') {
      return {
        transitionDuration: '500ms',
        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth ease-out for retreat
      };
    }
    return {
      transitionDuration: '150ms',
      transitionTimingFunction: 'ease-out',
    };
  };

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

      {/* Touch popup - positioned on left side */}
      {showPopup && (
        <div className="absolute top-1/2 left-[15%] -translate-y-1/2 z-30 animate-bounce">
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

      {/* Impact burst at contact point */}
      {showImpactBurst && (
        <div 
          className="absolute z-50 pointer-events-none"
          style={{
            left: '55%',
            bottom: '35%',
          }}
        >
          <div className="relative">
            <span 
              className="text-5xl"
              style={{ 
                animation: 'impact-burst 0.3s ease-out forwards',
                display: 'block',
              }}
            >
              💥
            </span>
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="absolute text-xl"
                style={{
                  animation: 'impact-burst 0.4s ease-out forwards',
                  animationDelay: `${i * 0.05}s`,
                  left: `${Math.cos(i * 60 * Math.PI / 180) * 30}px`,
                  top: `${Math.sin(i * 60 * Math.PI / 180) * 30}px`,
                }}
              >
                ✨
              </span>
            ))}
          </div>
        </div>
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
          {/* Cow rush container with physics-based movement */}
          <div 
            className="transition-transform"
            style={{
              transform: `translateX(${cowPosition}vw)`,
              ...getCowTransitionStyle(),
            }}
          >
            {/* Dust trail behind cow when rushing */}
            {showDustTrail && (
              <div className="absolute -bottom-2 -left-8 flex gap-1 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full bg-yellow-200/40"
                    style={{
                      width: `${12 - i * 2}px`,
                      height: `${12 - i * 2}px`,
                      animation: `dust-puff 0.4s ease-out ${i * 0.05}s forwards`,
                      opacity: 1 - i * 0.15,
                    }}
                  />
                ))}
              </div>
            )}
            
            <BoxingCow 
              scale={1.1} 
              isPunching={isPunching} 
              isVictory={cowVictory}
              punchPhase={punchPhase}
            />
          </div>
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

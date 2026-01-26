import { useEffect, useState } from 'react';

interface AirplaneAnimationProps {
  onComplete: () => void;
}

const AirplaneAnimation = ({ onComplete }: AirplaneAnimationProps) => {
  const [phase, setPhase] = useState<'takeoff' | 'flying' | 'cruising'>('takeoff');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('flying'), 2000);
    const timer2 = setTimeout(() => setPhase('cruising'), 5000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Sky background with gradient */}
      <div 
        className="absolute inset-0 transition-all duration-2000"
        style={{
          background: 'linear-gradient(to bottom, #0a1628 0%, #1e3a5f 30%, #2d5a87 50%, #87ceeb 80%, #b4d7e8 100%)',
        }}
      />
      
      {/* Stars (visible at top) */}
      <div className="absolute top-0 left-0 right-0 h-1/3 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: 2 + Math.random() * 2,
              height: 2 + Math.random() * 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Clouds - more realistic layered clouds */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${-20 + Math.random() * 120}%`,
              top: `${30 + Math.random() * 50}%`,
              animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            {/* Cloud shape made of multiple circles */}
            <div className="relative">
              <div 
                className="absolute rounded-full"
                style={{
                  width: 60 + Math.random() * 80,
                  height: 30 + Math.random() * 20,
                  background: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                }}
              />
              <div 
                className="absolute rounded-full -top-2 left-4"
                style={{
                  width: 40 + Math.random() * 30,
                  height: 25 + Math.random() * 15,
                  background: 'rgba(255,255,255,0.95)',
                }}
              />
              <div 
                className="absolute rounded-full -top-1 right-2"
                style={{
                  width: 30 + Math.random() * 20,
                  height: 20 + Math.random() * 10,
                  background: 'rgba(255,255,255,0.85)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Realistic Airplane */}
      <div 
        className={`absolute transition-all ease-out ${
          phase === 'takeoff' 
            ? 'bottom-20 left-10 rotate-[-15deg] duration-[2000ms]' 
            : phase === 'flying'
            ? 'bottom-1/2 left-1/2 -translate-x-1/2 rotate-[-5deg] duration-[3000ms]'
            : 'bottom-1/2 left-1/2 -translate-x-1/2 rotate-0 duration-[2000ms]'
        }`}
      >
        <div className="relative" style={{ transform: 'scale(1.2)' }}>
          {/* Main fuselage */}
          <div 
            className="relative"
            style={{
              width: 220,
              height: 50,
              background: 'linear-gradient(to bottom, #ffffff 0%, #f0f0f0 40%, #e8e8e8 60%, #d8d8d8 100%)',
              borderRadius: '50% 20% 20% 50%',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.8)',
            }}
          >
            {/* Cockpit windshield */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2"
              style={{
                width: 45,
                height: 35,
                background: 'linear-gradient(135deg, #1e90ff 0%, #4169e1 50%, #0a4d8c 100%)',
                borderRadius: '50% 30% 30% 50%',
                border: '2px solid #333',
                boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.3)',
              }}
            />

            {/* Windows */}
            <div className="absolute top-3 left-14 flex gap-2">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i}
                  className="rounded-sm"
                  style={{
                    width: 8,
                    height: 10,
                    background: 'linear-gradient(to bottom, #87ceeb, #4a90a4)',
                    border: '1px solid #555',
                  }}
                />
              ))}
            </div>

            {/* Airline stripe */}
            <div 
              className="absolute bottom-3 left-12 right-8 h-1.5 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #ff6b35, #f7931e)',
              }}
            />

            {/* Door */}
            <div 
              className="absolute left-16 top-3 bottom-3 w-5 rounded-sm border border-gray-400"
              style={{
                background: 'linear-gradient(to bottom, #e8e8e8, #d0d0d0)',
              }}
            />
          </div>

          {/* Tail section */}
          <div 
            className="absolute -right-4 -top-6"
            style={{
              width: 35,
              height: 45,
              background: 'linear-gradient(to right, #e8e8e8, #ffffff)',
              clipPath: 'polygon(100% 100%, 0% 100%, 30% 0%, 100% 20%)',
              boxShadow: '2px -2px 10px rgba(0,0,0,0.2)',
            }}
          >
            {/* Tail stripe */}
            <div 
              className="absolute bottom-3 left-2 right-1 h-1 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #ff6b35, #f7931e)',
              }}
            />
          </div>

          {/* Horizontal tail */}
          <div 
            className="absolute -right-8 top-1/2 -translate-y-1/2"
            style={{
              width: 50,
              height: 12,
              background: 'linear-gradient(to bottom, #f0f0f0, #d8d8d8)',
              borderRadius: '0 40% 40% 0',
            }}
          />

          {/* Wings */}
          <div 
            className="absolute left-1/3 top-1/2"
            style={{
              width: 100,
              height: 18,
              background: 'linear-gradient(to bottom, #e8e8e8 0%, #c0c0c0 50%, #a8a8a8 100%)',
              borderRadius: '0 60% 60% 0',
              transformOrigin: 'left center',
              transform: 'rotate(3deg)',
              boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
            }}
          >
            {/* Engine */}
            <div 
              className="absolute -bottom-3 left-8 rounded-full"
              style={{
                width: 25,
                height: 14,
                background: 'linear-gradient(to bottom, #666, #444)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              }}
            />
          </div>

          {/* Bottom wing (visible) */}
          <div 
            className="absolute left-1/3 bottom-0"
            style={{
              width: 80,
              height: 12,
              background: 'linear-gradient(to bottom, #d0d0d0, #b0b0b0)',
              borderRadius: '0 50% 50% 0',
              transform: 'rotate(-2deg)',
            }}
          />

          {/* KP in window */}
          <div className="absolute top-3.5 left-20 flex items-center">
            <div 
              className="rounded-full overflow-hidden border border-gray-600"
              style={{
                width: 7,
                height: 9,
                background: '#5a4535',
              }}
            />
          </div>

          {/* KP waving hand */}
          <div className="absolute top-1 left-24 animate-wiggle">
            <span className="text-sm">👋</span>
          </div>

          {/* Contrails */}
          {phase !== 'takeoff' && (
            <>
              <div 
                className="absolute -right-40 top-1/2 -translate-y-1/2 rounded-full animate-pulse"
                style={{
                  width: 150,
                  height: 4,
                  background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.8))',
                }}
              />
              <div 
                className="absolute -right-32 top-2/3 rounded-full animate-pulse"
                style={{
                  width: 120,
                  height: 3,
                  background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.6))',
                  animationDelay: '0.2s',
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Text overlay */}
      <div className="absolute bottom-16 md:bottom-24 left-0 right-0 text-center z-10 px-4">
        {phase === 'takeoff' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold text-white text-shadow-game mb-3">
              🎉 100% HAPPINESS! 🎉
            </h2>
            <p className="text-lg md:text-2xl text-white/90">KP is taking off...</p>
          </div>
        )}
        {(phase === 'flying' || phase === 'cruising') && (
          <div className="animate-fade-in">
            <div className="mb-4 flex justify-center gap-2">
              {/* Dutch flag */}
              <div className="inline-flex flex-col rounded-lg overflow-hidden shadow-lg border border-white/20">
                <div className="w-20 md:w-28 h-3 md:h-4 bg-red-600" />
                <div className="w-20 md:w-28 h-3 md:h-4 bg-white" />
                <div className="w-20 md:w-28 h-3 md:h-4 bg-blue-800" />
              </div>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white text-shadow-game mb-3">
              ✈️ KP is flying to Netherlands! ✈️
            </h2>
            <p className="text-base md:text-xl text-white/90 mb-4">
              Goodbye India, Hello Europe! 🌷
            </p>
            <div className="flex justify-center gap-3 md:gap-4 text-2xl md:text-4xl">
              <span className="animate-bounce">🌷</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🚲</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🧀</span>
              <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>⚽</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🏠</span>
            </div>
          </div>
        )}
      </div>

      {/* Play Again button - appears after a delay */}
      {phase === 'cruising' && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center animate-fade-in">
          <button
            onClick={onComplete}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
          >
            Play Again 🔄
          </button>
        </div>
      )}
    </div>
  );
};

export default AirplaneAnimation;

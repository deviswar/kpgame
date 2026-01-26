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
      <div className="absolute top-0 left-0 right-0 h-1/4 overflow-hidden">
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
      
      {/* Clouds - only at top for readability */}
      <div className="absolute top-0 left-0 right-0 h-1/4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${-10 + Math.random() * 110}%`,
              top: `${20 + Math.random() * 50}%`,
              animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <div className="relative">
              <div 
                className="absolute rounded-full"
                style={{
                  width: 60 + Math.random() * 80,
                  height: 30 + Math.random() * 20,
                  background: 'rgba(255,255,255,0.6)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                }}
              />
              <div 
                className="absolute rounded-full -top-2 left-4"
                style={{
                  width: 40 + Math.random() * 30,
                  height: 25 + Math.random() * 15,
                  background: 'rgba(255,255,255,0.65)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Realistic Commercial Airplane - SVG */}
      <div 
        className={`absolute transition-all ease-out ${
          phase === 'takeoff' 
            ? 'bottom-16 left-8 rotate-[-12deg] duration-[2000ms]' 
            : phase === 'flying'
            ? 'bottom-1/2 left-1/2 -translate-x-1/2 rotate-[-3deg] duration-[3000ms]'
            : 'bottom-1/2 left-1/2 -translate-x-1/2 rotate-0 duration-[2000ms]'
        }`}
      >
        <div className="relative" style={{ transform: 'scale(1.3)' }}>
          <svg width="220" height="90" viewBox="0 0 220 90" className="drop-shadow-2xl">
            {/* Gradients */}
            <defs>
              <linearGradient id="fuselageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#f5f5f5" />
                <stop offset="70%" stopColor="#e8e8e8" />
                <stop offset="100%" stopColor="#d0d0d0" />
              </linearGradient>
              <linearGradient id="noseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d8d8d8" />
                <stop offset="100%" stopColor="#f0f0f0" />
              </linearGradient>
              <linearGradient id="stripeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff6b35" />
                <stop offset="100%" stopColor="#f7931e" />
              </linearGradient>
              <linearGradient id="tailGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e0e0e0" />
              </linearGradient>
              <linearGradient id="wingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e0e0e0" />
                <stop offset="50%" stopColor="#c8c8c8" />
                <stop offset="100%" stopColor="#a8a8a8" />
              </linearGradient>
              <linearGradient id="engineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#555555" />
                <stop offset="50%" stopColor="#3a3a3a" />
                <stop offset="100%" stopColor="#4a4a4a" />
              </linearGradient>
              <linearGradient id="windowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a4a6e" />
                <stop offset="50%" stopColor="#2d6a8e" />
                <stop offset="100%" stopColor="#1a3a5c" />
              </linearGradient>
            </defs>

            {/* Main wing (behind fuselage) */}
            <path d="M 85 50 L 60 85 L 150 85 L 135 50 Z" fill="url(#wingGradient)" />
            
            {/* Engine 1 */}
            <ellipse cx="90" cy="72" rx="10" ry="6" fill="url(#engineGradient)" />
            <ellipse cx="87" cy="72" rx="4" ry="4" fill="#2a2a2a" />
            
            {/* Engine 2 */}
            <ellipse cx="125" cy="72" rx="10" ry="6" fill="url(#engineGradient)" />
            <ellipse cx="122" cy="72" rx="4" ry="4" fill="#2a2a2a" />

            {/* Fuselage body */}
            <ellipse cx="100" cy="42" rx="95" ry="18" fill="url(#fuselageGradient)" />
            
            {/* Nose cone */}
            <ellipse cx="12" cy="42" rx="14" ry="12" fill="url(#noseGradient)" />
            
            {/* Cockpit windows */}
            <path d="M 6 37 Q 14 34 24 37 L 22 40 Q 13 38 8 40 Z" fill="url(#windowGradient)" />
            <path d="M 4 41 Q 12 38 20 41 L 18 44 Q 10 42 6 44 Z" fill="url(#windowGradient)" />
            
            {/* Passenger windows */}
            {[...Array(14)].map((_, i) => (
              <rect key={i} x={38 + i * 10} y="37" width="5" height="7" rx="1.5" fill="url(#windowGradient)" stroke="#888" strokeWidth="0.5" />
            ))}
            
            {/* Airline stripe */}
            <rect x="25" y="50" width="160" height="4" fill="url(#stripeGradient)" rx="2" />
            
            {/* Tail fin */}
            <path d="M 180 42 L 200 8 L 208 8 L 208 42 Z" fill="url(#tailGradient)" stroke="#ccc" strokeWidth="0.5" />
            <rect x="188" y="16" width="16" height="3" fill="url(#stripeGradient)" rx="1" />
            
            {/* Horizontal stabilizer */}
            <ellipse cx="200" cy="42" rx="20" ry="6" fill="url(#wingGradient)" />
            
            {/* Fuselage highlight */}
            <ellipse cx="100" cy="32" rx="80" ry="6" fill="rgba(255,255,255,0.3)" />
          </svg>
          
          {/* Contrails */}
          {phase !== 'takeoff' && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <div 
                className="absolute -right-28 top-0 rounded-full animate-pulse"
                style={{
                  width: 120,
                  height: 4,
                  background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.7))',
                }}
              />
              <div 
                className="absolute -right-24 top-4 rounded-full animate-pulse"
                style={{
                  width: 100,
                  height: 3,
                  background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.5))',
                  animationDelay: '0.15s',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Text overlay */}
      <div className="absolute bottom-20 md:bottom-28 left-0 right-0 text-center z-10 px-4">
        {phase === 'takeoff' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold text-white text-shadow-game mb-3">
              🎉 100% HAPPINESS! 🎉
            </h2>
            <p className="text-lg md:text-2xl text-white/90">KP is taking off...</p>
          </div>
        )}
        {(phase === 'flying' || phase === 'cruising') && (
          <div className="animate-fade-in text-center">
            <div className="mb-3 flex justify-center">
              {/* Dutch flag */}
              <div className="inline-flex flex-col rounded-lg overflow-hidden shadow-lg border border-white/20">
                <div className="w-20 md:w-28 h-3 md:h-4 bg-red-600" />
                <div className="w-20 md:w-28 h-3 md:h-4 bg-white" />
                <div className="w-20 md:w-28 h-3 md:h-4 bg-blue-800" />
              </div>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white text-shadow-game">
              ✈️ KP is flying to Netherlands! ✈️
            </h2>
          </div>
        )}
      </div>

      {/* Play Again button */}
      {phase === 'cruising' && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center animate-fade-in">
          <button
            onClick={onComplete}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
          >
            Play Again 🔄
          </button>
        </div>
      )}
    </div>
  );
};

export default AirplaneAnimation;

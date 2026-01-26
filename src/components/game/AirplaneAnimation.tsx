import { useEffect, useState } from 'react';

interface AirplaneAnimationProps {
  onComplete: () => void;
}

const AirplaneAnimation = ({ onComplete }: AirplaneAnimationProps) => {
  const [phase, setPhase] = useState<'takeoff' | 'flying' | 'arrived'>('takeoff');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('flying'), 1500);
    const timer2 = setTimeout(() => setPhase('arrived'), 4000);
    const timer3 = setTimeout(() => onComplete(), 7000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Sky background */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: phase === 'arrived' 
            ? 'linear-gradient(to bottom, #1e3a5f, #2d5a87, #87ceeb)'
            : 'linear-gradient(to bottom, #1e3a5f, #87ceeb, #f0e68c)',
        }}
      />
      
      {/* Clouds */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/80 rounded-full animate-pulse"
            style={{
              width: 80 + Math.random() * 120,
              height: 40 + Math.random() * 40,
              left: `${Math.random() * 100}%`,
              top: `${20 + Math.random() * 40}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Airplane with KP */}
      <div 
        className={`absolute transition-all ease-in-out ${
          phase === 'takeoff' 
            ? 'bottom-10 left-1/4 rotate-[-20deg] duration-1500' 
            : phase === 'flying'
            ? 'bottom-1/2 left-1/2 -translate-x-1/2 rotate-0 duration-2000'
            : 'bottom-1/2 right-[-200px] rotate-[10deg] duration-2000'
        }`}
      >
        {/* Airplane body */}
        <div className="relative">
          {/* Main fuselage */}
          <div 
            className="relative rounded-full flex items-center justify-center"
            style={{
              width: 180,
              height: 60,
              background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          >
            {/* Windows */}
            <div className="flex gap-3 mb-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    background: 'linear-gradient(to bottom, #87ceeb, #1e90ff)',
                    borderColor: '#666',
                  }}
                />
              ))}
            </div>
            
            {/* Cockpit */}
            <div 
              className="absolute -left-8 top-1/2 -translate-y-1/2 rounded-l-full"
              style={{
                width: 50,
                height: 40,
                background: 'linear-gradient(to bottom, #87ceeb, #1e90ff)',
                border: '3px solid #555',
              }}
            />
            
            {/* Tail */}
            <div 
              className="absolute -right-6 -top-8"
              style={{
                width: 30,
                height: 50,
                background: 'linear-gradient(to right, #e0e0e0, #f5f5f5)',
                clipPath: 'polygon(100% 100%, 0% 100%, 50% 0%)',
              }}
            />
            
            {/* Wing */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 top-1/2"
              style={{
                width: 120,
                height: 20,
                background: 'linear-gradient(to bottom, #d0d0d0, #a0a0a0)',
                borderRadius: '0 50% 50% 0',
              }}
            />
          </div>

          {/* KP in window - waving */}
          <div 
            className="absolute top-1 left-12 flex items-center justify-center"
            style={{ width: 16, height: 16 }}
          >
            <div 
              className="rounded-full"
              style={{
                width: 12,
                height: 12,
                background: '#4a3728',
              }}
            />
          </div>
          
          {/* KP waving hand */}
          <div className="absolute top-0 left-16 animate-wiggle">
            <span className="text-lg">👋</span>
          </div>
        </div>
      </div>

      {/* Text overlay */}
      <div className="absolute bottom-20 left-0 right-0 text-center z-10">
        {phase === 'takeoff' && (
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-shadow-game mb-2">
              🎉 100% HAPPINESS! 🎉
            </h2>
            <p className="text-xl md:text-2xl text-white/90">KP is taking off...</p>
          </div>
        )}
        {phase === 'flying' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-shadow-game mb-2">
              ✈️ Flying to Netherlands! ✈️
            </h2>
            <p className="text-lg md:text-xl text-white/90">Goodbye India, Hello Europe!</p>
          </div>
        )}
        {phase === 'arrived' && (
          <div className="animate-fade-in">
            <div className="mb-4">
              {/* Dutch flag */}
              <div className="inline-flex flex-col rounded-lg overflow-hidden shadow-lg">
                <div className="w-32 h-5 bg-red-600" />
                <div className="w-32 h-5 bg-white" />
                <div className="w-32 h-5 bg-blue-800" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-shadow-game mb-2">
              🇳🇱 Welcome to Netherlands! 🇳🇱
            </h2>
            <p className="text-xl md:text-2xl text-white/90">KP made it! 🌷🧀</p>
            <div className="mt-6 flex justify-center gap-4 text-4xl">
              <span className="animate-bounce">🌷</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🚲</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🧀</span>
              <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>⚽</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🏠</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirplaneAnimation;

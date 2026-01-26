import { useEffect, useState } from 'react';
import KPCharacter from './KPCharacter';

interface AirplaneAnimationProps {
  onComplete: () => void;
}

// Confetti piece component
const ConfettiPiece = ({ delay, left }: { delay: number; left: number }) => {
  const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff85a1', '#a855f7', '#22d3ee'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = 8 + Math.random() * 8;
  const duration = 3 + Math.random() * 2;
  
  return (
    <div
      className="absolute top-0 animate-confetti"
      style={{
        left: `${left}%`,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  );
};

const AirplaneAnimation = ({ onComplete }: AirplaneAnimationProps) => {
  const [phase, setPhase] = useState<'celebrating' | 'flying'>('celebrating');

  useEffect(() => {
    const timer = setTimeout(() => setPhase('flying'), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Generate confetti pieces
  const confettiPieces = [...Array(50)].map((_, i) => ({
    delay: Math.random() * 2,
    left: Math.random() * 100,
  }));

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200">
      
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiPieces.map((piece, i) => (
          <ConfettiPiece key={i} delay={piece.delay} left={piece.left} />
        ))}
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center text-center px-4 z-10">
        
        {/* Airplane and KP waving */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Big moving airplane emoji */}
          <div 
            className={`text-7xl md:text-8xl transition-all duration-1000 ${
              phase === 'celebrating' ? 'scale-100' : 'scale-110 -translate-y-4'
            }`}
            style={{
              animation: 'planeFloat 2s ease-in-out infinite',
            }}
          >
            ✈️
          </div>
          
          {/* KP waving bye */}
          <div className="relative animate-bounce" style={{ animationDuration: '2s' }}>
            <KPCharacter scale={1} isHappy={true} happiness={100} />
            {/* Waving hand */}
            <div className="absolute -top-2 -right-4 text-3xl md:text-4xl animate-wave">
              👋
            </div>
          </div>
        </div>
        
        {/* Netherlands flag and milk glass */}
        <div className="my-4 text-4xl md:text-5xl flex items-center gap-3">
          🇳🇱 🥛
        </div>
        
        {/* Text */}
        <h2 className="text-xl md:text-3xl font-bold text-white text-shadow-game mb-6">
          Bye guys, I'm going to Netherlands!
        </h2>
        
        {/* Go to Home button */}
        <button
          onClick={onComplete}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
        >
          Go to Home 🏠
        </button>
      </div>
    </div>
  );
};

export default AirplaneAnimation;

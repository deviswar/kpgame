import { useEffect, useState } from 'react';

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
        
        {/* Big moving airplane emoji */}
        <div 
          className={`text-8xl md:text-9xl transition-all duration-1000 ${
            phase === 'celebrating' ? 'scale-100' : 'scale-110 -translate-y-4'
          }`}
          style={{
            animation: 'planeFloat 2s ease-in-out infinite',
          }}
        >
          ✈️
        </div>
        
        {/* Netherlands flag and milk glass */}
        <div className="my-6 text-5xl md:text-6xl flex items-center gap-3">
          🇳🇱 🥛
        </div>
        
        {/* Text */}
        <h2 className="text-2xl md:text-4xl font-bold text-white text-shadow-game mb-8">
          Bye guys, I'm going to Netherlands!
        </h2>
        
        {/* Play Again button */}
        <button
          onClick={onComplete}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
        >
          Play Again 🔄
        </button>
      </div>
    </div>
  );
};

export default AirplaneAnimation;

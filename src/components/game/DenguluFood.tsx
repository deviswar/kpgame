import { useState } from 'react';

interface DenguluFoodProps {
  onFeed: () => void;
}

const DenguluFood = ({ onFeed }: DenguluFoodProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState<{ id: number; tx: number; ty: number }[]>([]);

  const handleClick = () => {
    setIsClicked(true);
    
    // Create particles
    const newParticles = [...Array(8)].map((_, i) => ({
      id: Date.now() + i,
      tx: (Math.random() - 0.5) * 100,
      ty: (Math.random() - 0.5) * 100 - 50,
    }));
    setParticles(newParticles);
    
    // Trigger feed
    onFeed();
    
    // Reset animation
    setTimeout(() => {
      setIsClicked(false);
      setParticles([]);
    }, 500);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Food particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-4 h-4 rounded-full food-gradient"
          style={{
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animation: 'particle-burst 0.5s ease-out forwards',
          } as React.CSSProperties}
        />
      ))}
      
      {/* Main food button */}
      <button
        onClick={handleClick}
        className={`relative group transition-all duration-200 ${
          isClicked ? 'scale-90' : 'hover:scale-110 active:scale-95'
        }`}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full food-gradient blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Food container */}
        <div className={`relative w-32 h-32 rounded-full food-gradient border-4 border-accent/50 flex items-center justify-center glow-food ${
          isClicked ? '' : 'animate-float'
        }`}>
          {/* Shine */}
          <div className="absolute top-2 left-4 w-6 h-6 bg-white/40 rounded-full blur-sm" />
          
          {/* Dengulu representation - stylized food */}
          <div className="relative">
            {/* Bowl */}
            <div className="w-20 h-12 bg-gradient-to-b from-orange-300 to-orange-400 rounded-b-full border-2 border-orange-500/50 relative overflow-hidden">
              {/* Food inside */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-amber-600 to-amber-700 rounded-b-full">
                {/* Rice/grain texture */}
                <div className="absolute inset-0 flex flex-wrap justify-center gap-0.5 p-1">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-2 h-1 bg-amber-200/60 rounded-full" />
                  ))}
                </div>
              </div>
              {/* Bowl shine */}
              <div className="absolute left-1 top-1 w-2 h-4 bg-white/30 rounded-full" />
            </div>
            
            {/* Steam */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-1 h-4 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
              <div className="w-1 h-6 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-4 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
        
        {/* Touch indicator */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </button>
      
      {/* Label */}
      <div className="mt-6 text-center">
        <h3 className="text-2xl font-bold text-primary-foreground text-shadow-game">
          DENGULU
        </h3>
        <p className="text-primary-foreground/80 text-sm mt-1 animate-pulse">
          👆 Tap to feed KP!
        </p>
      </div>
    </div>
  );
};

export default DenguluFood;

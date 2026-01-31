import { forwardRef, useState } from 'react';

interface DenguluFoodProps {
  onFeed: () => void;
  disabled?: boolean;
}

const DenguluFood = forwardRef<HTMLDivElement, DenguluFoodProps>(
  ({ onFeed, disabled }, ref) => {
    const [isClicked, setIsClicked] = useState(false);
    const [particles, setParticles] = useState<{ id: number; tx: number; ty: number }[]>([]);

    const handleClick = () => {
      if (disabled) return;
      
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
      <div ref={ref} className="relative flex flex-col items-center">
        {/* Food particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-3 h-3 md:w-4 md:h-4 rounded-full food-gradient"
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
          disabled={disabled}
          className={`relative group transition-all duration-200 ${
            disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : isClicked 
                ? 'scale-90' 
                : 'hover:scale-110 active:scale-95'
          }`}
        >
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-full food-gradient blur-xl transition-opacity ${
            disabled ? 'opacity-30' : 'opacity-60 group-hover:opacity-80'
          }`} />
          
          {/* Food container */}
          <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full food-gradient border-4 border-accent/50 flex items-center justify-center ${
            disabled ? '' : 'glow-food'
          } ${
            isClicked || disabled ? '' : 'animate-float'
          }`}>
            {/* Shine */}
            <div className="absolute top-1.5 md:top-2 left-3 md:left-4 w-4 md:w-6 h-4 md:h-6 bg-white/40 rounded-full blur-sm" />
            
            {/* Dengulu representation - emoji */}
            <span className="text-4xl md:text-5xl">😡🤬</span>
          </div>
          
          {/* Touch indicator */}
          {!disabled && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          )}
        </button>
        
        {/* Label */}
        <div className="mt-4 md:mt-6 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-primary-foreground text-shadow-game">
            DENGULU
          </h3>
          <p className={`text-primary-foreground/80 text-xs md:text-sm mt-1 ${disabled ? '' : 'animate-pulse'}`}>
            {disabled ? '✅ KP is full!' : '👆 Tap to feed KP!'}
          </p>
        </div>
      </div>
    );
  }
);

DenguluFood.displayName = 'DenguluFood';

export default DenguluFood;

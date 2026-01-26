import { useEffect, useState } from 'react';

interface HappinessMeterProps {
  value: number;
  maxValue: number;
}

const HappinessMeter = ({ value, maxValue }: HappinessMeterProps) => {
  const [animate, setAnimate] = useState(false);
  const percentage = Math.min((value / maxValue) * 100, 100);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="w-full max-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-primary-foreground/90 text-sm font-semibold tracking-wide">
          HAPPINESS
        </span>
        <span className="text-primary-foreground font-bold text-lg">
          {Math.round(percentage)}%
        </span>
      </div>
      
      <div className="relative h-6 bg-foreground/20 rounded-full overflow-hidden border-2 border-primary-foreground/30">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute h-full w-[2px] bg-primary-foreground/30"
              style={{ left: `${i * 10}%` }}
            />
          ))}
        </div>
        
        {/* Fill bar */}
        <div
          className={`h-full happiness-gradient rounded-full transition-all duration-300 ease-out relative ${
            animate ? 'animate-meter-fill glow-happiness' : ''
          }`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-full" />
          
          {/* Sparkle at the end */}
          {percentage > 10 && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse-glow" />
          )}
        </div>
      </div>
      
      {/* Level indicator */}
      <div className="flex justify-between mt-1 text-xs text-primary-foreground/60">
        <span>😢</span>
        <span>😊</span>
        <span>😄</span>
        <span>🤩</span>
      </div>
    </div>
  );
};

export default HappinessMeter;

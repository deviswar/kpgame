import { useEffect, useState } from 'react';

interface KPCharacterProps {
  scale: number;
  isHappy: boolean;
  happiness: number;
}

const KPCharacter = ({ scale, isHappy, happiness }: KPCharacterProps) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isHappy) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isHappy, happiness]);

  // Determine expression based on happiness
  const getExpression = () => {
    if (happiness >= 80) return { eyes: '◠', mouth: 'D' }; // Super happy
    if (happiness >= 50) return { eyes: '◠', mouth: ')' }; // Happy
    if (happiness >= 25) return { eyes: '•', mouth: '‿' }; // Content
    return { eyes: '•', mouth: '︵' }; // Sad
  };

  const expression = getExpression();
  const baseSize = 120;
  const size = baseSize * scale;

  return (
    <div 
      className={`relative transition-all duration-300 ease-out character-shadow ${
        animating ? 'animate-happy' : 'animate-bounce-soft'
      }`}
      style={{ 
        '--char-scale': scale,
        width: size,
        height: size * 1.2,
      } as React.CSSProperties}
    >
      {/* Body */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-b from-amber-900 to-amber-950 rounded-t-full"
        style={{
          width: size * 0.7,
          height: size * 0.5,
        }}
      >
        {/* Shirt */}
        <div 
          className="absolute top-2 left-1/2 -translate-x-1/2 bg-gradient-to-b from-blue-500 to-blue-600 rounded-t-lg"
          style={{
            width: size * 0.6,
            height: size * 0.4,
          }}
        />
      </div>

      {/* Head */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-b from-amber-800 to-amber-900 rounded-full border-4 border-amber-950/30"
        style={{
          width: size * 0.8,
          height: size * 0.7,
        }}
      >
        {/* Hair */}
        <div 
          className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-900 rounded-t-full"
          style={{
            width: size * 0.75,
            height: size * 0.25,
          }}
        />
        
        {/* Face container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          {/* Eyes */}
          <div 
            className="flex gap-4 mb-2"
            style={{ fontSize: size * 0.15 }}
          >
            <span className="text-gray-900">{expression.eyes}</span>
            <span className="text-gray-900">{expression.eyes}</span>
          </div>
          
          {/* Cheeks when happy */}
          {happiness >= 50 && (
            <div className="flex gap-6 absolute" style={{ top: '55%' }}>
              <div 
                className="rounded-full bg-rose-400/40"
                style={{ width: size * 0.1, height: size * 0.06 }}
              />
              <div 
                className="rounded-full bg-rose-400/40"
                style={{ width: size * 0.1, height: size * 0.06 }}
              />
            </div>
          )}
          
          {/* Mouth */}
          <div 
            className="text-gray-900 font-bold"
            style={{ fontSize: size * 0.2 }}
          >
            {expression.mouth}
          </div>
        </div>
      </div>

      {/* Arms */}
      <div 
        className={`absolute bg-gradient-to-b from-amber-800 to-amber-900 rounded-full transition-transform ${
          animating ? 'rotate-[-30deg]' : 'rotate-0'
        }`}
        style={{
          width: size * 0.15,
          height: size * 0.35,
          bottom: size * 0.25,
          left: size * 0.05,
          transformOrigin: 'top center',
        }}
      />
      <div 
        className={`absolute bg-gradient-to-b from-amber-800 to-amber-900 rounded-full transition-transform ${
          animating ? 'rotate-[30deg]' : 'rotate-0'
        }`}
        style={{
          width: size * 0.15,
          height: size * 0.35,
          bottom: size * 0.25,
          right: size * 0.05,
          transformOrigin: 'top center',
        }}
      />

      {/* Sparkles when super happy */}
      {happiness >= 80 && (
        <>
          <div className="absolute -top-4 left-0 text-2xl animate-pulse">✨</div>
          <div className="absolute -top-2 right-0 text-xl animate-pulse" style={{ animationDelay: '0.2s' }}>⭐</div>
        </>
      )}
    </div>
  );
};

export default KPCharacter;

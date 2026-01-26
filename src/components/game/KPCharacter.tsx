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
    if (happiness >= 100) return 'ecstatic';
    if (happiness >= 80) return 'super-happy';
    if (happiness >= 60) return 'happy';
    if (happiness >= 40) return 'content';
    return 'neutral';
  };

  const expression = getExpression();
  const baseSize = 100;
  const size = baseSize * scale;

  return (
    <div 
      className={`relative transition-all duration-300 ease-out character-shadow ${
        animating ? 'animate-happy' : 'animate-bounce-soft'
      }`}
      style={{ 
        '--char-scale': scale,
        width: size,
        height: size * 1.4,
      } as React.CSSProperties}
    >
      {/* Body */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-[40%] overflow-hidden"
        style={{
          width: size * 0.65,
          height: size * 0.55,
          background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
        }}
      >
        {/* Kurta/Shirt */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-t-lg"
          style={{
            width: size * 0.6,
            height: size * 0.5,
            background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
          }}
        >
          {/* Collar detail */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent"
            style={{ borderBottomColor: '#c73e54' }}
          />
          {/* Button line */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-300/80" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-300/80" />
          </div>
        </div>
      </div>

      {/* Head */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-[45%] border-2"
        style={{
          width: size * 0.75,
          height: size * 0.68,
          background: 'linear-gradient(145deg, #4a3728, #3d2d22)',
          borderColor: 'rgba(0,0,0,0.2)',
        }}
      >
        {/* Hair - thick black curly hair */}
        <div 
          className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-t-full"
          style={{
            width: size * 0.72,
            height: size * 0.32,
            background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
          }}
        >
          {/* Hair texture */}
          <div className="absolute inset-0 rounded-t-full overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-black/40"
                style={{
                  width: size * 0.12,
                  height: size * 0.08,
                  left: `${10 + i * 11}%`,
                  top: `${20 + (i % 2) * 15}%`,
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Ears */}
        <div 
          className="absolute top-1/3 -left-2 rounded-full"
          style={{
            width: size * 0.1,
            height: size * 0.12,
            background: 'linear-gradient(145deg, #4a3728, #3d2d22)',
          }}
        />
        <div 
          className="absolute top-1/3 -right-2 rounded-full"
          style={{
            width: size * 0.1,
            height: size * 0.12,
            background: 'linear-gradient(145deg, #4a3728, #3d2d22)',
          }}
        />
        
        {/* Face container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
          {/* Eyebrows */}
          <div className="flex gap-5 mb-1">
            <div 
              className={`h-1 rounded-full bg-black/70 transition-transform ${
                expression === 'ecstatic' ? 'rotate-[-10deg]' : ''
              }`}
              style={{ width: size * 0.12 }}
            />
            <div 
              className={`h-1 rounded-full bg-black/70 transition-transform ${
                expression === 'ecstatic' ? 'rotate-[10deg]' : ''
              }`}
              style={{ width: size * 0.12 }}
            />
          </div>
          
          {/* Eyes */}
          <div className="flex gap-4 mb-2">
            <div 
              className="rounded-full bg-white relative overflow-hidden"
              style={{ width: size * 0.14, height: size * 0.12 }}
            >
              <div 
                className={`absolute rounded-full bg-gray-900 ${
                  expression === 'ecstatic' || expression === 'super-happy' ? 'bottom-1' : 'bottom-1/2 translate-y-1/2'
                }`}
                style={{ 
                  width: size * 0.08, 
                  height: size * 0.08,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white" />
              </div>
            </div>
            <div 
              className="rounded-full bg-white relative overflow-hidden"
              style={{ width: size * 0.14, height: size * 0.12 }}
            >
              <div 
                className={`absolute rounded-full bg-gray-900 ${
                  expression === 'ecstatic' || expression === 'super-happy' ? 'bottom-1' : 'bottom-1/2 translate-y-1/2'
                }`}
                style={{ 
                  width: size * 0.08, 
                  height: size * 0.08,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white" />
              </div>
            </div>
          </div>
          
          {/* Nose */}
          <div 
            className="rounded-full mb-1"
            style={{ 
              width: size * 0.06, 
              height: size * 0.04,
              background: 'rgba(0,0,0,0.15)',
            }}
          />
          
          {/* Cheeks when happy */}
          {happiness >= 60 && (
            <div className="flex gap-8 absolute" style={{ top: '58%' }}>
              <div 
                className="rounded-full"
                style={{ 
                  width: size * 0.1, 
                  height: size * 0.05,
                  background: 'rgba(233, 69, 96, 0.35)',
                }}
              />
              <div 
                className="rounded-full"
                style={{ 
                  width: size * 0.1, 
                  height: size * 0.05,
                  background: 'rgba(233, 69, 96, 0.35)',
                }}
              />
            </div>
          )}
          
          {/* Mouth */}
          <div className="mt-1">
            {expression === 'ecstatic' && (
              <div 
                className="rounded-b-full bg-gray-900 flex items-end justify-center overflow-hidden"
                style={{ width: size * 0.2, height: size * 0.12 }}
              >
                <div className="w-full h-1/2 bg-rose-400 rounded-t-full" />
              </div>
            )}
            {expression === 'super-happy' && (
              <div 
                className="rounded-b-full bg-gray-900"
                style={{ width: size * 0.16, height: size * 0.08 }}
              />
            )}
            {expression === 'happy' && (
              <div 
                className="rounded-b-full border-b-[3px] border-gray-900"
                style={{ width: size * 0.12, height: size * 0.04 }}
              />
            )}
            {expression === 'content' && (
              <div 
                className="rounded-full bg-gray-900"
                style={{ width: size * 0.08, height: size * 0.03 }}
              />
            )}
            {expression === 'neutral' && (
              <div 
                className="border-b-2 border-gray-700"
                style={{ width: size * 0.1 }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Arms */}
      <div 
        className={`absolute rounded-full transition-transform ${
          animating ? 'rotate-[-40deg]' : 'rotate-[-10deg]'
        }`}
        style={{
          width: size * 0.12,
          height: size * 0.35,
          bottom: size * 0.2,
          left: size * 0.02,
          background: 'linear-gradient(145deg, #4a3728, #3d2d22)',
          transformOrigin: 'top center',
        }}
      />
      <div 
        className={`absolute rounded-full transition-transform ${
          animating ? 'rotate-[40deg]' : 'rotate-[10deg]'
        }`}
        style={{
          width: size * 0.12,
          height: size * 0.35,
          bottom: size * 0.2,
          right: size * 0.02,
          background: 'linear-gradient(145deg, #4a3728, #3d2d22)',
          transformOrigin: 'top center',
        }}
      />

      {/* Sparkles when super happy */}
      {happiness >= 80 && (
        <>
          <div className="absolute -top-4 left-0 text-lg animate-pulse">✨</div>
          <div className="absolute -top-2 right-0 text-base animate-pulse" style={{ animationDelay: '0.2s' }}>⭐</div>
          <div className="absolute top-0 -left-4 text-sm animate-pulse" style={{ animationDelay: '0.4s' }}>💫</div>
        </>
      )}
    </div>
  );
};

export default KPCharacter;

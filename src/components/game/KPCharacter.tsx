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

  const getExpression = () => {
    if (happiness >= 100) return 'ecstatic';
    if (happiness >= 80) return 'super-happy';
    if (happiness >= 60) return 'happy';
    if (happiness >= 40) return 'content';
    return 'neutral';
  };

  const expression = getExpression();
  const baseHeight = 180;
  const height = baseHeight * scale;
  const width = height * 0.45;

  return (
    <div 
      className={`relative transition-all duration-300 ease-out character-shadow ${
        animating ? 'animate-happy' : 'animate-bounce-soft'
      }`}
      style={{ 
        '--char-scale': scale,
        width: width,
        height: height,
      } as React.CSSProperties}
    >
      {/* Legs */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1" style={{ height: height * 0.28 }}>
        {/* Left leg */}
        <div 
          className="rounded-b-lg"
          style={{
            width: width * 0.22,
            height: '100%',
            background: 'linear-gradient(to bottom, #1a1a2e, #0f0f1a)',
          }}
        >
          {/* Shoe */}
          <div 
            className="absolute bottom-0 left-0 rounded-lg"
            style={{
              width: width * 0.28,
              height: height * 0.05,
              background: 'linear-gradient(to bottom, #2d2d2d, #1a1a1a)',
            }}
          />
        </div>
        {/* Right leg */}
        <div 
          className="rounded-b-lg"
          style={{
            width: width * 0.22,
            height: '100%',
            background: 'linear-gradient(to bottom, #1a1a2e, #0f0f1a)',
          }}
        >
          {/* Shoe */}
          <div 
            className="absolute bottom-0 right-0 rounded-lg"
            style={{
              width: width * 0.28,
              height: height * 0.05,
              background: 'linear-gradient(to bottom, #2d2d2d, #1a1a1a)',
            }}
          />
        </div>
      </div>

      {/* Torso - Yellow Rapido T-shirt */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 rounded-t-lg overflow-hidden"
        style={{
          width: width * 0.85,
          height: height * 0.32,
          bottom: height * 0.26,
          background: 'linear-gradient(145deg, #ffd93d, #f0c419)',
          boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* Collar */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full"
          style={{
            width: width * 0.35,
            height: height * 0.04,
            background: 'linear-gradient(to bottom, #e6b800, #ccaa00)',
          }}
        />
        
        {/* Rapido text */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-white tracking-wide"
          style={{
            fontSize: Math.max(10, width * 0.2),
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            fontStyle: 'italic',
          }}
        >
          Rapido
        </div>

        {/* Shirt wrinkles/details */}
        <div className="absolute bottom-2 left-2 w-4 h-0.5 bg-yellow-600/30 rounded" />
        <div className="absolute bottom-4 right-3 w-3 h-0.5 bg-yellow-600/30 rounded" />
      </div>

      {/* Arms - straight down, not closing inwards */}
      <div 
        className="absolute rounded-full"
        style={{
          width: width * 0.12,
          height: height * 0.22,
          bottom: height * 0.28,
          left: -width * 0.02,
          background: 'linear-gradient(145deg, #5a4535, #4a3828)',
        }}
      >
        {/* Hand */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: width * 0.1,
            height: width * 0.08,
            background: 'linear-gradient(145deg, #5a4535, #4a3828)',
          }}
        />
      </div>
      <div 
        className="absolute rounded-full"
        style={{
          width: width * 0.12,
          height: height * 0.22,
          bottom: height * 0.28,
          right: -width * 0.02,
          background: 'linear-gradient(145deg, #5a4535, #4a3828)',
        }}
      >
        {/* Hand */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: width * 0.1,
            height: width * 0.08,
            background: 'linear-gradient(145deg, #5a4535, #4a3828)',
          }}
        />
      </div>

      {/* Neck */}
      <div 
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          width: width * 0.25,
          height: height * 0.05,
          bottom: height * 0.55,
          background: 'linear-gradient(145deg, #5a4535, #4a3828)',
        }}
      />

      {/* Head */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 rounded-[40%]"
        style={{
          width: width * 0.7,
          height: height * 0.22,
          bottom: height * 0.58,
          background: 'linear-gradient(145deg, #5a4535, #4a3828)',
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        }}
      >
        {/* Hair */}
        <div 
          className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-t-[50%]"
          style={{
            width: width * 0.68,
            height: height * 0.1,
            background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
          }}
        >
          {/* Hair texture */}
          <div className="absolute inset-0 rounded-t-[50%] overflow-hidden opacity-60">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-black"
                style={{
                  width: width * 0.08,
                  height: height * 0.025,
                  left: `${15 + i * 13}%`,
                  top: `${30 + (i % 2) * 20}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Ears */}
        <div 
          className="absolute top-1/3 -left-1 rounded-full"
          style={{
            width: width * 0.1,
            height: height * 0.04,
            background: 'linear-gradient(145deg, #5a4535, #4a3828)',
          }}
        />
        <div 
          className="absolute top-1/3 -right-1 rounded-full"
          style={{
            width: width * 0.1,
            height: height * 0.04,
            background: 'linear-gradient(145deg, #5a4535, #4a3828)',
          }}
        />

        {/* Face */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-3">
          {/* Eyebrows */}
          <div className="flex gap-3 mb-0.5">
            <div 
              className={`h-0.5 rounded-full bg-gray-900 transition-transform ${
                expression === 'ecstatic' ? 'rotate-[-8deg]' : ''
              }`}
              style={{ width: width * 0.12 }}
            />
            <div 
              className={`h-0.5 rounded-full bg-gray-900 transition-transform ${
                expression === 'ecstatic' ? 'rotate-[8deg]' : ''
              }`}
              style={{ width: width * 0.12 }}
            />
          </div>

          {/* Eyes */}
          <div className="flex gap-2.5 mb-1">
            <div 
              className="rounded-full bg-white relative overflow-hidden border border-gray-300"
              style={{ width: width * 0.14, height: height * 0.035 }}
            >
              <div 
                className="absolute rounded-full bg-gray-900"
                style={{ 
                  width: width * 0.07, 
                  height: width * 0.07,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white" />
              </div>
            </div>
            <div 
              className="rounded-full bg-white relative overflow-hidden border border-gray-300"
              style={{ width: width * 0.14, height: height * 0.035 }}
            >
              <div 
                className="absolute rounded-full bg-gray-900"
                style={{ 
                  width: width * 0.07, 
                  height: width * 0.07,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white" />
              </div>
            </div>
          </div>

          {/* Nose */}
          <div 
            className="rounded-full mb-0.5"
            style={{ 
              width: width * 0.06, 
              height: height * 0.015,
              background: 'rgba(0,0,0,0.15)',
            }}
          />

          {/* Cheeks when happy */}
          {happiness >= 60 && (
            <div className="flex gap-5 absolute" style={{ top: '60%' }}>
              <div 
                className="rounded-full"
                style={{ 
                  width: width * 0.1, 
                  height: height * 0.015,
                  background: 'rgba(255, 100, 100, 0.3)',
                }}
              />
              <div 
                className="rounded-full"
                style={{ 
                  width: width * 0.1, 
                  height: height * 0.015,
                  background: 'rgba(255, 100, 100, 0.3)',
                }}
              />
            </div>
          )}

          {/* Mouth */}
          <div className="mt-0.5">
            {expression === 'ecstatic' && (
              <div 
                className="rounded-b-full bg-gray-900 flex items-end justify-center overflow-hidden"
                style={{ width: width * 0.18, height: height * 0.035 }}
              >
                <div className="w-full h-1/2 bg-rose-400 rounded-t-full" />
              </div>
            )}
            {expression === 'super-happy' && (
              <div 
                className="rounded-b-full bg-gray-900"
                style={{ width: width * 0.14, height: height * 0.025 }}
              />
            )}
            {expression === 'happy' && (
              <div 
                className="rounded-b-full border-b-2 border-gray-900"
                style={{ width: width * 0.1, height: height * 0.015 }}
              />
            )}
            {expression === 'content' && (
              <div 
                className="rounded-full bg-gray-800"
                style={{ width: width * 0.06, height: height * 0.01 }}
              />
            )}
            {expression === 'neutral' && (
              <div 
                className="border-b-[1.5px] border-gray-700"
                style={{ width: width * 0.08 }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Sparkles when super happy */}
      {happiness >= 80 && (
        <>
          <div className="absolute -top-2 left-0 text-sm animate-pulse">✨</div>
          <div className="absolute top-0 right-0 text-xs animate-pulse" style={{ animationDelay: '0.2s' }}>⭐</div>
          <div className="absolute top-4 -left-3 text-xs animate-pulse" style={{ animationDelay: '0.4s' }}>💫</div>
        </>
      )}
    </div>
  );
};

export default KPCharacter;

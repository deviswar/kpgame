import { memo } from 'react';

interface QTCharacterProps {
  scale: number;
  isAngry?: boolean;
}

const QTCharacter = memo(({ scale, isAngry = true }: QTCharacterProps) => {
  const baseHeight = 180;
  const height = baseHeight * scale;
  const width = height * 0.45;

  return (
    <div 
      className="relative transition-all duration-300 ease-out character-shadow animate-bounce-soft"
      style={{ 
        '--char-scale': scale,
        width: width,
        height: height,
      } as React.CSSProperties}
    >
      {/* Legs - black leggings */}
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
          {/* Shoe - pink */}
          <div 
            className="absolute bottom-0 left-0 rounded-lg"
            style={{
              width: width * 0.28,
              height: height * 0.05,
              background: 'linear-gradient(to bottom, #ec4899, #db2777)',
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
          {/* Shoe - pink */}
          <div 
            className="absolute bottom-0 right-0 rounded-lg"
            style={{
              width: width * 0.28,
              height: height * 0.05,
              background: 'linear-gradient(to bottom, #ec4899, #db2777)',
            }}
          />
        </div>
      </div>

      {/* Torso - Pink dress */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 rounded-t-lg overflow-hidden"
        style={{
          width: width * 0.9,
          height: height * 0.35,
          bottom: height * 0.24,
          background: 'linear-gradient(145deg, #f472b6, #ec4899)',
          boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* Collar - rounded neckline */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full"
          style={{
            width: width * 0.4,
            height: height * 0.05,
            background: 'linear-gradient(to bottom, #fdf2f8, #fbcfe8)',
          }}
        />
        
        {/* Dress pattern - small heart */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ fontSize: Math.max(12, width * 0.25) }}
        >
          💗
        </div>

        {/* Dress hem flare */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-b-full"
          style={{
            width: width * 1,
            height: height * 0.06,
            background: 'linear-gradient(to bottom, #ec4899, #db2777)',
          }}
        />
      </div>

      {/* Arms - fair skin tone, straight down */}
      <div 
        className="absolute rounded-full"
        style={{
          width: width * 0.12,
          height: height * 0.22,
          bottom: height * 0.30,
          left: -width * 0.02,
          background: 'linear-gradient(145deg, #fcd5ce, #f8b4a8)',
        }}
      >
        {/* Hand */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: width * 0.1,
            height: width * 0.08,
            background: 'linear-gradient(145deg, #fcd5ce, #f8b4a8)',
          }}
        />
      </div>
      <div 
        className="absolute rounded-full"
        style={{
          width: width * 0.12,
          height: height * 0.22,
          bottom: height * 0.30,
          right: -width * 0.02,
          background: 'linear-gradient(145deg, #fcd5ce, #f8b4a8)',
        }}
      >
        {/* Hand */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: width * 0.1,
            height: width * 0.08,
            background: 'linear-gradient(145deg, #fcd5ce, #f8b4a8)',
          }}
        />
      </div>

      {/* Neck */}
      <div 
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          width: width * 0.22,
          height: height * 0.05,
          bottom: height * 0.56,
          background: 'linear-gradient(145deg, #fcd5ce, #f8b4a8)',
        }}
      />

      {/* Head */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 rounded-[40%]"
        style={{
          width: width * 0.7,
          height: height * 0.22,
          bottom: height * 0.58,
          background: 'linear-gradient(145deg, #fcd5ce, #f8b4a8)',
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        }}
      >
        {/* Hair - long black hair with volume */}
        <div 
          className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-t-[50%]"
          style={{
            width: width * 0.75,
            height: height * 0.14,
            background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
          }}
        />
        
        {/* Side hair - left */}
        <div 
          className="absolute rounded-b-full"
          style={{
            width: width * 0.18,
            height: height * 0.18,
            left: -width * 0.08,
            top: height * 0.02,
            background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
          }}
        />
        
        {/* Side hair - right */}
        <div 
          className="absolute rounded-b-full"
          style={{
            width: width * 0.18,
            height: height * 0.18,
            right: -width * 0.08,
            top: height * 0.02,
            background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
          }}
        />

        {/* Ponytail */}
        <div 
          className="absolute rounded-full"
          style={{
            width: width * 0.15,
            height: height * 0.12,
            right: -width * 0.12,
            top: -height * 0.02,
            background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
          }}
        >
          <div 
            className="absolute rounded-full"
            style={{
              width: width * 0.12,
              height: height * 0.08,
              right: -width * 0.04,
              top: height * 0.03,
              background: 'linear-gradient(145deg, #1a1a1a, #0a0a0a)',
            }}
          />
        </div>

        {/* Pink bow */}
        <div 
          className="absolute z-20"
          style={{
            top: -height * 0.04,
            right: -width * 0.04,
            fontSize: Math.max(16, width * 0.28),
          }}
        >
          🎀
        </div>

        {/* Ears */}
        <div 
          className="absolute top-1/3 -left-1 rounded-full"
          style={{
            width: width * 0.1,
            height: height * 0.04,
            background: 'linear-gradient(145deg, #fcd5ce, #f8b4a8)',
          }}
        />
        <div 
          className="absolute top-1/3 -right-1 rounded-full"
          style={{
            width: width * 0.1,
            height: height * 0.04,
            background: 'linear-gradient(145deg, #fcd5ce, #f8b4a8)',
          }}
        />

        {/* Face */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          {/* Angry Eyebrows - slanted inward */}
          <div className="flex gap-3 mb-0.5">
            <div 
              className="h-1 rounded-full bg-gray-800"
              style={{ 
                width: width * 0.14,
                transform: 'rotate(15deg)',
              }}
            />
            <div 
              className="h-1 rounded-full bg-gray-800"
              style={{ 
                width: width * 0.14,
                transform: 'rotate(-15deg)',
              }}
            />
          </div>

          {/* Eyes - angry squint */}
          <div className="flex gap-2.5 mb-1">
            <div 
              className="rounded-full bg-white relative overflow-hidden border border-gray-300"
              style={{ width: width * 0.14, height: height * 0.03 }}
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
              />
            </div>
            <div 
              className="rounded-full bg-white relative overflow-hidden border border-gray-300"
              style={{ width: width * 0.14, height: height * 0.03 }}
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
              />
            </div>
          </div>

          {/* Nose */}
          <div 
            className="rounded-full mb-0.5"
            style={{ 
              width: width * 0.05, 
              height: height * 0.012,
              background: 'rgba(0,0,0,0.1)',
            }}
          />

          {/* Angry blush */}
          <div className="flex gap-5 absolute" style={{ top: '60%' }}>
            <div 
              className="rounded-full"
              style={{ 
                width: width * 0.1, 
                height: height * 0.015,
                background: 'rgba(239, 68, 68, 0.5)',
              }}
            />
            <div 
              className="rounded-full"
              style={{ 
                width: width * 0.1, 
                height: height * 0.015,
                background: 'rgba(239, 68, 68, 0.5)',
              }}
            />
          </div>

          {/* Mouth - angry frown */}
          <div className="mt-1">
            <div 
              className="rounded-t-full bg-gray-900"
              style={{ width: width * 0.12, height: height * 0.02 }}
            />
          </div>
        </div>
      </div>

      {/* Anger symbols */}
      {isAngry && (
        <>
          <div 
            className="absolute animate-pulse"
            style={{ 
              top: height * 0.12,
              left: -width * 0.1,
              fontSize: Math.max(10, width * 0.15),
            }}
          >
            💢
          </div>
          <div 
            className="absolute animate-pulse"
            style={{ 
              top: height * 0.08,
              right: width * 0.15,
              fontSize: Math.max(8, width * 0.12),
              animationDelay: '0.3s',
            }}
          >
            💢
          </div>
        </>
      )}
    </div>
  );
});

QTCharacter.displayName = 'QTCharacter';

export default QTCharacter;

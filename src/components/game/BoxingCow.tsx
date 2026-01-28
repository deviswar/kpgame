import { useEffect, useState } from 'react';

interface BoxingCowProps {
  scale?: number;
  isPunching: boolean;
  isVictory: boolean;
}

const BoxingCow = ({ scale = 1, isPunching, isVictory }: BoxingCowProps) => {
  const [showSweat, setShowSweat] = useState(false);

  useEffect(() => {
    if (isPunching) {
      setShowSweat(true);
      const timer = setTimeout(() => setShowSweat(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isPunching]);

  const baseHeight = 160;
  const height = baseHeight * scale;
  const width = height * 0.8;

  return (
    <div style={{ transform: 'scaleX(-1)' }}> {/* Wrapper to flip cow to face right */}
      <div 
        className={`relative transition-transform duration-200 ${
          isPunching ? 'animate-cow-punch' : isVictory ? 'animate-cow-victory' : 'animate-cow-idle'
        }`}
        style={{ 
          width: width,
          height: height,
        }}
      >
      {/* Body */}
      <div 
        className="absolute rounded-[60%] overflow-hidden"
        style={{
          width: width * 0.85,
          height: height * 0.45,
          bottom: height * 0.2,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(145deg, #f5f5f0, #e8e8e0)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        }}
      >
        {/* Cow spots */}
        <div 
          className="absolute rounded-full"
          style={{
            width: width * 0.2,
            height: height * 0.12,
            top: '20%',
            left: '15%',
            background: '#2a2a2a',
            transform: 'rotate(-15deg)',
          }}
        />
        <div 
          className="absolute rounded-full"
          style={{
            width: width * 0.18,
            height: height * 0.1,
            top: '50%',
            right: '20%',
            background: '#2a2a2a',
            transform: 'rotate(20deg)',
          }}
        />
        <div 
          className="absolute rounded-full"
          style={{
            width: width * 0.12,
            height: height * 0.08,
            bottom: '25%',
            left: '40%',
            background: '#2a2a2a',
          }}
        />
      </div>

      {/* Back legs */}
      <div 
        className="absolute rounded-b-lg"
        style={{
          width: width * 0.12,
          height: height * 0.2,
          bottom: 0,
          right: width * 0.15,
          background: 'linear-gradient(145deg, #f0f0e8, #ddd)',
        }}
      >
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded"
          style={{
            width: width * 0.14,
            height: height * 0.04,
            background: '#1a1a1a',
          }}
        />
      </div>
      <div 
        className="absolute rounded-b-lg"
        style={{
          width: width * 0.12,
          height: height * 0.2,
          bottom: 0,
          right: width * 0.32,
          background: 'linear-gradient(145deg, #e8e8e0, #d5d5d0)',
        }}
      >
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded"
          style={{
            width: width * 0.14,
            height: height * 0.04,
            background: '#1a1a1a',
          }}
        />
      </div>

      {/* Front Left Leg with Boxing Glove - THE PUNCHING ARM */}
      <div 
        className={`absolute transition-transform duration-100 ${isPunching ? 'translate-x-12' : ''}`}
        style={{
          width: width * 0.08,
          height: height * 0.28,
          bottom: height * 0.02,
          left: width * 0.12,
          transformOrigin: 'bottom center',
          zIndex: 10,
        }}
      >
        {/* Upper leg */}
        <div 
          className="absolute top-0 w-full rounded-lg"
          style={{
            height: '40%',
            background: 'linear-gradient(135deg, #f0f0e8, #e8e8e0)',
            border: '1px solid #ccc',
          }}
        />
        {/* Lower leg */}
        <div 
          className="absolute w-full rounded-lg"
          style={{
            top: '35%',
            height: '35%',
            background: 'linear-gradient(135deg, #e8e8e0, #d8d8d0)',
            border: '1px solid #bbb',
          }}
        />
        {/* Boxing Glove - Larger and more prominent */}
        <div 
          className="absolute"
          style={{
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: width * 0.18,
            height: width * 0.15,
            background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
            borderRadius: '45%',
            border: '3px solid #991b1b',
            boxShadow: `
              inset 3px 3px 6px rgba(255,255,255,0.4), 
              inset -3px -3px 6px rgba(0,0,0,0.3),
              0 4px 10px rgba(0,0,0,0.35)
            `,
          }}
        >
          {/* Glove thumb */}
          <div 
            className="absolute"
            style={{
              top: '12%',
              right: '-20%',
              width: '42%',
              height: '48%',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '50%',
              border: '2px solid #991b1b',
            }}
          />
          {/* Glove shine */}
          <div 
            className="absolute rounded-full bg-white/50"
            style={{
              top: '10%',
              left: '15%',
              width: '32%',
              height: '28%',
            }}
          />
          {/* Glove lacing detail */}
          <div 
            className="absolute bg-white/80"
            style={{
              bottom: '12%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '55%',
              height: '10%',
              borderRadius: '3px',
            }}
          />
        </div>
      </div>
      
      {/* Second front leg */}
      <div 
        className={`absolute transition-transform duration-100 ${isPunching ? '-translate-x-2' : ''}`}
        style={{
          bottom: height * 0.15,
          left: width * 0.22,
        }}
      >
        <div 
          className="rounded-lg"
          style={{
            width: width * 0.1,
            height: height * 0.18,
            background: 'linear-gradient(145deg, #e8e8e0, #d5d5d0)',
          }}
        />
        <div 
          className="absolute -bottom-1 -left-2 rounded-full"
          style={{
            width: width * 0.2,
            height: height * 0.12,
            background: 'linear-gradient(145deg, #e53935, #b71c1c)',
            boxShadow: '0 4px 10px rgba(229, 57, 53, 0.4)',
          }}
        >
          <div 
            className="absolute top-1 left-2 rounded-full bg-white/30"
            style={{ width: width * 0.06, height: height * 0.03 }}
          />
          <div 
            className="absolute -top-1 left-1/2 -translate-x-1/2 rounded"
            style={{
              width: width * 0.12,
              height: height * 0.03,
              background: '#fff',
            }}
          />
        </div>
      </div>

      {/* Head */}
      <div 
        className="absolute"
        style={{
          width: width * 0.5,
          height: height * 0.35,
          bottom: height * 0.5,
          left: width * 0.05,
        }}
      >
        {/* Main head shape */}
        <div 
          className="absolute rounded-[45%] overflow-hidden"
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(145deg, #f5f5f0, #e0e0d8)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
          }}
        >
          {/* Head spot */}
          <div 
            className="absolute rounded-full"
            style={{
              width: width * 0.15,
              height: height * 0.1,
              top: '10%',
              right: '15%',
              background: '#2a2a2a',
            }}
          />
        </div>

        {/* Horns */}
        <div 
          className="absolute -top-3 left-2 rounded-t-full"
          style={{
            width: width * 0.06,
            height: height * 0.1,
            background: 'linear-gradient(to top, #8b7355, #d4c4a8)',
            transform: 'rotate(-20deg)',
          }}
        />
        <div 
          className="absolute -top-3 right-3 rounded-t-full"
          style={{
            width: width * 0.06,
            height: height * 0.1,
            background: 'linear-gradient(to top, #8b7355, #d4c4a8)',
            transform: 'rotate(20deg)',
          }}
        />

        {/* Ears */}
        <div 
          className="absolute top-2 -left-2 rounded-full"
          style={{
            width: width * 0.12,
            height: height * 0.06,
            background: 'linear-gradient(145deg, #f5f5f0, #e0e0d8)',
            transform: 'rotate(-30deg)',
          }}
        >
          <div 
            className="absolute inset-1 rounded-full"
            style={{ background: 'rgba(255, 150, 150, 0.5)' }}
          />
        </div>
        <div 
          className="absolute top-2 -right-1 rounded-full"
          style={{
            width: width * 0.12,
            height: height * 0.06,
            background: 'linear-gradient(145deg, #f5f5f0, #e0e0d8)',
            transform: 'rotate(30deg)',
          }}
        >
          <div 
            className="absolute inset-1 rounded-full"
            style={{ background: 'rgba(255, 150, 150, 0.5)' }}
          />
        </div>

        {/* Angry eyes */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 flex gap-2">
          <div className="relative">
            {/* Left angry eyebrow */}
            <div 
              className="absolute -top-2 left-0 h-1 rounded-full bg-gray-800"
              style={{ 
                width: width * 0.1, 
                transform: isPunching ? 'rotate(20deg)' : 'rotate(15deg)',
              }}
            />
            <div 
              className="rounded-full bg-white border-2 border-gray-300 flex items-center justify-center"
              style={{ width: width * 0.1, height: height * 0.06 }}
            >
              <div 
                className="rounded-full bg-gray-900"
                style={{ width: width * 0.05, height: width * 0.05 }}
              >
                <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-white" />
              </div>
            </div>
          </div>
          <div className="relative">
            {/* Right angry eyebrow */}
            <div 
              className="absolute -top-2 right-0 h-1 rounded-full bg-gray-800"
              style={{ 
                width: width * 0.1, 
                transform: isPunching ? 'rotate(-20deg)' : 'rotate(-15deg)',
              }}
            />
            <div 
              className="rounded-full bg-white border-2 border-gray-300 flex items-center justify-center"
              style={{ width: width * 0.1, height: height * 0.06 }}
            >
              <div 
                className="rounded-full bg-gray-900"
                style={{ width: width * 0.05, height: width * 0.05 }}
              >
                <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Snout/Nose */}
        <div 
          className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-[50%]"
          style={{
            width: width * 0.25,
            height: height * 0.1,
            background: 'linear-gradient(145deg, #ffb6c1, #ff9aa2)',
          }}
        >
          {/* Nostrils - flared when angry */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 flex gap-2">
            <div 
              className={`rounded-full bg-gray-800 ${isPunching ? 'scale-125' : ''} transition-transform`}
              style={{ width: width * 0.04, height: height * 0.03 }}
            />
            <div 
              className={`rounded-full bg-gray-800 ${isPunching ? 'scale-125' : ''} transition-transform`}
              style={{ width: width * 0.04, height: height * 0.03 }}
            />
          </div>
          {/* Steam from nostrils when punching */}
          {isPunching && (
            <>
              <div className="absolute -left-2 top-0 text-xs animate-ping">💨</div>
              <div className="absolute -right-2 top-0 text-xs animate-ping">💨</div>
            </>
          )}
        </div>

        {/* Angry mouth */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2"
          style={{
            width: width * 0.12,
            height: height * 0.02,
            borderBottom: '2px solid #333',
            borderRadius: '0 0 50% 50%',
          }}
        />
      </div>

      {/* Tail */}
      <div 
        className="absolute animate-wiggle"
        style={{
          width: width * 0.04,
          height: height * 0.2,
          bottom: height * 0.4,
          right: width * 0.02,
          background: 'linear-gradient(to bottom, #f0f0e8, #ddd)',
          borderRadius: '30%',
          transformOrigin: 'top center',
        }}
      >
        {/* Tail tuft */}
        <div 
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: width * 0.06,
            height: width * 0.06,
            background: '#2a2a2a',
          }}
        />
      </div>

      {/* Effort effect when punching - no tears/water drops */}
      {showSweat && (
        <>
          <div 
            className="absolute animate-ping"
            style={{ top: height * 0.25, left: width * 0.1, fontSize: '10px' }}
          >
            💢
          </div>
          <div 
            className="absolute animate-ping"
            style={{ top: height * 0.3, right: width * 0.55, animationDelay: '0.1s', fontSize: '10px' }}
          >
            💥
          </div>
        </>
      )}

      {/* Victory pose - gloves raised */}
      {isVictory && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
          🏆
        </div>
      )}
      </div>
    </div>
  );
};

export default BoxingCow;

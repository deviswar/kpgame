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

      {/* Front legs with boxing gloves */}
      <div 
        className={`absolute transition-transform duration-100 ${isPunching ? 'translate-x-12' : ''}`}
        style={{
          bottom: height * 0.15,
          left: width * 0.08,
        }}
      >
        {/* Leg */}
        <div 
          className="rounded-lg"
          style={{
            width: width * 0.1,
            height: height * 0.18,
            background: 'linear-gradient(145deg, #f0f0e8, #ddd)',
          }}
        />
        {/* Boxing glove */}
        <div 
          className="absolute -bottom-1 -left-2 rounded-full"
          style={{
            width: width * 0.2,
            height: height * 0.12,
            background: 'linear-gradient(145deg, #e53935, #b71c1c)',
            boxShadow: '0 4px 10px rgba(229, 57, 53, 0.4)',
          }}
        >
          {/* Glove highlight */}
          <div 
            className="absolute top-1 left-2 rounded-full bg-white/30"
            style={{ width: width * 0.06, height: height * 0.03 }}
          />
          {/* Glove cuff */}
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
            {/* Angry eyebrow */}
            <div 
              className="absolute -top-2 left-0 h-1 rounded-full bg-gray-800"
              style={{ 
                width: width * 0.1, 
                transform: 'rotate(15deg)',
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
                {/* Angry pupil - looking at target */}
                <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-white" />
              </div>
            </div>
          </div>
          <div className="relative">
            <div 
              className="absolute -top-2 right-0 h-1 rounded-full bg-gray-800"
              style={{ 
                width: width * 0.1, 
                transform: 'rotate(-15deg)',
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
          right: width * 0.05,
          background: 'linear-gradient(to bottom, #f0f0e8, #ddd)',
          borderRadius: '20%',
          transformOrigin: 'top center',
        }}
      >
        {/* Tail tuft */}
        <div 
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: width * 0.08,
            height: height * 0.05,
            background: '#1a1a1a',
          }}
        />
      </div>

      {/* Sweat drops when punching */}
      {showSweat && (
        <>
          <div 
            className="absolute text-blue-400 animate-ping"
            style={{ top: height * 0.25, left: width * 0.1 }}
          >
            💧
          </div>
          <div 
            className="absolute text-blue-400 animate-ping"
            style={{ top: height * 0.3, right: width * 0.55, animationDelay: '0.1s' }}
          >
            💧
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
  );
};

export default BoxingCow;

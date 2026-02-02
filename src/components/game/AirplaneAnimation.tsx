import { useEffect, useState, useRef } from 'react';
import KPCharacter from './KPCharacter';

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
  const [showVideo, setShowVideo] = useState(false);
  const [videoPreloaded, setVideoPreloaded] = useState(false);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Preload video as blob for INSTANT playback with zero buffering
  // DELAYED to avoid competing with critical initial page resources
  useEffect(() => {
    let blobUrlToClean: string | null = null;
    
    const preloadVideoAsBlob = async () => {
      try {
        const response = await fetch('/music/fall.mp4');
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        blobUrlToClean = blobUrl;
        setVideoBlobUrl(blobUrl);
        setVideoPreloaded(true);
        console.log('Video pre-cached as blob - ready for instant playback');
      } catch (e) {
        console.error('Failed to pre-cache video:', e);
        // Fallback: still mark as preloaded so video can play from network
        setVideoPreloaded(true);
      }
    };
    
    // Delay video preload by 2 seconds to prioritize critical resources
    const timer = setTimeout(() => {
      preloadVideoAsBlob();
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      // Cleanup blob URL on unmount
      if (blobUrlToClean) {
        URL.revokeObjectURL(blobUrlToClean);
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setPhase('flying'), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Generate confetti pieces
  const confettiPieces = [...Array(50)].map((_, i) => ({
    delay: Math.random() * 2,
    left: Math.random() * 100,
  }));

  const handleWatchVideo = () => {
    setShowVideo(true);
    // Auto-play video when shown
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    }, 100);
  };

  // Video screen
  if (showVideo) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-4 px-3">
        {/* Video container - takes most space */}
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          <video
            ref={videoRef}
            src={videoBlobUrl || '/music/fall.mp4'}
            autoPlay
            loop
            playsInline
            preload="auto"
            muted
            className="w-full max-w-md rounded-2xl shadow-2xl border-4 border-primary/50 no-video-controls"
            style={{ 
              maxHeight: '55vh',
              pointerEvents: 'none'
            }}
            onContextMenu={(e) => e.preventDefault()}
          />
          
          {/* Brutal popup below video */}
          <div className="bg-black px-5 py-3 rounded-xl shadow-xl mt-3">
            <p className="text-white font-bold text-lg md:text-2xl text-center">
              Brutal Is A Small Word 😂😭
            </p>
          </div>
        </div>

        {/* Bottom section - compact for mobile */}
        <div className="w-full flex flex-col items-center gap-3 mt-3">
          {/* Go to Home button */}
          <button
            onClick={onComplete}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-base md:text-lg hover:scale-105 transition-transform shadow-xl w-full max-w-xs"
          >
            Go to Home 🏠
          </button>
          
          {/* PhonePe request */}
          <p className="text-white/90 text-sm md:text-base font-medium text-center">
            Can you give 100 rupees cash? I will do PhonePe 💸
          </p>
        </div>
      </div>
    );
  }

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
        
        {/* Airplane and KP waving */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Big moving airplane emoji */}
          <div 
            className={`text-7xl md:text-8xl transition-all duration-1000 ${
              phase === 'celebrating' ? 'scale-100' : 'scale-110 -translate-y-4'
            }`}
            style={{
              animation: 'planeFloat 2s ease-in-out infinite',
            }}
          >
            ✈️
          </div>
          
          {/* KP waving bye */}
          <div className="relative animate-bounce" style={{ animationDuration: '2s' }}>
            <KPCharacter scale={1} isHappy={true} happiness={100} />
            {/* Waving hand */}
            <div className="absolute -top-2 -right-4 text-3xl md:text-4xl animate-wave">
              👋
            </div>
          </div>
        </div>
        
        {/* Netherlands flag and milk glass */}
        <div className="my-4 text-4xl md:text-5xl flex items-center gap-3">
          🇳🇱 🥛
        </div>
        
        {/* PornHub-style logo: white text + orange box with black text */}
        <div className="bg-black px-4 py-3 rounded-lg shadow-xl mb-6 flex items-center flex-wrap justify-center gap-1">
          <span className="text-xl md:text-3xl font-bold text-white tracking-tight">
            Bye 👋 guys, im going to
          </span>
          <span className="bg-[#F7971D] text-black text-xl md:text-3xl font-bold px-2 py-1 rounded-md ml-2">
            Netherlands!
          </span>
        </div>
        
        {/* Watch my leaked video button */}
        <button
          onClick={handleWatchVideo}
          className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl animate-pulse"
        >
          🎬 Watch my leaked video 🔥
        </button>
        
        {/* PhonePe request */}
        <p className="mt-4 text-white/90 text-base md:text-lg font-medium">
          Can you give 100 rupees cash? I will do PhonePe 💸
        </p>
      </div>
    </div>
  );
};

export default AirplaneAnimation;

import { useState, useEffect, memo } from 'react';
import KPCharacter from './KPCharacter';
import WaveText from './WaveText';
import RizzScene from './RizzScene';
import { playRizz, stopRizz, precacheRizzAudio, preloadAllAudio } from '@/lib/audioManager';

// Preload images for later screens - import ONLY what's needed for immediate display
import roseMilkBanner from '@/assets/rose-milk-banner.jpg';
import villageMilkBanner from '@/assets/village-milk-banner.jpg';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = memo(({
  onStart
}: WelcomeScreenProps) => {
  const [showRizzScene, setShowRizzScene] = useState(false);

  // Preload audio and CRITICAL images immediately on mount
  useEffect(() => {
    // IMPORTANT (iPhone Safari): do NOT start loading multiple audio files on first paint.
    // That can saturate bandwidth/CPU and delay the first user-gesture playback.
    // We only mark rizz as "ready" here; actual Audio is created on tap.
    precacheRizzAudio();

    // Preload MILK SCENE BANNERS IMMEDIATELY (no delay!)
    [roseMilkBanner, villageMilkBanner].forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Lazy load other images after 1 second (not critical for first screens)
    const lazyTimer = setTimeout(() => {
      import('@/assets/honda-amaze.jpg');
      import('@/assets/cement-bags.jpg');
      import('@/assets/honda-amaze-car.jpg');
      import('@/assets/pug-dog.webp');
      import('@/assets/pug-memorial.jpg');
      import('@/assets/pug-grave.jpg');
    }, 1000);

    return () => clearTimeout(lazyTimer);
  }, []);

  const handleShowRizz = () => {
    // CRITICAL: Play audio FIRST, synchronously in user gesture context
    // This must happen before any state updates to preserve user gesture
    playRizz();

    // Then update state (React batches this anyway)
    setShowRizzScene(true);

    // After the first interaction, we can safely preload the other tracks.
    // Delay slightly so rizz has priority on constrained iPhone Safari networks.
    window.setTimeout(() => {
      preloadAllAudio();
    }, 1200);
  };

  const handleStartGame = () => {
    // Stop rizz audio via audio manager (which now aggressively stops it)
    stopRizz();
    // Call onStart (which triggers Music 2 in parent)
    onStart();
  };

  // Phase 1: Initial Welcome Screen
  if (!showRizzScene) {
    return (
      <div className="relative min-h-screen min-h-[100dvh] game-gradient flex flex-col items-center justify-center px-4 py-4 overflow-hidden gap-3">
        {/* Version number - bottom left */}
        <div className="absolute bottom-24 left-4">
          <span className="text-white text-xs font-medium">version - 8008.69</span>
        </div>

        {/* Header with title and KP */}
        <div className="flex items-center gap-2 -mt-24">
          <h1 className="text-5xl md:text-7xl tracking-wide relative" style={{
            fontFamily: '"Bangers", cursive',
            color: '#FFD93D',
            textShadow: `
              0 3px 0 #E8A800,
              0 6px 0 #D4950A,
              0 9px 0 #B87A00,
              0 12px 4px rgba(0,0,0,0.3),
              0 14px 8px rgba(0,0,0,0.2)
            `,
            WebkitTextStroke: '3px #FFFFFF',
            paintOrder: 'stroke fill',
            letterSpacing: '0.05em'
          }}>
            KP Game
          </h1>
          <div className="scale-75 origin-center -my-8">
            <KPCharacter scale={0.8} isHappy={false} happiness={50} />
          </div>
        </div>

        {/* Fun Facts Section */}
        <div className="flex flex-col items-center max-w-sm">
          <h2 className="text-2xl md:text-3xl mb-3" style={{
            fontFamily: '"Bangers", cursive',
            color: '#FFFACD',
            textShadow: '2px 2px 0px #A0522D, 4px 4px 0px rgba(0,0,0,0.2)',
            letterSpacing: '0.1em'
          }}>
            Fun Facts about me
          </h2>
          
          <div className="space-y-2 text-center">
            <p className="text-primary-foreground/90 text-sm md:text-base bg-foreground/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary-foreground/20">
              I take money to buy an Airavat bus ticket and go in an APSRTC bus 😂
            </p>
            <p className="text-primary-foreground/90 text-sm md:text-base bg-foreground/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary-foreground/20">
              i don't have ==D but i want  ({'{}'})
            </p>
            <p className="text-primary-foreground/90 text-sm md:text-base bg-foreground/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary-foreground/20">
              i do vaddi vyaparam, but no one pays my money back :( 
            </p>
            <p className="text-primary-foreground/90 text-sm md:text-base bg-foreground/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary-foreground/20">
              (.) (.) i like milk :) 🥛
            </p>
            <p className="text-primary-foreground/90 text-sm md:text-base bg-foreground/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary-foreground/20">
              btw north indian girls like krishna name {'<3'}
            </p>
          </div>
        </div>
        
        {/* Click to see rizz + Footer */}
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={handleShowRizz} 
            className="bg-pink-500 hover:bg-pink-600 animate-pulse backdrop-blur-sm rounded-2xl px-8 py-4 border border-pink-400/50 shadow-lg transition-colors active:scale-95"
          >
            <span className="text-white text-lg md:text-xl font-bold">
              Click here to see my rizz 🥰
            </span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-primary-foreground/80 text-sm md:text-base font-medium">Powered by</span>
            <div className="bg-yellow-400 px-3 py-1 rounded-md">
              <span className="text-white text-sm md:text-base font-bold">Rapido</span>
            </div>
          </div>
          <p className="text-primary-foreground/70 text-sm md:text-base font-medium animate-blink-bounce">
            🔊 <WaveText text="Turn up your volume for the best experience" />
          </p>
        </div>
      </div>
    );
  }

  // Phase 2: Rizz Scene - ISOLATED COMPONENT
  return <RizzScene onStart={handleStartGame} />;
});

WelcomeScreen.displayName = 'WelcomeScreen';
export default WelcomeScreen;
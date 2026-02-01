import { useState, useEffect, memo } from 'react';
import KPCharacter from './KPCharacter';
import WaveText from './WaveText';
import qtGirlImage from '@/assets/qt-girl.jpg';
import { playRizz, stopRizz, preloadAllAudio } from '@/lib/audioManager';

// Preload images for later screens
import hondaAmazeImg from '@/assets/honda-amaze.jpg';
import cementBagsImg from '@/assets/cement-bags.jpg';
import hondaAmaze from '@/assets/honda-amaze-car.jpg';
import pugDog from '@/assets/pug-dog.webp';
import pugMemorial from '@/assets/pug-memorial.jpg';
import pugGrave from '@/assets/pug-grave.jpg';
interface WelcomeScreenProps {
  onStart: () => void;
}
const WelcomeScreen = memo(({
  onStart
}: WelcomeScreenProps) => {
  const [showRizzScene, setShowRizzScene] = useState(false);

  // Preload audio on mount - images deferred for faster initial load
  useEffect(() => {
    // Preload all audio (critical for instant playback)
    preloadAllAudio();

    // Delay image preloading by 500ms to prioritize audio loading
    const imageTimer = setTimeout(() => {
      const images = [hondaAmazeImg, cementBagsImg, hondaAmaze, pugDog, pugMemorial, pugGrave, qtGirlImage];
      images.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }, 500);

    // kpfall.mp4 removed from eager loading - will lazy load when needed
    // This significantly speeds up initial page load on mobile Safari

    return () => clearTimeout(imageTimer);
  }, []);
  const handleShowRizz = () => {
    // CRITICAL: Play audio FIRST, synchronously in user gesture context
    // This must happen before any state updates to preserve user gesture
    playRizz();

    // Then update state (React batches this anyway)
    setShowRizzScene(true);
  };
  const handleStartGame = () => {
    // Stop Music 1 via audio manager
    stopRizz();
    // Call onStart (which triggers Music 2 in parent)
    onStart();
  };

  // Phase 1: Initial Welcome Screen
  if (!showRizzScene) {
    return <div className="relative min-h-screen min-h-[100dvh] game-gradient flex flex-col items-center justify-center px-4 py-4 overflow-hidden gap-3">
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
          <button onClick={handleShowRizz} className="bg-pink-500 backdrop-blur-sm rounded-2xl px-8 py-4 border border-pink-400/50 animate-pulse shadow-lg cursor-pointer hover:bg-pink-600 transition-colors active:scale-95">
            <span className="text-white text-lg md:text-xl font-bold">
              Click here to see my rizz 🥰 
            </span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-primary-foreground/80 text-sm md:text-base font-medium">Powered by</span>
            <div className="bg-yellow-400 px-3 py-1 rounded-md">
              <span className="text-white text-sm md:text-base font-black tracking-wide" style={{ fontFamily: '"Bangers", cursive' }}>Rapido</span>
            </div>
          </div>
        <p className="text-primary-foreground/70 text-sm md:text-base font-medium animate-blink-bounce">
          🔊 <WaveText text="Turn up your volume for the best experience" />
        </p>
        </div>
      </div>;
  }

  // Phase 2: Rizz Scene
  return <div className="relative min-h-screen min-h-[100dvh] game-gradient flex flex-col items-center justify-center px-4 py-4 overflow-hidden">
      {/* Version number - bottom left */}
      <div className="absolute bottom-24 left-4">
        <span className="text-white text-xs font-medium">version - 8008.69</span>
      </div>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground text-shadow-game mb-6 animate-fade-in">
        KP's Rizz Attempt 💀
      </h2>

      {/* Character Scene */}
      <div className="flex items-start justify-center gap-6 md:gap-12 mb-6">
        {/* KP Side */}
        <div className="flex flex-col items-center animate-fade-in" style={{
        animationDelay: '0.2s'
      }}>
          {/* Name Badge */}
          <div className="bg-blue-500 px-4 py-1.5 rounded-lg mb-3 shadow-lg">
            <span className="text-white font-bold text-sm md:text-base font-sans">kp</span>
          </div>
          
          {/* KP Character */}
          <KPCharacter scale={0.7} isHappy={true} happiness={90} />
          
          {/* Speech Bubble */}
          <div className="relative bg-white rounded-xl px-4 py-3 mt-4 shadow-lg max-w-[160px] animate-speech-bubble" style={{
          animationDelay: '0.5s'
        }}>
            {/* Bubble tail pointing up */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white" />
            <p className="text-gray-800 text-xs md:text-sm font-medium text-center italic">
              my name is bava, nuvvu okkasari rava
            </p>
          </div>
        </div>

        {/* QT Side */}
        <div className="flex flex-col items-center animate-fade-in" style={{
        animationDelay: '0.4s'
      }}>
          {/* Name Badge */}
          <div className="bg-pink-500 px-4 py-1.5 rounded-lg mb-3 shadow-lg">
            <span className="text-white font-bold text-sm md:text-base font-mono">​qt</span>
          </div>
          
          {/* QT Character - Image */}
          <img src={qtGirlImage} alt="QT" className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-pink-300 shadow-lg" />
          
          {/* Speech Bubble - angry response */}
          <div className="relative bg-white rounded-xl px-4 py-3 mt-4 shadow-lg animate-speech-bubble" style={{
          animationDelay: '0.8s'
        }}>
            {/* Bubble tail pointing up */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white" />
            <p className="text-2xl md:text-3xl text-center">
              😡🤬
            </p>
          </div>
        </div>
      </div>

      {/* Tap to start + Footer */}
      <div className="flex flex-col items-center gap-2 animate-fade-in" style={{
      animationDelay: '1.2s'
    }}>
        <button onClick={handleStartGame} className="bg-green-500 backdrop-blur-sm rounded-2xl px-8 py-4 border border-green-400/50 animate-pulse shadow-lg cursor-pointer hover:bg-green-600 transition-colors active:scale-95">
          <span className="text-white text-lg md:text-xl font-bold">
            👆 Tap to start the game
          </span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-primary-foreground/80 text-sm md:text-base font-medium">Powered by</span>
          <div className="bg-yellow-400 px-3 py-1 rounded-md">
            <span className="text-white text-sm md:text-base font-black tracking-wide" style={{ fontFamily: '"Bangers", cursive' }}>Rapido</span>
          </div>
        </div>
        <p className="text-primary-foreground/70 text-xs md:text-sm font-medium">
          🔊 <WaveText text="Turn up your volume for the best experience" />
        </p>
      </div>
    </div>;
});
WelcomeScreen.displayName = 'WelcomeScreen';
export default WelcomeScreen;
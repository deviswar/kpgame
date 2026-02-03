import { useState, memo, useCallback, useEffect } from 'react';
import KPCharacter from './KPCharacter';
import WaveText from './WaveText';
import DebugPanel from './DebugPanel';
import { publicAssetUrl } from '@/lib/assetUrl';
import { playRizz, getRizzStatus } from '@/lib/audioManager';
import { debug } from '@/lib/debug';

// Single stable source: public folder (no hashing issues on Vercel)
const qtGirlImage = publicAssetUrl('qt-girl.jpg');
interface RizzSceneProps {
  onStart: () => void;
}

/**
 * ISOLATED RIZZ SCENE COMPONENT
 * 
 * This component is intentionally isolated to prevent any code changes
 * from accidentally affecting the rizz scene audio logic.
 * 
 * The rizz audio is managed by the parent (WelcomeScreen) which:
 * - Starts rizz audio BEFORE mounting this component
 * - Stops rizz audio via stopRizz() when onStart is called
 */
const RizzScene = memo(({ onStart }: RizzSceneProps) => {
  const [qtImageError, setQtImageError] = useState(false);
  const [showRetrySound, setShowRetrySound] = useState(false);

  // Handle image error
  const handleImageError = useCallback(() => {
    debug.error('❌ QT image failed to load');
    setQtImageError(true);
  }, []);

  // Retry sound handler for when audio fails
  const handleRetrySound = useCallback(() => {
    playRizz();
    // Check status after a short delay
    setTimeout(() => {
      const status = getRizzStatus();
      if (status.isPlaying) {
        setShowRetrySound(false);
      }
    }, 500);
  }, []);

  // Check if sound failed after mount
  useEffect(() => {
    const checkSound = setTimeout(() => {
      const status = getRizzStatus();
      if (!status.isPlaying && status.lastError) {
        setShowRetrySound(true);
      }
    }, 1000);
    return () => clearTimeout(checkSound);
  }, []);

  return (
    <div className="relative min-h-screen min-h-[100dvh] game-gradient flex flex-col items-center justify-center px-4 py-4 overflow-hidden">
      {/* Debug Panel - only visible with ?debug=1 */}
      <DebugPanel />

      {/* Retry Sound Button - shows if audio failed */}
      {showRetrySound && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleRetrySound}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold animate-pulse shadow-lg"
          >
            🔊 Tap to enable sound
          </button>
        </div>
      )}

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
          
          {/* QT Character - stable public URL */}
          {qtImageError ? (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-pink-300 shadow-lg bg-pink-200 flex items-center justify-center">
              <span className="text-4xl md:text-5xl">👩</span>
            </div>
          ) : (
            <img 
              src={qtGirlImage} 
              alt="QT" 
              className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-pink-300 shadow-lg"
              onError={handleImageError}
              onLoad={() => debug.log('✅ QT image loaded')}
            />
          )}
          
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
        <button 
          onClick={onStart} 
          className="bg-green-500 backdrop-blur-sm rounded-2xl px-8 py-4 border border-green-400/50 animate-pulse shadow-lg cursor-pointer hover:bg-green-600 transition-colors active:scale-95"
        >
          <span className="text-white text-lg md:text-xl font-bold">
            👆 Tap to start the game
          </span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-primary-foreground/80 text-sm md:text-base font-medium">Powered by</span>
          <div className="bg-yellow-400 px-3 py-1 rounded-md">
            <span className="text-white text-sm md:text-base font-bold">Rapido</span>
          </div>
        </div>
        <p className="text-primary-foreground/70 text-xs md:text-sm font-medium">
          🔊 <WaveText text="Turn up your volume for the best experience" />
        </p>
      </div>
    </div>
  );
});

RizzScene.displayName = 'RizzScene';
export default RizzScene;

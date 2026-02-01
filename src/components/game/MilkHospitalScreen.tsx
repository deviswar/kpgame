import { useState, useEffect } from 'react';
import KPCharacter from './KPCharacter';
import hondaAmaze from '@/assets/honda-amaze-car.jpg';
import pugDog from '@/assets/pug-dog.webp';
import roseMilkBanner from '@/assets/rose-milk-banner.jpg';
import villageMilkBanner from '@/assets/village-milk-banner.jpg';
import pugMemorial from '@/assets/pug-memorial.jpg';
import pugGrave from '@/assets/pug-grave.jpg';
import { preloadMourningMusic } from '@/lib/audioManager';

// Preload images helper
const preloadImage = (src: string): Promise<void> => {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
};
interface MilkHospitalScreenProps {
  onComplete: () => void;
  onStartMourningMusic?: () => void;
}
type Phase = 'hospital' | 'kp-exit' | 'popup' | 'enter-car' | 'driving' | 'dog-appears' | 'crash' | 'aftermath' | 'mourning';
const MilkHospitalScreen = ({
  onComplete,
  onStartMourningMusic
}: MilkHospitalScreenProps) => {
  const [phase, setPhase] = useState<Phase>('hospital');
  const [showBuilding, setShowBuilding] = useState(false);
  const [showCrashText, setShowCrashText] = useState(false);
  const [showMourningFlash, setShowMourningFlash] = useState(false);
  const [waitingForUserTap, setWaitingForUserTap] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload mourning music AND images on mount so they're ready for instant playback
  useEffect(() => {
    const loadAssets = async () => {
      // Preload mourning audio immediately (primes it for instant playback)
      preloadMourningMusic();

      // Preload mourning images
      await Promise.all([preloadImage(pugMemorial), preloadImage(pugGrave)]);
      setImagesLoaded(true);
    };
    loadAssets();
  }, []);

  // Handler for the hospital button - user tap triggers mourning music (works on mobile!)
  const handleTakePuppyToHospital = () => {
    // Parent handles all audio (stops Music 1, starts Music 2)
    onStartMourningMusic?.();

    // Go to mourning phase
    setPhase('mourning');
    setWaitingForUserTap(false);

    // Trigger flashes - 8 total flashes
    setShowMourningFlash(true);
    setTimeout(() => setShowMourningFlash(false), 150);
    setTimeout(() => setShowMourningFlash(true), 300);
    setTimeout(() => setShowMourningFlash(false), 450);
    setTimeout(() => setShowMourningFlash(true), 600);
    setTimeout(() => setShowMourningFlash(false), 750);
    setTimeout(() => setShowMourningFlash(true), 900);
    setTimeout(() => setShowMourningFlash(false), 1050);
    setTimeout(() => setShowMourningFlash(true), 1200);
    setTimeout(() => setShowMourningFlash(false), 1350);
    setTimeout(() => setShowMourningFlash(true), 1500);
    setTimeout(() => setShowMourningFlash(false), 1650);
    setTimeout(() => setShowMourningFlash(true), 1800);
    setTimeout(() => setShowMourningFlash(false), 1950);
    setTimeout(() => setShowMourningFlash(true), 2100);
    setTimeout(() => setShowMourningFlash(false), 2250);

    // Complete after mourning duration (extended by 1.3s: 10000 + 1300 = 11300)
    setTimeout(() => onComplete(), 11300);
  };
  useEffect(() => {
    // Phase timing
    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Building fades in
    timers.push(setTimeout(() => setShowBuilding(true), 100));

    // Phase 2: KP exits hospital (walks to left side)
    timers.push(setTimeout(() => setPhase('kp-exit'), 2000));

    // Phase 3: Energy popup (on right side while KP is on left)
    timers.push(setTimeout(() => setPhase('popup'), 4500));

    // Phase 4: KP goes to car
    timers.push(setTimeout(() => setPhase('enter-car'), 9500));

    // Phase 5: Driving - car starts moving
    timers.push(setTimeout(() => setPhase('driving'), 11500));

    // Phase 6: Dog appears
    timers.push(setTimeout(() => setPhase('dog-appears'), 15000));

    // Phase 7: Crash
    timers.push(setTimeout(() => {
      setPhase('crash');
      setShowCrashText(true);
    }, 19000));

    // Phase 8: Aftermath - show button and WAIT for user tap
    timers.push(setTimeout(() => {
      setPhase('aftermath');
      setWaitingForUserTap(true);
    }, 21000));

    // NO automatic mourning phase - user must tap the button!

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [onComplete, onStartMourningMusic]);
  const isHospitalScene = ['hospital', 'kp-exit', 'popup', 'enter-car'].includes(phase);
  const isRoadScene = ['driving', 'dog-appears', 'crash', 'aftermath'].includes(phase);
  const isMourningScene = phase === 'mourning';
  return <div className={`h-screen h-[100dvh] overflow-hidden relative ${phase === 'crash' ? 'animate-screen-shake' : ''}`}>
      {/* Hospital Scene */}
      {isHospitalScene && <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900">
          {/* Stars background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 50}%`,
          animationDelay: `${Math.random() * 2}s`
        }} />)}
          </div>

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-800 to-gray-700" />

          {/* Hospital Building - positioned higher */}
          <div className={`absolute top-1/4 md:top-1/5 left-1/2 -translate-x-1/2 transition-all duration-1000 ${showBuilding ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {/* Main Building - smaller */}
            <div className="relative">
              {/* Roof - smaller */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-40 h-6 bg-gradient-to-b from-red-700 to-red-800 rounded-t-xl shadow-lg" />
              
              {/* MILK HOSPITAL Sign */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 px-3 py-1.5 rounded-lg shadow-xl border-3 border-green-400">
                <span className="text-white font-bold text-xs md:text-base tracking-wide whitespace-nowrap">🏥 MILK HOSPITAL 🥛</span>
              </div>

              {/* Building Body - smaller */}
              <div className="w-36 h-32 bg-gradient-to-b from-white to-gray-100 rounded-t-lg shadow-2xl border-4 border-gray-300">
                {/* Red Cross */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2">
                  <div className="w-6 h-6 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1.5 bg-red-600 rounded -translate-y-1/2" />
                    <div className="absolute left-1/2 top-0 w-1.5 h-full bg-red-600 rounded -translate-x-1/2" />
                  </div>
                </div>

                {/* Windows */}
                <div className="flex justify-center gap-3 mt-11">
                  <div className="w-6 h-8 bg-blue-300 rounded border-2 border-gray-400 shadow-inner" />
                  <div className="w-6 h-8 bg-blue-300 rounded border-2 border-gray-400 shadow-inner" />
                </div>

                {/* Door */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-lg border-3 border-amber-600">
                  <div className="absolute top-1/2 right-1.5 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                </div>
              </div>

              {/* Left Banner - Rose Milk (real image) - BIGGER, same size */}
              <div className="absolute -left-32 md:-left-44 top-0 w-28 h-40 md:w-36 md:h-52 rounded-lg shadow-lg transform -rotate-3 overflow-hidden border-2 border-white">
                <img src={roseMilkBanner} alt="Gomatha Village Rose Milk" className="w-full h-full object-cover" />
              </div>

              {/* Right Banner - Village Milk (real image) - BIGGER, same size */}
              <div className="absolute -right-32 md:-right-44 top-0 w-28 h-40 md:w-36 md:h-52 rounded-lg shadow-lg transform rotate-3 overflow-hidden border-2 border-white">
                <img src={villageMilkBanner} alt="గోమాత పల్లె పాలు Village Raw Milk" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* KP Character exiting from door - moves to LEFT side */}
          {(phase === 'kp-exit' || phase === 'popup' || phase === 'enter-car') && <div className={`absolute transition-all duration-1000 ease-out ${phase === 'kp-exit' ? 'top-[52%] left-[25%]' : phase === 'popup' ? 'top-[58%] left-[25%]' : 'top-[60%] left-[65%] scale-75 opacity-0'}`}>
              <KPCharacter scale={0.7} isHappy={true} happiness={100} />
            </div>}

          {/* Energy Popup - positioned on RIGHT side */}
          {phase === 'popup' && <div className="absolute top-[48%] right-[12%] animate-energy-popup z-10">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-3 rounded-xl shadow-lg border-3 border-green-300">
                <div className="text-center">
                  <span className="text-2xl">🥛</span>
                  <p className="text-white font-bold text-base mt-1">Drank milk!</p>
                  <p className="text-yellow-200 font-bold text-sm">⚡ Energy Boosted! ⚡</p>
                </div>
              </div>
            </div>}

          {/* Honda Amaze Car */}
          {phase === 'enter-car' && <div className="absolute bottom-20 right-8 w-32 md:w-40">
              <img src={hondaAmaze} alt="Honda Amaze" className="w-full h-auto drop-shadow-2xl animate-bounce-soft" />
            </div>}
        </div>}

      {/* Road Scene */}
      {isRoadScene && <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200">
          {/* Clouds */}
          <div className="absolute top-8 left-8 text-4xl opacity-80">☁️</div>
          <div className="absolute top-16 right-16 text-5xl opacity-70">☁️</div>
          <div className="absolute top-4 left-1/3 text-3xl opacity-60">☁️</div>

          {/* Sun */}
          <div className="absolute top-4 right-4 text-5xl">☀️</div>

          {/* Trees background */}
          <div className="absolute bottom-32 left-0 right-0 flex justify-around">
            {['🌳', '🌲', '🌳', '🌲', '🌳'].map((tree, i) => <span key={i} className="text-4xl md:text-5xl opacity-70">{tree}</span>)}
          </div>

          {/* Road */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-600 to-gray-700">
            {/* Road Lines */}
            <div className="absolute top-1/2 left-0 right-0 flex justify-around -translate-y-1/2">
              {[...Array(8)].map((_, i) => <div key={i} className="w-12 h-2 bg-yellow-400" />)}
            </div>
          </div>

          {/* Honda Amaze Car Driving */}
          <div className={`absolute bottom-16 w-32 md:w-40 ${phase === 'driving' ? 'animate-car-drive-continuous' : phase === 'dog-appears' ? 'animate-car-drive-to-crash-smooth' : phase === 'crash' ? 'left-[42%] animate-car-crash-smooth' : 'left-[42%]'}`}>
            <img src={hondaAmaze} alt="Honda Amaze" className="w-full h-auto drop-shadow-xl" />
          </div>

          {/* Pug Dog - bigger size matching car */}
          {(phase === 'dog-appears' || phase === 'crash' || phase === 'aftermath') && <div className={`absolute bottom-16 w-28 md:w-36 ${phase === 'dog-appears' ? 'animate-dog-walk-to-crash-smooth' : phase === 'crash' ? 'left-[52%] animate-dog-hit-smooth' : 'left-[75%] rotate-180 opacity-50'}`}>
              <img src={pugDog} alt="Pug Dog" className="w-full h-auto drop-shadow-xl transform -scale-x-100" />
            </div>}

          {/* Crash Effects - Impact Flash only during crash */}
          {phase === 'crash' && <div className="absolute inset-0 bg-white animate-hit-flash pointer-events-none" />}

          {/* BONK and Oops Text - stays visible after crash */}
          {showCrashText && <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center z-50">
              <div className="animate-energy-popup">
                <span className="text-5xl md:text-7xl font-bold text-red-600 text-shadow-game block">
                  💥 BONK! 💥
                </span>
              </div>
              <div className="mt-4">
                <span className="text-4xl md:text-5xl">😱</span>
                <p className="text-red-600 font-bold text-xl md:text-2xl mt-2 text-shadow-game">
                  Oops...
                </p>
              </div>
              
              {/* Stars */}
              <div className="relative mt-4">
                {['⭐', '💫', '✨', '⭐', '💫'].map((star, i) => <span key={i} className="inline-block text-2xl md:text-3xl mx-1 animate-bounce" style={{
            animationDelay: `${i * 0.1}s`
          }}>
                    {star}
                  </span>)}
              </div>

              {/* Hospital Button - requires user tap to proceed (fixes mobile audio!) */}
              {phase === 'aftermath' && waitingForUserTap && <button onClick={handleTakePuppyToHospital} className="mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-lg md:text-xl px-6 rounded-2xl shadow-2xl border-4 border-red-400 animate-pulse active:scale-95 transition-transform py-px">
                  OMG puppy 😭 Touch 👆 to take puppy to the hospital 🏥   
                </button>}
            </div>}
        </div>}

      {/* Mourning Scene */}
      {isMourningScene && <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600 flex flex-col items-center justify-center gap-4 py-4 animate-fade-in">
          {/* 3x Flash Overlay */}
          {showMourningFlash && <div className="absolute inset-0 bg-white/70 z-50 pointer-events-none" />}
          
          {/* Top - Pug Memorial Photo - BIGGER */}
          {imagesLoaded && <div className="w-56 md:w-72 rounded-xl overflow-hidden shadow-2xl border-4 border-amber-600 animate-scale-in">
              <img src={pugMemorial} alt="Pug Memorial" className="w-full h-auto" loading="eager" />
            </div>}
          
          {/* Center - KP Crying */}
          <div className="flex flex-col items-center">
            <KPCharacter scale={1} isCrying={true} isHappy={false} happiness={0} />
            <p className="text-white text-xl font-bold mt-2">Sorry... 😢</p>
          </div>
          
          {/* Bottom - Pug Grave - BIGGER */}
          {imagesLoaded && <div className="w-64 md:w-80 rounded-xl overflow-hidden shadow-2xl animate-scale-in">
              <img src={pugGrave} alt="Pug Grave" className="w-full h-auto" loading="eager" />
            </div>}
          
          {/* Loading dots - hint that there's more */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 items-center">
            <span className="w-3 h-3 rounded-full animate-pulse" style={{
              animation: 'pulse 1.2s ease-in-out infinite',
              background: 'linear-gradient(135deg, #ffffff 0%, #9ca3af 100%)',
              animationDelay: '0s'
            }} />
            <span className="w-3 h-3 rounded-full animate-pulse" style={{
              animation: 'pulse 1.2s ease-in-out infinite',
              background: 'linear-gradient(135deg, #9ca3af 0%, #ffffff 100%)',
              animationDelay: '0.4s'
            }} />
            <span className="w-3 h-3 rounded-full animate-pulse" style={{
              animation: 'pulse 1.2s ease-in-out infinite',
              background: 'linear-gradient(135deg, #ffffff 0%, #9ca3af 100%)',
              animationDelay: '0.8s'
            }} />
          </div>
        </div>}
    </div>;
};
export default MilkHospitalScreen;
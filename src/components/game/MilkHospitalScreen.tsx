import { useState, useEffect, useRef } from 'react';
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
  return new Promise((resolve) => {
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

const MilkHospitalScreen = ({ onComplete, onStartMourningMusic }: MilkHospitalScreenProps) => {
  const [phase, setPhase] = useState<Phase>('hospital');
  const [showBuilding, setShowBuilding] = useState(false);
  const [showCrashText, setShowCrashText] = useState(false);
  const [showMourningFlash, setShowMourningFlash] = useState(false);
  const [waitingForUserTap, setWaitingForUserTap] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  
  // Track all timers for cleanup
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  // Handle image errors
  const handleImageError = (imageName: string) => {
    setImageErrors(prev => ({ ...prev, [imageName]: true }));
  };

  // Preload mourning music AND images on mount
  useEffect(() => {
    const loadAssets = async () => {
      preloadMourningMusic();
      
      await Promise.all([
        preloadImage(pugMemorial),
        preloadImage(pugGrave)
      ]);
      setImagesLoaded(true);
    };
    loadAssets();
  }, []);

  // Handler for the hospital button
  const handleTakePuppyToHospital = () => {
    onStartMourningMusic?.();
    
    setPhase('mourning');
    setWaitingForUserTap(false);
    
    // Trigger flashes
    const flashTimings = [0, 300, 600, 900, 1200, 1500, 1800, 2100];
    flashTimings.forEach((delay, i) => {
      const onTimer = setTimeout(() => setShowMourningFlash(true), delay);
      const offTimer = setTimeout(() => setShowMourningFlash(false), delay + 150);
      timersRef.current.push(onTimer, offTimer);
    });
    
    // Complete after mourning duration
    const completeTimer = setTimeout(() => onComplete(), 11300);
    timersRef.current.push(completeTimer);
  };

  useEffect(() => {
    // Phase 1: Building fades in
    const t1 = setTimeout(() => setShowBuilding(true), 100);
    timersRef.current.push(t1);
    
    // Phase 2: KP exits hospital
    const t2 = setTimeout(() => setPhase('kp-exit'), 2000);
    timersRef.current.push(t2);
    
    // Phase 3: Energy popup
    const t3 = setTimeout(() => setPhase('popup'), 4500);
    timersRef.current.push(t3);
    
    // Phase 4: KP goes to car
    const t4 = setTimeout(() => setPhase('enter-car'), 8500);
    timersRef.current.push(t4);
    
    // Phase 5: Driving
    const t5 = setTimeout(() => setPhase('driving'), 10500);
    timersRef.current.push(t5);
    
    // Phase 6: Dog appears
    const t6 = setTimeout(() => setPhase('dog-appears'), 14000);
    timersRef.current.push(t6);
    
    // Phase 7: Crash
    const t7 = setTimeout(() => {
      setPhase('crash');
      setShowCrashText(true);
    }, 18000);
    timersRef.current.push(t7);
    
    // Phase 8: Aftermath
    const t8 = setTimeout(() => {
      setPhase('aftermath');
      setWaitingForUserTap(true);
    }, 20000);
    timersRef.current.push(t8);

    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, [onComplete, onStartMourningMusic]);

  const isHospitalScene = ['hospital', 'kp-exit', 'popup', 'enter-car'].includes(phase);
  const isRoadScene = ['driving', 'dog-appears', 'crash', 'aftermath'].includes(phase);
  const isMourningScene = phase === 'mourning';

  return (
    <div className={`h-screen h-[100dvh] overflow-hidden relative ${phase === 'crash' ? 'animate-screen-shake' : ''}`}>
      {/* Hospital Scene */}
      {isHospitalScene && (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900">
          {/* Stars background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-800 to-gray-700" />

          {/* Hospital Building */}
          <div 
            className={`absolute top-1/4 md:top-1/5 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
              showBuilding ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="relative">
              {/* Roof */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-40 h-6 bg-gradient-to-b from-red-700 to-red-800 rounded-t-xl shadow-lg" />
              
              {/* MILK HOSPITAL Sign */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 px-3 py-1.5 rounded-lg shadow-xl border-3 border-green-400">
                <span className="text-white font-bold text-xs md:text-base tracking-wide whitespace-nowrap">🏥 MILK HOSPITAL 🥛</span>
              </div>

              {/* Building Body */}
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

              {/* Left Banner - Rose Milk */}
              {!imageErrors['roseMilk'] && (
                <div className="absolute -left-32 md:-left-44 top-0 w-28 h-40 md:w-36 md:h-52 rounded-lg shadow-lg transform -rotate-3 overflow-hidden border-2 border-white">
                  <img 
                    src={roseMilkBanner} 
                    alt="Gomatha Village Rose Milk"
                    className="w-full h-full object-cover"
                    onError={() => handleImageError('roseMilk')}
                  />
                </div>
              )}

              {/* Right Banner - Village Milk */}
              {!imageErrors['villageMilk'] && (
                <div className="absolute -right-32 md:-right-44 top-0 w-28 h-40 md:w-36 md:h-52 rounded-lg shadow-lg transform rotate-3 overflow-hidden border-2 border-white">
                  <img 
                    src={villageMilkBanner} 
                    alt="గోమాత పల్లె పాలు Village Raw Milk"
                    className="w-full h-full object-cover"
                    onError={() => handleImageError('villageMilk')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* KP Character exiting from door */}
          {(phase === 'kp-exit' || phase === 'popup' || phase === 'enter-car') && (
            <div 
              className={`absolute transition-all duration-1000 ease-out ${
                phase === 'kp-exit' ? 'top-[52%] left-[25%]' :
                phase === 'popup' ? 'top-[58%] left-[25%]' :
                'top-[60%] left-[65%] scale-75 opacity-0'
              }`}
            >
              <KPCharacter scale={0.7} isHappy={true} happiness={100} />
            </div>
          )}

          {/* Energy Popup */}
          {phase === 'popup' && (
            <div className="absolute top-[50%] right-[15%] animate-energy-popup z-10">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-3 py-2 rounded-xl shadow-lg border-2 border-green-300">
                <div className="text-center">
                  <span className="text-xl">🥛</span>
                  <p className="text-white font-bold text-sm">Drank milk!</p>
                  <p className="text-yellow-200 font-bold text-xs">⚡ Energy Boosted! ⚡</p>
                </div>
              </div>
            </div>
          )}

          {/* Honda Amaze Car */}
          {phase === 'enter-car' && !imageErrors['hondaCar'] && (
            <div className="absolute bottom-20 right-8 w-32 md:w-40">
              <img 
                src={hondaAmaze} 
                alt="Honda Amaze"
                className="w-full h-auto drop-shadow-2xl animate-bounce-soft"
                onError={() => handleImageError('hondaCar')}
              />
            </div>
          )}
        </div>
      )}

      {/* Road Scene */}
      {isRoadScene && (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200">
          {/* Clouds */}
          <div className="absolute top-8 left-8 text-4xl opacity-80">☁️</div>
          <div className="absolute top-16 right-16 text-5xl opacity-70">☁️</div>
          <div className="absolute top-4 left-1/3 text-3xl opacity-60">☁️</div>

          {/* Sun */}
          <div className="absolute top-4 right-4 text-5xl">☀️</div>

          {/* Trees background */}
          <div className="absolute bottom-32 left-0 right-0 flex justify-around">
            {['🌳', '🌲', '🌳', '🌲', '🌳'].map((tree, i) => (
              <span key={i} className="text-4xl md:text-5xl opacity-70">{tree}</span>
            ))}
          </div>

          {/* Road */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-600 to-gray-700">
            {/* Road Lines */}
            <div className="absolute top-1/2 left-0 right-0 flex justify-around -translate-y-1/2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-12 h-2 bg-yellow-400" />
              ))}
            </div>
          </div>

          {/* Honda Amaze Car Driving */}
          {!imageErrors['hondaDriving'] && (
            <div 
              className={`absolute bottom-16 w-32 md:w-40 ${
                phase === 'driving' ? 'animate-car-drive-continuous' :
                phase === 'dog-appears' ? 'animate-car-drive-to-crash-smooth' :
                phase === 'crash' ? 'left-[42%] animate-car-crash-smooth' :
                'left-[42%]'
              }`}
            >
              <img 
                src={hondaAmaze} 
                alt="Honda Amaze"
                className="w-full h-auto drop-shadow-xl"
                onError={() => handleImageError('hondaDriving')}
              />
            </div>
          )}

          {/* Pug Dog */}
          {(phase === 'dog-appears' || phase === 'crash' || phase === 'aftermath') && !imageErrors['pugDog'] && (
            <div 
              className={`absolute bottom-16 w-28 md:w-36 ${
                phase === 'dog-appears' ? 'animate-dog-walk-to-crash-smooth' :
                phase === 'crash' ? 'left-[52%] animate-dog-hit-smooth' :
                'left-[75%] rotate-180 opacity-50'
              }`}
            >
              <img 
                src={pugDog} 
                alt="Pug Dog"
                className="w-full h-auto drop-shadow-xl transform -scale-x-100"
                onError={() => handleImageError('pugDog')}
              />
            </div>
          )}

          {/* Crash Effects */}
          {phase === 'crash' && (
            <div className="absolute inset-0 bg-white animate-hit-flash pointer-events-none" />
          )}

          {/* BONK and Oops Text */}
          {showCrashText && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center z-50">
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
                {['⭐', '💫', '✨', '⭐', '💫'].map((star, i) => (
                  <span 
                    key={i} 
                    className="inline-block text-2xl md:text-3xl mx-1 animate-bounce"
                    style={{
                      animationDelay: `${i * 0.1}s`
                    }}
                  >
                    {star}
                  </span>
                ))}
              </div>

              {/* Hospital Button */}
              {phase === 'aftermath' && waitingForUserTap && (
                <button
                  onClick={handleTakePuppyToHospital}
                  className="mt-6 bg-gradient-to-r from-red-600 to-red-700 
                             hover:from-red-500 hover:to-red-600
                             text-white font-bold text-lg md:text-xl 
                             px-6 py-4 rounded-2xl shadow-2xl 
                             border-4 border-red-400
                             animate-pulse
                             active:scale-95 transition-transform"
                >
                  🏥 Touch to take puppy to the hospital
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mourning Scene */}
      {isMourningScene && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600 flex flex-col items-center justify-center gap-4 py-4 animate-fade-in">
          {/* Flash Overlay */}
          {showMourningFlash && (
            <div className="absolute inset-0 bg-white/70 z-50 pointer-events-none" />
          )}
          
          {/* Top - Pug Memorial Photo */}
          {imagesLoaded && !imageErrors['pugMemorial'] && (
            <div className="w-56 md:w-72 rounded-xl overflow-hidden shadow-2xl border-4 border-amber-600 animate-scale-in">
              <img 
                src={pugMemorial} 
                alt="Pug Memorial" 
                className="w-full h-auto" 
                loading="eager"
                onError={() => handleImageError('pugMemorial')} 
              />
            </div>
          )}
          
          {/* Center - KP Crying */}
          <div className="flex flex-col items-center">
            <KPCharacter scale={1} isCrying={true} isHappy={false} happiness={0} />
            <p className="text-white text-xl font-bold mt-2">Sorry... 😢</p>
          </div>
          
          {/* Bottom - Pug Grave */}
          {imagesLoaded && !imageErrors['pugGrave'] && (
            <div className="w-64 md:w-80 rounded-xl overflow-hidden shadow-2xl animate-scale-in">
              <img 
                src={pugGrave} 
                alt="Pug Grave" 
                className="w-full h-auto" 
                loading="eager"
                onError={() => handleImageError('pugGrave')} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MilkHospitalScreen;

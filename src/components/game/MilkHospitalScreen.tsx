import { useState, useEffect } from 'react';
import KPCharacter from './KPCharacter';
import hondaAmaze from '@/assets/honda-amaze-car.jpg';
import pugDog from '@/assets/pug-dog.webp';

interface MilkHospitalScreenProps {
  onComplete: () => void;
}

type Phase = 'hospital' | 'kp-exit' | 'popup' | 'enter-car' | 'driving' | 'dog-appears' | 'crash' | 'aftermath';

const MilkHospitalScreen = ({ onComplete }: MilkHospitalScreenProps) => {
  const [phase, setPhase] = useState<Phase>('hospital');
  const [showBuilding, setShowBuilding] = useState(false);

  useEffect(() => {
    // Phase timing
    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Building fades in
    timers.push(setTimeout(() => setShowBuilding(true), 100));
    
    // Phase 2: KP exits hospital
    timers.push(setTimeout(() => setPhase('kp-exit'), 2000));
    
    // Phase 3: Energy popup
    timers.push(setTimeout(() => setPhase('popup'), 4000));
    
    // Phase 4: KP walks to car
    timers.push(setTimeout(() => setPhase('enter-car'), 6000));
    
    // Phase 5: Driving
    timers.push(setTimeout(() => setPhase('driving'), 8000));
    
    // Phase 6: Dog appears
    timers.push(setTimeout(() => setPhase('dog-appears'), 11000));
    
    // Phase 7: Crash
    timers.push(setTimeout(() => setPhase('crash'), 13000));
    
    // Phase 8: Aftermath
    timers.push(setTimeout(() => setPhase('aftermath'), 14000));
    
    // Complete
    timers.push(setTimeout(() => onComplete(), 16000));

    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  const isHospitalScene = ['hospital', 'kp-exit', 'popup', 'enter-car'].includes(phase);
  const isRoadScene = ['driving', 'dog-appears', 'crash', 'aftermath'].includes(phase);

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
            className={`absolute bottom-20 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
              showBuilding ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            {/* Main Building */}
            <div className="relative">
              {/* Roof */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-8 bg-gradient-to-b from-red-700 to-red-800 rounded-t-xl shadow-lg" />
              
              {/* MILK HOSPITAL Sign */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 rounded-lg shadow-xl border-4 border-green-400">
                <span className="text-white font-bold text-sm md:text-lg tracking-wide whitespace-nowrap">🏥 MILK HOSPITAL 🥛</span>
              </div>

              {/* Building Body */}
              <div className="w-44 h-40 bg-gradient-to-b from-white to-gray-100 rounded-t-lg shadow-2xl border-4 border-gray-300">
                {/* Red Cross */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                  <div className="w-8 h-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-2 bg-red-600 rounded -translate-y-1/2" />
                    <div className="absolute left-1/2 top-0 w-2 h-full bg-red-600 rounded -translate-x-1/2" />
                  </div>
                </div>

                {/* Windows */}
                <div className="flex justify-center gap-4 mt-14">
                  <div className="w-8 h-10 bg-blue-300 rounded border-2 border-gray-400 shadow-inner" />
                  <div className="w-8 h-10 bg-blue-300 rounded border-2 border-gray-400 shadow-inner" />
                </div>

                {/* Door */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-16 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-lg border-4 border-amber-600">
                  <div className="absolute top-1/2 right-2 w-2 h-2 bg-yellow-400 rounded-full" />
                </div>
              </div>

              {/* Left Banner */}
              <div className="absolute -left-20 top-8 w-16 h-28 bg-gradient-to-b from-pink-400 to-pink-600 rounded-lg shadow-lg transform -rotate-3 border-2 border-pink-300">
                <div className="flex flex-col items-center justify-center h-full p-1">
                  <span className="text-white text-[8px] font-bold text-center">ROSE</span>
                  <span className="text-2xl">🥛</span>
                  <span className="text-white text-[8px] font-bold text-center">MILK</span>
                </div>
              </div>

              {/* Right Banner */}
              <div className="absolute -right-20 top-8 w-16 h-28 bg-gradient-to-b from-amber-400 to-orange-500 rounded-lg shadow-lg transform rotate-3 border-2 border-amber-300">
                <div className="flex flex-col items-center justify-center h-full p-1">
                  <span className="text-white text-[8px] font-bold text-center">VILLAGE</span>
                  <span className="text-2xl">🐄</span>
                  <span className="text-white text-[8px] font-bold text-center">MILK</span>
                </div>
              </div>
            </div>
          </div>

          {/* KP Character exiting */}
          {(phase === 'kp-exit' || phase === 'popup' || phase === 'enter-car') && (
            <div 
              className={`absolute bottom-24 transition-all duration-1000 ease-out ${
                phase === 'kp-exit' ? 'left-1/2 -translate-x-1/2' :
                phase === 'popup' ? 'left-1/2 -translate-x-1/2' :
                'left-[65%] -translate-x-1/2 scale-75 opacity-0'
              }`}
            >
              <KPCharacter scale={0.5} isHappy={true} happiness={100} />
            </div>
          )}

          {/* Energy Popup */}
          {phase === 'popup' && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 animate-energy-popup">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-4 rounded-2xl shadow-2xl border-4 border-green-300">
                <div className="text-center">
                  <span className="text-3xl">🥛</span>
                  <p className="text-white font-bold text-lg md:text-xl mt-1">Drank milk!</p>
                  <p className="text-yellow-200 font-bold text-sm md:text-base">⚡ Energy Boosted! ⚡</p>
                  <p className="text-white font-bold text-lg">+100% 💪</p>
                </div>
              </div>
            </div>
          )}

          {/* Honda Amaze Car */}
          {phase === 'enter-car' && (
            <div className="absolute bottom-20 right-8 w-32 md:w-40">
              <img 
                src={hondaAmaze} 
                alt="Honda Amaze"
                className="w-full h-auto drop-shadow-2xl animate-bounce-soft"
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
          <div 
            className={`absolute bottom-16 w-32 md:w-40 transition-all ${
              phase === 'driving' ? 'animate-car-drive' :
              phase === 'dog-appears' ? 'left-[30%]' :
              phase === 'crash' ? 'left-[35%] animate-car-crash' :
              'left-[35%]'
            }`}
            style={{ '--car-x': '35%' } as React.CSSProperties}
          >
            <img 
              src={hondaAmaze} 
              alt="Honda Amaze"
              className="w-full h-auto drop-shadow-xl"
            />
          </div>

          {/* Pug Dog */}
          {(phase === 'dog-appears' || phase === 'crash' || phase === 'aftermath') && (
            <div 
              className={`absolute bottom-20 w-20 md:w-24 ${
                phase === 'dog-appears' ? 'animate-dog-walk' :
                phase === 'crash' ? 'animate-dog-hit' :
                'left-[70%] rotate-180 opacity-50'
              }`}
            >
              <img 
                src={pugDog} 
                alt="Pug Dog"
                className="w-full h-auto drop-shadow-lg"
              />
            </div>
          )}

          {/* Crash Effects */}
          {phase === 'crash' && (
            <>
              {/* Impact Flash */}
              <div className="absolute inset-0 bg-white animate-hit-flash pointer-events-none" />
              
              {/* BONK Text */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 animate-energy-popup">
                <span className="text-6xl md:text-8xl font-bold text-red-600 text-shadow-game">
                  💥 BONK! 💥
                </span>
              </div>

              {/* Stars */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {['⭐', '💫', '✨', '⭐', '💫'].map((star, i) => (
                  <span 
                    key={i} 
                    className="absolute text-3xl animate-confetti"
                    style={{
                      left: `${(i - 2) * 30}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  >
                    {star}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Aftermath */}
          {phase === 'aftermath' && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center">
              <span className="text-5xl md:text-6xl">😱</span>
              <p className="text-red-600 font-bold text-xl md:text-2xl mt-2 text-shadow-game">
                Oops...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MilkHospitalScreen;

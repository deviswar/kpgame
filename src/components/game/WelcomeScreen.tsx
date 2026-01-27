import { useState } from 'react';
import KPCharacter from './KPCharacter';
import QTCharacter from './QTCharacter';
interface WelcomeScreenProps {
  onStart: () => void;
}
const WelcomeScreen = ({
  onStart
}: WelcomeScreenProps) => {
  const [showRizzScene, setShowRizzScene] = useState(false);

  // Phase 1: Initial Welcome Screen
  if (!showRizzScene) {
    return <div className="relative min-h-screen min-h-[100dvh] game-gradient flex flex-col items-center justify-center px-4 py-4 overflow-hidden gap-3">
        {/* Version number - bottom left */}
        <div className="absolute bottom-24 left-4">
          <span className="text-white text-xs font-medium">version - 1.69.69</span>
        </div>

        {/* Header with title and KP */}
        <div className="flex items-center gap-2 -mt-48">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground text-shadow-game tracking-wider">
            KP Game
          </h1>
          <div className="scale-75 origin-center -my-8">
            <KPCharacter scale={0.8} isHappy={false} happiness={50} />
          </div>
        </div>

        {/* Fun Facts Section */}
        <div className="flex flex-col items-center max-w-sm">
          <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-2 text-shadow-game">
            Fun Facts about me
          </h2>
          
          <div className="space-y-1.5 text-center">
            <p className="text-primary-foreground/90 text-xs md:text-sm bg-foreground/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-primary-foreground/20">
              I take money to buy an Airavat bus ticket and go in an APSRTC bus 😂
            </p>
            <p className="text-primary-foreground/90 text-xs md:text-sm bg-foreground/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-primary-foreground/20">
              i dont have ==D but i want  ({'{}'})
            </p>
            <p className="text-primary-foreground/90 text-xs md:text-sm bg-foreground/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-primary-foreground/20">
              i do vaddi vyaparam, but no one pays my money back :( 💸
            </p>
            <p className="text-primary-foreground/90 text-xs md:text-sm bg-foreground/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-primary-foreground/20">
              (.) (.) i like milk :) 🥛
            </p>
            <p className="text-primary-foreground/90 text-xs md:text-sm bg-foreground/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-primary-foreground/20">
              btw north indian girls like krishna name {'<3'}
            </p>
          </div>
        </div>
        
        {/* Click to see rizz + Footer */}
        <div className="flex flex-col items-center gap-2">
          <button onClick={() => setShowRizzScene(true)} className="bg-pink-500 backdrop-blur-sm rounded-2xl px-8 py-4 border border-pink-400/50 animate-pulse shadow-lg cursor-pointer hover:bg-pink-600 transition-colors active:scale-95">
            <span className="text-white text-lg md:text-xl font-bold">
              Click here to see my rizz 🥰 
            </span>
          </button>
          <p className="text-primary-foreground/80 text-xs md:text-sm font-medium">
            Powered by <span className="text-yellow-400 font-bold">Rapido</span>
          </p>
          <p className="text-primary-foreground/70 text-xs md:text-sm font-medium animate-blink-bounce">
            🔊 Turn your volume up for the best experience
          </p>
        </div>
      </div>;
  }

  // Phase 2: Rizz Scene
  return <div className="relative min-h-screen min-h-[100dvh] game-gradient flex flex-col items-center justify-center px-4 py-4 overflow-hidden">
      {/* Version number - bottom left */}
      <div className="absolute bottom-24 left-4">
        <span className="text-white text-xs font-medium">version - 1.69.69</span>
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
            <span className="text-white font-bold text-sm md:text-base">KP</span>
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
              "my name is bava, nuvvu okkasari rava"
            </p>
          </div>
        </div>

        {/* QT Side */}
        <div className="flex flex-col items-center animate-fade-in" style={{
        animationDelay: '0.4s'
      }}>
          {/* Name Badge */}
          <div className="bg-pink-500 px-4 py-1.5 rounded-lg mb-3 shadow-lg">
            <span className="text-white font-bold text-sm md:text-base">QT</span>
          </div>
          
          {/* QT Character */}
          <QTCharacter scale={0.7} isAngry={true} />
          
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
        <button onClick={onStart} className="bg-green-500 backdrop-blur-sm rounded-2xl px-8 py-4 border border-green-400/50 animate-pulse shadow-lg cursor-pointer hover:bg-green-600 transition-colors active:scale-95">
          <span className="text-white text-lg md:text-xl font-bold">
            👆 Tap to start the game
          </span>
        </button>
        <p className="text-primary-foreground/80 text-xs md:text-sm font-medium">
          Powered by <span className="text-yellow-400 font-bold">Rapido</span>
        </p>
        <p className="text-primary-foreground/70 text-xs md:text-sm font-medium">
          🔊 Turn your volume up for the best experience
        </p>
      </div>
    </div>;
};
export default WelcomeScreen;
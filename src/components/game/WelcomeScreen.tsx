import KPCharacter from './KPCharacter';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div 
      className="min-h-screen min-h-[100dvh] game-gradient flex flex-col items-center justify-center px-4 py-4 cursor-pointer overflow-hidden gap-3"
      onClick={onStart}
    >
      {/* Header with title and KP */}
      <div className="flex items-center gap-2">
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
            I take money to buy an Airavat bus ticket, but I travel in an APSRTC bus 🚌
          </p>
          <p className="text-primary-foreground/90 text-xs md:text-sm bg-foreground/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-primary-foreground/20">
            i dont have ==D but i want ({'{}'}) 😏
          </p>
          <p className="text-primary-foreground/90 text-xs md:text-sm bg-foreground/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-primary-foreground/20">
            i do vaddi vyaparam, but no one pays my money back :( 💸
          </p>
          <p className="text-primary-foreground/90 text-xs md:text-sm bg-foreground/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-primary-foreground/20">
            (.) (.) i like milk :) 🥛
          </p>
          <p className="text-primary-foreground/90 text-xs md:text-sm bg-foreground/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-primary-foreground/20">
            btw north indian girls like krishna name {'<3'} 💕
          </p>
        </div>
      </div>
      
      {/* Tap to start + Footer - grouped together */}
      <div className="flex flex-col items-center gap-2">
        <div className="bg-green-500 backdrop-blur-sm rounded-2xl px-8 py-4 border border-green-400/50 animate-pulse shadow-lg">
          <span className="text-white text-lg md:text-xl font-bold">
            👆 Tap to start the game
          </span>
        </div>
        <p className="text-primary-foreground/80 text-xs md:text-sm font-medium">
          Powered by <span className="text-yellow-400 font-bold">Rapido</span>
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;

interface WelcomeScreenProps {
  onStart: () => void;
}
const WelcomeScreen = ({
  onStart
}: WelcomeScreenProps) => {
  return <div className="min-h-screen min-h-[100dvh] game-gradient flex flex-col items-center justify-center px-4 cursor-pointer" onClick={onStart}>
      {/* Main content */}
      <div className="flex flex-col items-center gap-8">
        {/* Bus ticket line */}
        
        
        {/* Game title */}
        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground text-shadow-game tracking-wider">KP Game</h1>
        
        {/* Tap to start */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-foreground/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-primary-foreground/20 animate-pulse">
            <span className="text-primary-foreground text-xl md:text-2xl font-medium">
              👆 Tap to start the game
            </span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 flex flex-col items-center gap-3 text-center px-4">
        <p className="text-primary-foreground/80 text-sm md:text-base font-medium">
          Powered by <span className="text-yellow-400 font-bold">Rapido</span>
        </p>
        
      </div>
    </div>;
};
export default WelcomeScreen;
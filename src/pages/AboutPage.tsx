import { Link } from "react-router-dom";
import { ArrowLeft, Gamepad2, Heart, Milk, Plane, Swords } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] text-white font-[Fredoka]">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Game</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Title Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What is KP Game?
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            KP Game is an indie browser game created in 2026. Play KP Game free online at{" "}
            <a href="https://kpgame.vercel.app" className="text-pink-400 underline hover:text-pink-300">
              kpgame.vercel.app
            </a>
          </p>
        </section>

        {/* How to Play */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-pink-400 mb-6 flex items-center gap-3">
            <Gamepad2 className="w-6 h-6" />
            How to Play KP Game
          </h2>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
              KP Game is a casual browser game where your goal is to keep KP happy! 
              The game features multiple mini-games and activities:
            </p>
            <ul className="space-y-3 ml-4">
              <li className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                <span><strong className="text-white">Feed KP:</strong> Give KP her favorite foods to increase happiness</span>
              </li>
              <li className="flex items-start gap-3">
                <Swords className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <span><strong className="text-white">Cow Fight:</strong> Watch epic boxing cow battles</span>
              </li>
              <li className="flex items-start gap-3">
                <Milk className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <span><strong className="text-white">Milk Hospital:</strong> Help at the milk hospital</span>
              </li>
              <li className="flex items-start gap-3">
                <Plane className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <span><strong className="text-white">Airplane:</strong> Take a flight adventure</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Screenshots */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-pink-400 mb-6">
            Screenshots
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl p-6 text-center border border-pink-500/30">
              <span className="text-4xl mb-2 block">🎮</span>
              <span className="text-sm text-gray-400">Welcome Screen</span>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-yellow-500/20 rounded-xl p-6 text-center border border-green-500/30">
              <span className="text-4xl mb-2 block">🍔</span>
              <span className="text-sm text-gray-400">Feeding Game</span>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 text-center border border-red-500/30">
              <span className="text-4xl mb-2 block">🐄</span>
              <span className="text-sm text-gray-400">Cow Fight</span>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 text-center border border-blue-500/30">
              <span className="text-4xl mb-2 block">✈️</span>
              <span className="text-sm text-gray-400">Airplane Mode</span>
            </div>
          </div>
        </section>

        {/* Developer Info */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-pink-400 mb-6">
            Developer Info
          </h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 leading-relaxed mb-4">
              KP Game was developed by <strong className="text-white">DEV</strong> in 2026 
              as a fun casual browser game experience.
            </p>
            <p className="text-gray-400 text-sm">
              Built with React, TypeScript, and lots of ❤️
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-full text-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg shadow-pink-500/30"
          >
            <Gamepad2 className="w-5 h-5" />
            Play KP Game Now
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm border-t border-white/10">
        <p>© 2026 KP Game. Play free at kpgame.vercel.app</p>
      </footer>
    </div>
  );
};

export default AboutPage;

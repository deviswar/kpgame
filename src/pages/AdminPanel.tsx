import { Link } from 'react-router-dom';

const screens = [
  { path: '/welcome', name: 'Welcome Screen', emoji: '🏠', description: 'Start screen with fun facts' },
  { path: '/feed', name: 'Feed KP', emoji: '🍚', description: 'Main feeding game' },
  { path: '/cow-fight', name: 'Cow Fight', emoji: '🥊', description: 'Boxing match with cow' },
  { path: '/milk-hospital', name: 'Milk Hospital', emoji: '🏥', description: 'Hospital + car crash sequence' },
  { path: '/airplane', name: 'Airplane End', emoji: '✈️', description: 'Final goodbye screen' },
];

const AdminPanel = () => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
          🎮 KP Game - Admin Panel
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Select any screen to preview it directly
        </p>

        <div className="space-y-4">
          {screens.map((screen) => (
            <Link
              key={screen.path}
              to={screen.path}
              className="block bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 p-4 rounded-xl border border-gray-600 hover:border-gray-500 transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{screen.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">{screen.name}</h2>
                  <p className="text-gray-400 text-sm">{screen.description}</p>
                </div>
                <span className="ml-auto text-gray-500 text-2xl">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            <span className="text-yellow-400">💡 Tip:</span> The main game at{' '}
            <Link to="/" className="text-blue-400 hover:underline">/</Link>{' '}
            plays all screens in sequence automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

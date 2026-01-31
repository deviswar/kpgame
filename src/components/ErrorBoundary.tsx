import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App crashed:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen min-h-[100dvh] game-gradient flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h1>
          <p className="text-white/80 mb-2 text-center">The game had an issue loading.</p>
          <p className="text-white/60 mb-6 text-sm text-center max-w-xs break-words">
            {this.state.error?.message || 'Unknown error'}
          </p>
          <div className="flex gap-4">
            <button
              onClick={this.handleRetry}
              className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-colors active:scale-95"
            >
              🔄 Reload Game
            </button>
            <button
              onClick={this.handleGoHome}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-purple-700 transition-colors active:scale-95 border-2 border-purple-400"
            >
              🏠 Go Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

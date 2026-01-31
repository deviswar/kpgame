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

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen min-h-[100dvh] game-gradient flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h1>
          <p className="text-white/80 mb-6 text-center">The game had an issue loading. Please try again.</p>
          <button
            onClick={this.handleRetry}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-colors active:scale-95"
          >
            🔄 Reload Game
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

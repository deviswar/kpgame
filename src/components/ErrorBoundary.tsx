import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center px-4"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div className="text-center text-white max-w-md">
            <h1 className="text-5xl mb-4">Oops! 😅</h1>
            <p className="text-lg mb-6 opacity-90">
              Something went wrong. Don't worry, it happens!
            </p>
            <button
              onClick={this.handleReload}
              className="bg-white text-purple-600 font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform active:scale-95"
            >
              🔄 Reload Game
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

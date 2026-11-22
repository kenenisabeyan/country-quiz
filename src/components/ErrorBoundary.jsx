import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1A1C36] flex items-center justify-center p-6 text-white font-['Be_Vietnam_Pro',sans-serif]">
          <div className="bg-[#242749] border border-[#3E4577] p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <span className="text-4xl">⚠️</span>
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-sm text-[#A0A5D0]">
              An unexpected error occurred while rendering the quiz. Don't worry, your progress and stats are safe.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E65895] to-[#BC6BE8] text-white font-bold text-sm cursor-pointer hover:opacity-90 transition-all"
            >
              Restart Quiz Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

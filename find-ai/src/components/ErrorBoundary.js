'use client';

import { Component } from 'react';

/**
 * Error Boundary — catches React rendering errors in tools.
 * Shows a clean retry UI instead of a white screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] px-6 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 className="text-[16px] font-bold mb-2" style={{ color: '#0f172a' }}>
            Something went wrong
          </h3>
          <p className="text-[13px] mb-6 max-w-[280px]" style={{ color: '#94a3b8' }}>
            {this.props.fallbackMessage || 'An error occurred. Try again or refresh the page.'}
          </p>
          <button onClick={this.handleRetry}
            className="px-6 py-3 rounded-xl text-[13px] font-bold text-white transition active:scale-[0.98]"
            style={{ background: '#0f172a', boxShadow: '0 4px 16px rgba(15,23,42,0.25)' }}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

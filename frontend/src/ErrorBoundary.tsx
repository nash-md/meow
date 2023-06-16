import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <b>An unexpected error has occurred!</b> If you're using a self-hosted installation,
          please check the JavaScript console and report the error. If you're using Meow's cloud
          version, rest assured that this error has been automatically recorded, and our team will
          investigate it shortly.
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

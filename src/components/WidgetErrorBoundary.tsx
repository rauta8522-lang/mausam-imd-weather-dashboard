import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  widgetName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WidgetErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Widget Error Boundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full min-h-[190px]">
          <div>
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {this.props.widgetName || 'Meteorological Module'}
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This telemetry card encountered a rendering issue. Other observatory modules remain operational.
            </p>
          </div>
          <button
            onClick={this.handleRetry}
            className="mt-4 self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Module</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

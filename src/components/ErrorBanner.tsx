import React from 'react';
import { AlertTriangle, RefreshCw, XCircle } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry, onDismiss }) => {
  return (
    <div
      id="weather-error-banner"
      role="alert"
      className="w-full bg-rose-500/10 border border-rose-400/30 text-rose-100 rounded-2xl p-4 mb-6 shadow-[0_8px_32px_0_rgba(244,63,94,0.15)] backdrop-blur-xl transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-rose-200">Weather Data Notice</h3>
            <p className="text-sm text-rose-300/90 mt-0.5">{message}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onRetry && (
            <button
              id="error-retry-btn"
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-500/30 hover:bg-rose-500/50 border border-rose-400/40 text-white rounded-xl transition-colors cursor-pointer backdrop-blur-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          )}
          {onDismiss && (
            <button
              id="error-dismiss-btn"
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss error"
              className="text-rose-400 hover:text-rose-200 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

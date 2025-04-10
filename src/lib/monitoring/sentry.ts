
import * as Sentry from '@sentry/react';

export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || '',
    integrations: [
      new Sentry.BrowserTracing({
        // Set sampling rate for performance monitoring
        tracesSampleRate: 0.5,
      }),
      new Sentry.Replay({
        // Capture session replay for error debugging
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,
    // Set these at the top level, not in BrowserTracing
    tracesSampleRate: 0.5,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    contexts: context ? { additional: context } : undefined,
  });
};

export const setUserContext = (user: { id: string; email?: string; username?: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
};

export const clearUserContext = () => {
  Sentry.setUser(null);
};

export const startTransaction = (name: string, op: string) => {
  return Sentry.startTransaction({
    name,
    op,
  });
};

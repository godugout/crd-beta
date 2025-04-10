
import * as Sentry from '@sentry/react';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  context?: Record<string, any>;
  tags?: Record<string, string>;
  user?: { id: string; email?: string };
}

class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(level: LogLevel, message: string, options?: LogOptions): void {
    // Always console log in development
    if (!import.meta.env.PROD || level === 'error') {
      this.consoleLog(level, message, options);
    }

    // Send to monitoring service in production
    if (import.meta.env.PROD) {
      this.sentryLog(level, message, options);
    }
  }

  private consoleLog(level: LogLevel, message: string, options?: LogOptions): void {
    const logMessage = options?.context ? `${message} ${JSON.stringify(options.context)}` : message;
    
    switch (level) {
      case 'info':
        console.info(`[INFO] ${logMessage}`);
        break;
      case 'warn':
        console.warn(`[WARN] ${logMessage}`);
        break;
      case 'error':
        console.error(`[ERROR] ${logMessage}`);
        break;
      case 'debug':
        console.debug(`[DEBUG] ${logMessage}`);
        break;
    }
  }

  private sentryLog(level: LogLevel, message: string, options?: LogOptions): void {
    if (level === 'error') {
      Sentry.captureMessage(message, {
        level: Sentry.Severity.Error,
        contexts: options?.context ? { additional: options.context } : undefined,
        tags: options?.tags,
        user: options?.user ? {
          id: options.user.id,
          email: options.user.email
        } : undefined,
      });
    } else if (level === 'warn') {
      Sentry.captureMessage(message, {
        level: Sentry.Severity.Warning,
        contexts: options?.context ? { additional: options.context } : undefined,
        tags: options?.tags,
        user: options?.user ? {
          id: options.user.id,
          email: options.user.email
        } : undefined,
      });
    } else if (import.meta.env.DEV) {
      // Only log info/debug in Sentry if explicitly configured for development
      Sentry.addBreadcrumb({
        category: level,
        message,
        data: options?.context,
        level: level === 'info' ? 'info' : 'debug',
      });
    }
  }

  public info(message: string, options?: LogOptions): void {
    this.log('info', message, options);
  }

  public warn(message: string, options?: LogOptions): void {
    this.log('warn', message, options);
  }

  public error(message: string, options?: LogOptions): void {
    this.log('error', message, options);
  }

  public debug(message: string, options?: LogOptions): void {
    this.log('debug', message, options);
  }
}

export const logger = Logger.getInstance();

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  stack?: string;
  requestId?: string;
}

class Logger {
  private isDev = Bun.env.NODE_ENV !== 'production';
  private logErrors = true; // Always log errors for debugging

  private format(entry: LogEntry): string {
    const { timestamp, level, message, context, stack, requestId } = entry;
    const levelUpper = level.toUpperCase().padEnd(5);
    const reqId = requestId ? ` [${requestId}]` : '';
    const ctx = context ? ` ${JSON.stringify(context)}` : '';
    const stackTrace = stack ? `\n${stack}` : '';
    
    return `${timestamp} ${levelUpper}${reqId}: ${message}${ctx}${stackTrace}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error, requestId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      stack: error?.stack,
      requestId,
    };

    const formatted = this.format(entry);
    
    // Always log to console in development
    if (this.isDev) {
      const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
      consoleMethod(formatted);
    } else {
      // In production, you could send to external logging service
      // For now, just log to console
      const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
      consoleMethod(formatted);
    }
  }

  debug(message: string, context?: Record<string, any>, requestId?: string) {
    if (this.isDev) {
      this.log('debug', message, context, undefined, requestId);
    }
  }

  info(message: string, context?: Record<string, any>, requestId?: string) {
    this.log('info', message, context, undefined, requestId);
  }

  warn(message: string, context?: Record<string, any>, requestId?: string) {
    this.log('warn', message, context, undefined, requestId);
  }

  error(message: string, error?: Error, context?: Record<string, any>, requestId?: string) {
    this.log('error', message, context, error, requestId);
  }
}

export const logger = new Logger();

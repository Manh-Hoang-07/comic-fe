/**
 * Structured logging service.
 *
 * Usage:
 *   import { createLogger } from '@/lib/logger';
 *   const logger = createLogger('MyModule');
 *   logger.info('Something happened', { detail: 123 });
 *
 * - debug/info are only logged in development mode.
 * - warn/error are always logged.
 * - Each entry includes timestamp and context for easy filtering.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: string;
}

const isDev = process.env.NODE_ENV !== 'production';

function formatEntry(entry: LogEntry): string {
  const tag = `[${entry.timestamp}] [${entry.level.toUpperCase()}]${entry.context ? ` [${entry.context}]` : ''}`;
  return `${tag} ${entry.message}`;
}

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private buildEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      level,
      message,
      context: this.context,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  debug(message: string, data?: unknown): void {
    if (!isDev) return;
    const entry = this.buildEntry('debug', message, data);
    console.debug(formatEntry(entry), ...(data !== undefined ? [data] : []));
  }

  info(message: string, data?: unknown): void {
    if (!isDev) return;
    const entry = this.buildEntry('info', message, data);
    console.info(formatEntry(entry), ...(data !== undefined ? [data] : []));
  }

  warn(message: string, data?: unknown): void {
    const entry = this.buildEntry('warn', message, data);
    console.warn(formatEntry(entry), ...(data !== undefined ? [data] : []));
  }

  error(message: string, data?: unknown): void {
    const entry = this.buildEntry('error', message, data);
    console.error(formatEntry(entry), ...(data !== undefined ? [data] : []));
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context);
}

export const logger = createLogger('app');

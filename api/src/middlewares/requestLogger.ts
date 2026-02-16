import { Elysia } from 'elysia';
import { logger } from '../utils/logger';

/**
 * Request logging middleware
 * Logs all incoming requests and their responses in development mode
 */
export const requestLogger = (app: Elysia) => {
  if (Bun.env.NODE_ENV === 'production') {
    return app;
  }

  return app.onBeforeHandle(({ request, path, query }) => {
    const method = request.method;
    const url = path;
    const queryStr = new URLSearchParams(query as Record<string, string>).toString();
    const fullUrl = queryStr ? `${url}?${queryStr}` : url;

    const contentType = request.headers.get('content-type');
    const context = {
      method,
      url: fullUrl,
      contentType: contentType || 'none',
      timestamp: new Date().toISOString(),
    };

    logger.debug(`→ ${method} ${fullUrl}`, context);
  }).onAfterHandle(({ request, path, response, set }) => {
    const method = request.method;
    const status = set.status;
    const statusCode = typeof status === 'string' ? parseInt(status) : status;
    const statusStr = statusCode || 200;

    const context = {
      method,
      url: path,
      status: statusStr,
      timestamp: new Date().toISOString(),
    };

    // Color code based on status
    const statusEmoji = statusStr < 300 ? '✓' : statusStr < 400 ? '→' : statusStr < 500 ? '⚠' : '✗';
    logger.debug(`${statusEmoji} ${method} ${path} [${statusStr}]`, context);
  }).onError(({ request, path, set, error }) => {
    const method = request.method;
    const status = set.status || 500;
    const statusCode = typeof status === 'string' ? parseInt(status) : status;

    const context = {
      method,
      url: path,
      status: statusCode,
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    logger.debug(`✗ ${method} ${path} [${statusCode}]`, context);
  });
};

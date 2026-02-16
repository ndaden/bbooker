import { Elysia } from 'elysia';
import { buildApiResponse } from './api';
import { logger } from './logger';

// Types d'erreurs spécifiques
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Gestionnaire d'erreurs centralisé
export const errorHandler = (app: Elysia) =>
  app.onError(({ error, set, code }) => {
    // Log de l'erreur avec le logger structuré
    logger.error(`Error ${code}`, error instanceof Error ? error : new Error(String(error)), { code });
    
    // Gestion des erreurs spécifiques
    switch (error.constructor) {
      case ValidationError:
        set.status = 400;
        return buildApiResponse(false, error.message, { field: (error as ValidationError).field });
        
      case AuthenticationError:
        set.status = 401;
        return buildApiResponse(false, error.message);
        
      case AuthorizationError:
        set.status = 403;
        return buildApiResponse(false, error.message);
        
      case NotFoundError:
        set.status = 404;
        return buildApiResponse(false, error.message);
    }

    // Erreurs Elysia intégrées
    switch (code) {
      case 'VALIDATION':
        set.status = 400;
        return buildApiResponse(false, 'Invalid input data', { details: error.message });
        
      case 'NOT_FOUND':
        set.status = 404;
        return buildApiResponse(false, 'Endpoint not found');
        
      case 'INTERNAL_SERVER_ERROR':
        set.status = 500;
        // Ne pas exposer les détails d'erreur interne en production
        const isDev = Bun.env.NODE_ENV !== 'production';
        return buildApiResponse(false, 'Internal server error', isDev ? { error: error.message } : undefined);
        
      default:
        // Erreur non gérée
        set.status = 500;
        return buildApiResponse(false, 'An unexpected error occurred');
    }
  });
import { Elysia } from 'elysia';
import { buildApiResponse } from '../utils/api';

// Simple in-memory rate limiter (pour prod, utiliser Redis)
const requests = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // max requests par fenêtre
};

export const rateLimit = (maxRequests = RATE_LIMIT.maxRequests) => {
  return (app: Elysia) =>
    app.onBeforeHandle(({ set, request }) => {
      const clientIP = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
      
      const now = Date.now();
      const clientData = requests.get(clientIP);

      if (!clientData || now > clientData.resetTime) {
        // Nouvelle fenêtre ou première requête
        requests.set(clientIP, {
          count: 1,
          resetTime: now + RATE_LIMIT.windowMs,
        });
        return;
      }

      if (clientData.count >= maxRequests) {
        set.status = 429;
        set.headers['Retry-After'] = Math.ceil((clientData.resetTime - now) / 1000).toString();
        
        return buildApiResponse(false, 'Too many requests. Please try again later.');
      }

      // Incrémenter le compteur
      clientData.count++;
    });
};

// Nettoyage périodique des entrées expirées
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requests.entries()) {
    if (now > data.resetTime) {
      requests.delete(key);
    }
  }
}, RATE_LIMIT.windowMs);
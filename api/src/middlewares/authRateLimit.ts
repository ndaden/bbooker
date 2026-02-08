import { Elysia } from 'elysia';
import { buildApiResponse } from '../utils/api';

// Strict rate limiter for authentication endpoints
const authRequests = new Map<string, { count: number; resetTime: number; attempts: number }>();

const AUTH_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // max 5 login/signup attempts per 15 minutes
  lockoutAfter: 3, // Lockout after 3 failed attempts
  lockoutMs: 60 * 60 * 1000, // 1 hour lockout
};

export const authRateLimit = () => {
  return (app: Elysia) =>
    app.onBeforeHandle(({ set, request, body }) => {
      const clientIP = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
      
      // Also track by email if available
      const email = (body as any)?.email || 'unknown';
      const key = `${clientIP}:${email}`;
      
      const now = Date.now();
      const clientData = authRequests.get(key);

      if (!clientData || now > clientData.resetTime) {
        // Nouvelle fenêtre ou première requête
        authRequests.set(key, {
          count: 1,
          resetTime: now + AUTH_RATE_LIMIT.windowMs,
          attempts: 0,
        });
        return;
      }

      // Check if account is locked out
      if (clientData.attempts >= AUTH_RATE_LIMIT.lockoutAfter) {
        const lockoutEnd = clientData.resetTime + AUTH_RATE_LIMIT.lockoutMs;
        if (now < lockoutEnd) {
          set.status = 429;
          const retryAfter = Math.ceil((lockoutEnd - now) / 1000);
          set.headers['Retry-After'] = retryAfter.toString();
          
          return buildApiResponse(
            false, 
            `Account temporarily locked due to too many failed attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`
          );
        }
        // Reset after lockout period
        authRequests.set(key, {
          count: 1,
          resetTime: now + AUTH_RATE_LIMIT.windowMs,
          attempts: 0,
        });
        return;
      }

      if (clientData.count >= AUTH_RATE_LIMIT.maxRequests) {
        set.status = 429;
        set.headers['Retry-After'] = Math.ceil((clientData.resetTime - now) / 1000).toString();
        
        return buildApiResponse(false, 'Too many authentication attempts. Please try again later.');
      }

      // Incrémenter le compteur
      clientData.count++;
    });
};

// Function to track failed login attempts
export const trackFailedAttempt = (clientIP: string, email: string) => {
  const key = `${clientIP}:${email}`;
  const clientData = authRequests.get(key);
  
  if (clientData) {
    clientData.attempts++;
    authRequests.set(key, clientData);
  }
};

// Nettoyage périodique des entrées expirées
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of authRequests.entries()) {
    if (now > data.resetTime + AUTH_RATE_LIMIT.lockoutMs) {
      authRequests.delete(key);
    }
  }
}, AUTH_RATE_LIMIT.windowMs);

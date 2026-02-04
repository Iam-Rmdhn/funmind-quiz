/**
 * Get the base URL for the application
 * This handles different environments: development, Vercel preview, and production
 */
export function getBaseUrl(): string {
  // Priority 1: Explicitly set site URL (for production)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Priority 2: Vercel deployment URL (for preview deployments)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Priority 3: Vercel project production URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  
  // Priority 4: Check if running in browser and use window.location
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback: localhost for development
  return 'http://localhost:3000';
}

/**
 * Get the auth callback URL
 */
export function getAuthCallbackUrl(): string {
  return `${getBaseUrl()}/auth/callback`;
}

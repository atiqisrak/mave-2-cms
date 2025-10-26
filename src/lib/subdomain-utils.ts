/**
 * Subdomain utility functions for multi-tenant support
 */

/**
 * Extract subdomain from current window location
 * @returns subdomain string or null if not on a subdomain
 */
export function getSubdomainFromWindow(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const hostname = window.location.hostname;
  
  // Handle localhost subdomains (e.g., ethertech.localhost)
  if (hostname.endsWith('.localhost')) {
    const subdomain = hostname.replace('.localhost', '');
    return subdomain && subdomain !== 'localhost' ? subdomain : null;
  }
  
  // For main localhost, no subdomain
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }

  // Extract subdomain from hostname (for production domains)
  const parts = hostname.split('.');
  
  // If we have more than 2 parts, we're on a subdomain
  // e.g., acme.xyz.com -> ['acme', 'xyz', 'com'] -> subdomain is 'acme'
  if (parts.length > 2) {
    return parts[0];
  }

  return null;
}

/**
 * Extract subdomain from a given hostname
 */
export function getSubdomainFromHost(hostname: string): string | null {
  if (!hostname) return null;

  const parts = hostname.split('.');
  
  if (parts.length > 2) {
    return parts[0];
  }

  return null;
}

/**
 * Validate subdomain format
 */
export function isValidSubdomain(subdomain: string): boolean {
  if (!subdomain) return false;
  
  // Subdomain rules:
  // - 3-63 characters
  // - Only lowercase letters, numbers, and hyphens
  // - Cannot start or end with hyphen
  // - Must be at least 3 characters
  
  if (subdomain.length < 3 || subdomain.length > 63) {
    return false;
  }

  if (!/^[a-z0-9-]+$/.test(subdomain)) {
    return false;
  }

  if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
    return false;
  }

  return true;
}

/**
 * Get the full subdomain URL
 */
export function getSubdomainUrl(subdomain: string, baseDomain?: string): string {
  const protocol = window.location.protocol;
  const host = window.location.host;
  const hostname = host.split(':')[0]; // Remove port if present
  
  const domain = baseDomain || 'localhost';
  const port = host.includes(':') ? `:${host.split(':')[1]}` : '';
  
  return `${protocol}//${subdomain}.${domain}${port}`;
}

/**
 * Check if currently on a subdomain (not main domain)
 */
export function isOnSubdomain(): boolean {
  return getSubdomainFromWindow() !== null;
}

/**
 * Generate a subdomain from a string (e.g., organization name)
 */
export function generateSubdomain(name: string): string {
  if (!name) return '';
  
  // Convert to lowercase and replace spaces/special chars with hyphens
  let subdomain = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // Ensure minimum length
  if (subdomain.length < 3) {
    subdomain = subdomain + '-org';
  }

  // Ensure maximum length
  if (subdomain.length > 63) {
    subdomain = subdomain.substring(0, 63).replace(/-+$/, '');
  }

  return subdomain;
}

/**
 * Get the current base domain (without subdomain)
 */
export function getBaseDomain(): string {
  if (typeof window === 'undefined') {
    return 'localhost';
  }

  const hostname = window.location.hostname;
  
  // For localhost development
  if (hostname === 'localhost' || hostname.startsWith('localhost')) {
    return 'localhost';
  }

  const parts = hostname.split('.');
  
  // If we have at least 2 parts, return the last 2 as base domain
  // e.g., acme.xyz.com -> ['acme', 'xyz', 'com'] -> 'xyz.com'
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }

  return hostname;
}

/**
 * Build full URL with subdomain
 */
export function buildSubdomainUrl(subdomain: string, path: string = ''): string {
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  const baseDomain = getBaseDomain();
  const port = typeof window !== 'undefined' && window.location.port ? `:${window.location.port}` : '';
  
  const url = `${protocol}//${subdomain}.${baseDomain}${port}${path}`;
  return url;
}

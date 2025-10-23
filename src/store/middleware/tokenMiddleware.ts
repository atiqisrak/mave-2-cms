import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setCredentials, clearCredentials } from '../slices/authSlice';
import { RootState } from '../index';

const TOKEN_KEY = 'mave_cms_tokens';
const REFRESH_TOKEN_KEY = 'mave_cms_refresh_token';

// Listener middleware for token persistence
export const tokenMiddleware = createListenerMiddleware();

// Listen for credential changes and persist to localStorage
tokenMiddleware.startListening({
  actionCreator: setCredentials,
  effect: (action, listenerApi) => {
    const { tokens } = action.payload;
    if (typeof window !== 'undefined' && tokens) {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    }
  },
});

// Listen for logout and clear localStorage
tokenMiddleware.startListening({
  actionCreator: clearCredentials,
  effect: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
});

// Helper functions for token management
export const getStoredTokens = (): { accessToken: string; refreshToken: string } | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(TOKEN_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const clearStoredTokens = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch {
    return null;
  }
};

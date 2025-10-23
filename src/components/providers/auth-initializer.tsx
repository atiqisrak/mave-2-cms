"use client";

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { useAppSelector } from '@/hooks/use-app-selector';
import { useLazyGetUserDetailsQuery } from '@/store/api/authApi';
import { setUserData, clearCredentials } from '@/store/slices/authSlice';

// Global flag to prevent multiple initializations
let globalInitialized = false;

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, tokens, roles } = useAppSelector((state) => state.auth);
  const [triggerUserDetails] = useLazyGetUserDetailsQuery();

  useEffect(() => {
    // Only restore if we have tokens and user but no roles/permissions
    if (isAuthenticated && user && tokens && user.id && (!roles || roles.length === 0) && !globalInitialized) {
      globalInitialized = true;
      
      const initializeAuth = async () => {
        try {
          // Use the lazy query to trigger the GetUserDetails query
          const userDetailsResult = await triggerUserDetails({ id: user.id });
          
          if (!userDetailsResult.data) {
            throw new Error('Failed to fetch user details');
          }

          const userDetails = userDetailsResult.data;

          // Update Redux store with complete data
          dispatch(setUserData({
            user: userDetails.user,
            organization: userDetails.organization,
            roles: userDetails.roles || [],
            permissions: userDetails.detailedPermissions || [],
          }));
        } catch (error) {
          console.error('Failed to restore user data:', error);
          // If restoration fails, clear credentials
          dispatch(clearCredentials());
          globalInitialized = false; // Reset flag on error
        }
      };

      initializeAuth();
    }
  }, [isAuthenticated, user?.id, tokens?.accessToken, roles?.length, dispatch, triggerUserDetails]);

  return <>{children}</>;
}

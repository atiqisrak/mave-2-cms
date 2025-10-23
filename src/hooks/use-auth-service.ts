"use client";

import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { useAppSelector } from '@/hooks/use-app-selector';
import { 
  useLoginMutation, 
  useLazyGetUserDetailsQuery 
} from '@/store/api/authApi';
import { setCredentials, setUserData, clearCredentials, setLoading } from '@/store/slices/authSlice';
import { toast } from 'sonner';

export function useAuthService() {
  const dispatch = useAppDispatch();
  const { user, tokens, isAuthenticated, roles, permissions } = useAppSelector((state) => state.auth);
  
  const [loginMutation] = useLoginMutation();
  const [triggerUserDetails] = useLazyGetUserDetailsQuery();
  
  // Fetch complete user data after login using the new comprehensive query
  const fetchCompleteUserData = async (userId: string) => {
    try {
      // Use the lazy query to trigger the GetUserDetails query
      const userDetailsResult = await triggerUserDetails({ id: userId });
      
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

      return {
        user: userDetails.user,
        organization: userDetails.organization,
        roles: userDetails.roles || [],
        permissions: userDetails.detailedPermissions || [],
      };
    } catch (error: any) {
      throw error;
    }
  };

  // Enhanced login function
  const login = async (loginData: any) => {
    try {
      dispatch(setLoading(true));
      
      // Step 1: Login and get tokens
      const loginResult = await loginMutation(loginData).unwrap();
      
      // Step 2: Store tokens and basic user info
      dispatch(setCredentials({
        user: {
          ...loginResult.user,
          status: 'active' as const,
          twoFactorEnabled: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        tokens: {
          accessToken: loginResult.accessToken,
          refreshToken: loginResult.refreshToken,
        },
      }));

      // Step 3: Fetch complete user data using new comprehensive query
      const completeData = await fetchCompleteUserData(loginResult.user.id);
      
      toast.success('Login successful!');
      return completeData;
      
    } catch (error: any) {
      dispatch(clearCredentials());
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Enhanced logout function
  const logout = async () => {
    try {
      // Clear Redux state
      dispatch(clearCredentials());
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mave_cms_token');
        localStorage.removeItem('mave_cms_refresh_token');
        localStorage.removeItem('mave_cms_user');
        localStorage.removeItem('mave_cms_organization');
      }
      
      toast.success('Logged out successfully');
    } catch (error: any) {
      // Still clear local state even if server logout fails
      dispatch(clearCredentials());
    }
  };

  // Check if user has specific role
  const hasRole = (roleSlug: string): boolean => {
    if (!user || !isAuthenticated) return false;
    // Use roles from Redux state (not user.roles)
    const userRoles = roles || [];
    
    const hasRoleResult = userRoles.some((role: any) => {
      // Handle different role data structures
      if (role.role && role.role.slug) {
        return role.role.slug === roleSlug;
      }
      if (role.slug) {
        return role.slug === roleSlug;
      }
      return false;
    });
    
    return hasRoleResult;
  };

  // Check if user has specific permission
  const hasPermission = (permissionSlug: string): boolean => {
    if (!user || !isAuthenticated) return false;
    // Use permissions from Redux state (not user.permissions)
    const userPermissions = permissions || [];
    return userPermissions.some((permission: any) => {
      if (typeof permission === 'string') {
        return permission === permissionSlug;
      }
      if (permission.slug) {
        return permission.slug === permissionSlug;
      }
      return false;
    });
  };

  // Check if user is admin or super admin
  const isAdmin = (): boolean => {
    return hasRole('admin') || hasRole('super-admin');
  };

  // Check if user is super admin
  const isSuperAdmin = (): boolean => {
    return hasRole('super-admin');
  };

  return {
    user,
    tokens,
    isAuthenticated,
    login,
    logout,
    fetchCompleteUserData,
    hasRole,
    hasPermission,
    isAdmin,
    isSuperAdmin,
  };
}

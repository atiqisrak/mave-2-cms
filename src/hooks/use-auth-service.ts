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
  const { user, tokens, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [loginMutation] = useLoginMutation();
  const [triggerUserDetails] = useLazyGetUserDetailsQuery();
  
  // Fetch complete user data after login using the new comprehensive query
  const fetchCompleteUserData = async (userId: string) => {
    try {
      console.log('Fetching complete user data for ID:', userId);
      
      // Use the lazy query to trigger the GetUserDetails query
      const userDetailsResult = await triggerUserDetails({ id: userId });
      
      if (!userDetailsResult.data) {
        throw new Error('Failed to fetch user details');
      }

      const userDetails = userDetailsResult.data;
      console.log('User details fetched:', {
        user: userDetails.user?.email,
        organization: userDetails.organization?.name,
        rolesCount: userDetails.roles?.length,
        permissionsCount: userDetails.permissions?.length,
        detailedPermissionsCount: userDetails.detailedPermissions?.length,
      });

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
      console.error('Failed to fetch complete user data:', error);
      throw error;
    }
  };

  // Enhanced login function
  const login = async (loginData: any) => {
    try {
      dispatch(setLoading(true));
      
      // Step 1: Login and get tokens
      console.log('Step 1: Attempting login...');
      const loginResult = await loginMutation(loginData).unwrap();
      console.log('Login successful, user ID:', loginResult.user.id);
      
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
      console.log('Step 3: Fetching complete user data...');
      const completeData = await fetchCompleteUserData(loginResult.user.id);
      console.log('Complete user data fetched:', {
        user: completeData.user?.email,
        organization: completeData.organization?.name,
        rolesCount: completeData.roles?.length,
        permissionsCount: completeData.permissions?.length,
      });
      
      toast.success('Login successful!');
      return completeData;
      
    } catch (error: any) {
      console.error('Login failed:', error);
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
      console.error('Logout error:', error);
      // Still clear local state even if server logout fails
      dispatch(clearCredentials());
    }
  };

  // Check if user has specific role
  const hasRole = (roleSlug: string): boolean => {
    if (!user || !isAuthenticated) return false;
    return user.roles?.some((role: any) => role.role.slug === roleSlug) || false;
  };

  // Check if user has specific permission
  const hasPermission = (permissionSlug: string): boolean => {
    if (!user || !isAuthenticated) return false;
    return user.permissions?.some((permission: any) => permission.slug === permissionSlug) || false;
  };

  // Check if user is admin or super admin
  const isAdmin = (): boolean => {
    return hasRole('admin') || hasRole('super_admin');
  };

  // Check if user is super admin
  const isSuperAdmin = (): boolean => {
    return hasRole('super_admin');
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

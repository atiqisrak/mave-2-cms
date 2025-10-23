import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION, REFRESH_TOKEN_MUTATION, ME_QUERY } from '@/lib/graphql/queries';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: {
    id: string;
    roleId: string;
    role: {
      id: string;
      name: string;
      slug: string;
    };
    scope: string;
    isActive: boolean;
  }[];
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  // Check for token on client side only to prevent hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('mave_cms_token');
      setHasToken(!!token);
    }
  }, []);

  const { data: meData, loading: meLoading, refetch: refetchMe } = useQuery(ME_QUERY, {
    skip: !hasToken,
    errorPolicy: 'ignore',
  });

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);

  useEffect(() => {
    if (meData?.me) {
      setUser(meData.me);
    }
    setLoading(meLoading);
  }, [meData, meLoading]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (data?.login) {
        const { accessToken, refreshToken, user } = data.login;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('mave_cms_token', accessToken);
          localStorage.setItem('mave_cms_refresh_token', refreshToken);
        }
        
        setUser(user);
        setHasToken(true);
        toast.success('Login successful!');
        
        // Refetch user data
        await refetchMe();
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const { data } = await registerMutation({
        variables: { input },
      });

      if (data?.register) {
        const { accessToken, refreshToken, user } = data.register;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('mave_cms_token', accessToken);
          localStorage.setItem('mave_cms_refresh_token', refreshToken);
        }
        
        setUser(user);
        setHasToken(true);
        toast.success('Registration successful!');
        
        // Refetch user data
        await refetchMe();
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mave_cms_token');
      localStorage.removeItem('mave_cms_refresh_token');
    }
    setUser(null);
    setHasToken(false);
    toast.success('Logged out successfully');
  };

  const refreshToken = async () => {
    try {
      if (typeof window === 'undefined') return false;
      
      const refreshTokenValue = localStorage.getItem('mave_cms_refresh_token');
      if (!refreshTokenValue) return false;

      const { data } = await refreshTokenMutation({
        variables: { refreshToken: refreshTokenValue },
      });

      if (data?.refreshToken) {
        const { accessToken, refreshToken: newRefreshToken } = data.refreshToken;
        localStorage.setItem('mave_cms_token', accessToken);
        localStorage.setItem('mave_cms_refresh_token', newRefreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
    return false;
  };

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('mave_cms_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;

        // Refresh token 5 minutes before expiry
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
          refreshToken();
        }
      } catch (error) {
        console.error('Token parsing failed:', error);
      }
    }
  }, []);

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/use-app-selector';
// import { useGetCurrentUserQuery } from '@/store/api/authApi';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallback 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, tokens } = useAppSelector((state) => state.auth);
  
  // We don't need to fetch current user since we already have it from login
  const isLoading = false;
  const error = null;

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !tokens?.accessToken) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, tokens, isLoading, router]);

  // Show loading state
  if (isLoading || (!isAuthenticated && tokens?.accessToken)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-4">
            There was an error verifying your authentication.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (requiredRoles.length > 0 && user) {
    const userRoles = user.roles?.map(role => role.role.slug) || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }
  }

  // Show fallback if provided and not authenticated
  if (!isAuthenticated && fallback) {
    return <>{fallback}</>;
  }

  // Render children if authenticated
  return <>{children}</>;
}

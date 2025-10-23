"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthService } from '@/hooks/use-auth-service';
import { useAppSelector } from '@/hooks/use-app-selector';
// import { useGetCurrentUserQuery } from "@/store/api/authApi";
import { 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  Upload, 
  Globe,
  Shield,
  Zap,
  User,
  Building,
  LogOut
} from "lucide-react";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { clearCredentials } from "@/store/slices/authSlice";
import { useLogoutMutation } from "@/store/api/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { CreateOrganizationCard } from "@/components/organization/create-organization-card";
import { InviteUserCard } from "@/components/organization/invite-user-card";
import { OrganizationSettingsCard } from "@/components/organization/organization-settings-card";
import { InvitationListCard } from "@/components/organization/invitation-list-card";

export default function DashboardPage() {
  const { user, isAdmin, isSuperAdmin } = useAuthService();
  const { organization } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logout] = useLogoutMutation();
  
  // We don't need to fetch current user since we already have it from login
  const isLoading = false;
  const error = null;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      // Even if logout fails on server, clear local state
      dispatch(clearCredentials());
      router.push('/auth/login');
    }
  };

  // Handle authentication errors - only redirect if we don't have user data
  if (error && !isLoading && !user) {
    dispatch(clearCredentials());
    router.push('/auth/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <h1 className="text-2xl font-bold">Mave CMS v2.0</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground cursor-pointer"
                title={`${user.firstName} ${user.lastName}`}
                onClick={() => router.push('/dashboard/profile')}
                >
                  <User className="h-4 w-4" />
                  <span>{user.firstName} {user.lastName}</span>
                </div>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}!</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your content management system.
          </p>
        </div>

        {/* Organization Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Super Admin: Create Organization */}
          {isSuperAdmin() && (
            <CreateOrganizationCard 
              onCreateSuccess={() => {
                toast.success('Organization created successfully!');
                // Refresh organization data
              }}
            />
          )}

          {/* Org Admin: Invite Users */}
          {isAdmin() && organization && (
            <InviteUserCard 
              organizationId={organization.id}
              onInviteSuccess={() => {
                toast.success('Invitation sent successfully!');
                // Refresh invitations list
              }}
            />
          )}

          {/* Organization Settings */}
          {organization && (
            <OrganizationSettingsCard 
              organization={organization}
              onUpdateSuccess={() => {
                toast.success('Organization updated successfully!');
                // Refresh organization data
              }}
            />
          )}

          {/* Invitation Management */}
          {isAdmin() && (
            <InvitationListCard 
              invitations={[]} // TODO: Fetch from API
              onResend={(invitationId) => {
                console.log('Resending invitation:', invitationId);
                toast.success('Invitation resent successfully!');
              }}
              onRevoke={(invitationId) => {
                console.log('Revoking invitation:', invitationId);
                toast.success('Invitation revoked successfully!');
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

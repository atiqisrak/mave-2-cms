"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/hooks/use-app-selector';
import { useGetUserRolesQuery, useGetUserPermissionsQuery } from '@/store/api/userApi';
import { User, Shield, Calendar, Building, Mail, Phone, Globe } from 'lucide-react';

export function UserInfo() {
  const { user, organization } = useAppSelector((state) => state.auth);
  
  const { data: userRoles = [] } = useGetUserRolesQuery(
    { userId: user?.id || '' },
    { skip: !user?.id }
  );
  
  const { data: userPermissions = [] } = useGetUserPermissionsQuery(
    { userId: user?.id || '' },
    { skip: !user?.id }
  );

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No user data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user.email}</span>
          </div>
          
          {user.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.phone}</span>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          {user.lastLoginAt && (
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Last login {new Date(user.lastLoginAt).toLocaleDateString()}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
              {user.status}
            </Badge>
            {user.twoFactorEnabled && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                2FA
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Organization Details */}
      {organization && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">{organization.name}</h4>
              <p className="text-sm text-muted-foreground">{organization.slug}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">{organization.plan}</Badge>
              <Badge variant={organization.isActive ? 'default' : 'secondary'}>
                {organization.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            {organization.domain && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{organization.domain}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Roles */}
      {userRoles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Roles
            </CardTitle>
            <CardDescription>
              Your assigned roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {userRoles.map((userRole) => (
              <div key={userRole.id} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{userRole.role.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {userRole.role.description}
                  </p>
                </div>
                <Badge variant="outline">{userRole.scope}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Permissions Summary */}
      {userPermissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissions
            </CardTitle>
            <CardDescription>
              {userPermissions.length} permissions assigned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userPermissions.slice(0, 5).map((permission) => (
                <div key={permission.id} className="flex items-center justify-between">
                  <span className="text-sm">{permission.name}</span>
                  <Badge 
                    variant={
                      permission.riskLevel === 'high' || permission.riskLevel === 'critical' 
                        ? 'destructive' 
                        : permission.riskLevel === 'medium' 
                        ? 'default' 
                        : 'secondary'
                    }
                  >
                    {permission.riskLevel}
                  </Badge>
                </div>
              ))}
              {userPermissions.length > 5 && (
                <p className="text-sm text-muted-foreground">
                  +{userPermissions.length - 5} more permissions
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

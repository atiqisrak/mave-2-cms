"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  PERMISSIONS_QUERY,
  CREATE_PERMISSION_MUTATION,
  UPDATE_PERMISSION_MUTATION,
  DELETE_PERMISSION_MUTATION,
} from "@/lib/graphql/role-queries";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";

interface Permission {
  id: string;
  name: string;
  slug: string;
  description?: string;
  module: string;
  category?: string;
  permissionType: string;
  riskLevel: string;
  requiresMfa: boolean;
  requiresApproval: boolean;
  isActive: boolean;
  isSystem: boolean;
  isDeprecated: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreatePermissionInput {
  name: string;
  slug: string;
  module: string;
  category?: string;
  description?: string;
  permissionType?: string;
  riskLevel?: string;
  requiresMfa?: boolean;
  requiresApproval?: boolean;
}

interface UpdatePermissionInput {
  name?: string;
  description?: string;
  category?: string;
  isActive?: boolean;
}

export function PermissionManagementTable() {
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  const { data, loading, error, refetch } = useQuery(PERMISSIONS_QUERY, {
    variables: { skip: 0, take: 100 },
  });

  const [createPermission] = useMutation(CREATE_PERMISSION_MUTATION, {
    onCompleted: () => {
      toast.success("Permission created successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [updatePermission] = useMutation(UPDATE_PERMISSION_MUTATION, {
    onCompleted: () => {
      toast.success("Permission updated successfully!");
      setEditingPermission(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [deletePermission] = useMutation(DELETE_PERMISSION_MUTATION, {
    onCompleted: () => {
      toast.success("Permission deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = async (permissionId: string) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      await deletePermission({
        variables: { id: permissionId },
      });
    }
  };

  const getRiskLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            {
              error.message.includes("Unauthorized") ? (
                <p className="text-orange-500 font-medium text-lg bg-orange-500/10 p-4 rounded-md">
                  You are not authorized to access this page. <br />Please contact the administrator to get access.
                </p>
              ) : (
                  <p className="text-destructive font-medium text-lg bg-destructive/10 p-4 rounded-md">
                  Error loading permissions: {error.message}
                </p>
              )
            }
          </div>
        </CardContent>
      </Card>
    );
  }

  const permissions = data?.permissions || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Permissions ({permissions.length})
            </CardTitle>
            <CardDescription>
              Manage system permissions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission: any) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{permission.name}</div>
                      <code className="text-xs text-muted-foreground">
                        {permission.slug}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{permission.module}</Badge>
                  </TableCell>
                  <TableCell>
                    {permission.category || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskLevelBadgeVariant(permission.riskLevel)}>
                      {permission.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {permission.isSystem && (
                        <Badge variant="secondary" className="text-xs">
                          System
                        </Badge>
                      )}
                      {permission.requiresMfa && (
                        <Badge variant="outline" className="text-xs">
                          MFA
                        </Badge>
                      )}
                      {permission.requiresApproval && (
                        <Badge variant="destructive" className="text-xs">
                          Approval
                        </Badge>
                      )}
                      {permission.isDeprecated && (
                        <Badge variant="outline" className="text-xs line-through">
                          Deprecated
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={permission.isActive ? "default" : "secondary"}>
                      {permission.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={permission.isSystem}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(permission.id)}
                        className="text-destructive hover:text-destructive"
                        disabled={permission.isSystem}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}


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
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  ROLES_QUERY,
  CREATE_ROLE_MUTATION,
  UPDATE_ROLE_MUTATION,
  DELETE_ROLE_MUTATION,
} from "@/lib/graphql/role-queries";
import { CreateRoleModal } from "@/components/admin/create-role-modal";
import { EditRoleModal } from "@/components/admin/edit-role-modal";
import { RoleTable } from "@/components/admin/role-table";

interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isSystem: boolean;
  isAssignable: boolean;
  isDefault: boolean;
  permissions: string[];
  level: number;
  roleType: string;
  priority: number;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateRoleInput {
  name: string;
  slug: string;
  description?: string;
  permissions?: string[];
  color?: string;
  icon?: string;
  priority?: number;
  level?: number;
  roleType?: string;
  isAssignable?: boolean;
  isDefault?: boolean;
}

interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissions?: string[];
  color?: string;
  icon?: string;
  priority?: number;
  level?: number;
  roleType?: string;
  isAssignable?: boolean;
  isDefault?: boolean;
}

export function RoleManagementTable() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const { data, loading, error, refetch } = useQuery(ROLES_QUERY, {
    variables: { skip: 0, take: 100 },
  });

  const [createRole] = useMutation(CREATE_ROLE_MUTATION, {
    onCompleted: () => {
      toast.success("Role created successfully!");
      setIsCreateModalOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [updateRole] = useMutation(UPDATE_ROLE_MUTATION, {
    onCompleted: () => {
      toast.success("Role updated successfully!");
      setIsEditModalOpen(false);
      setEditingRole(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [deleteRole] = useMutation(DELETE_ROLE_MUTATION, {
    onCompleted: () => {
      toast.success("Role deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateSubmit = async (data: CreateRoleInput) => {
    await createRole({
      variables: {
        input: data,
      },
    });
  };

  const handleEditSubmit = async (data: UpdateRoleInput) => {
    if (!editingRole) return;

    await updateRole({
      variables: {
        id: editingRole.id,
        input: data,
      },
    });
  };

  const handleDelete = async (roleId: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      await deleteRole({
        variables: { id: roleId },
      });
    }
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Roles
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
            <Shield className="h-5 w-5" />
            Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive">
              Error loading roles: {error.message}
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const roles = data?.roles || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Roles ({roles.length})
            </CardTitle>
            <CardDescription>
              Manage roles and permissions
            </CardDescription>
          </div>
          <CreateRoleModal
            isOpen={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onSubmit={handleCreateSubmit}
          />
        </div>
      </CardHeader>
      <CardContent>
        <RoleTable
          roles={roles}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />

        <EditRoleModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          role={editingRole}
          onSubmit={handleEditSubmit}
        />
      </CardContent>
    </Card>
  );
}


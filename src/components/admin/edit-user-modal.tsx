"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ROLES_QUERY,
  USER_ROLES_QUERY,
  ASSIGN_ROLE_MUTATION,
  REVOKE_ROLE_MUTATION,
} from "@/lib/graphql/role-queries";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  phone?: string;
  status: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  roles: Array<{
    id: string;
    roleId: string;
    role: {
      id: string;
      name: string;
      slug: string;
      color?: string;
      icon?: string;
    };
    scope: string;
    isActive: boolean;
  }>;
}

interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  status?: string;
}

interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isSystem: boolean;
  isAssignable: boolean;
  organizationId?: string | null;
}

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (data: UpdateUserInput) => void;
  organizationId?: string;
}

export function EditUserModal({
  isOpen,
  onOpenChange,
  user,
  onSubmit,
  organizationId,
}: EditUserModalProps) {
  const [form, setForm] = useState<UpdateUserInput>({});
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  // Fetch available roles for the user's organization
  const { data: rolesData, loading: rolesLoading } = useQuery(ROLES_QUERY, {
    variables: {
      organizationId: organizationId, // Fetch roles for this organization
      skip: 0,
      take: 100,
    },
    skip: !organizationId,
  });
  
  console.log("Roles data:", rolesData);
  console.log("Organization ID:", organizationId);

  // Fetch user's current roles
  const { data: userRolesData, refetch: refetchUserRoles } = useQuery(
    USER_ROLES_QUERY,
    {
      variables: { userId: user?.id },
      skip: !user?.id,
    }
  );

  const [assignRole] = useMutation(ASSIGN_ROLE_MUTATION, {
    onCompleted: () => {
      toast.success("Role assigned successfully!");
      refetchUserRoles();
    },
    onError: (error) => {
      console.error("Assign role error details:", error);
      toast.error(error.message || "Failed to assign role");
    },
  });

  const [revokeRole] = useMutation(REVOKE_ROLE_MUTATION, {
    onCompleted: () => {
      toast.success("Role revoked successfully!");
      refetchUserRoles();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Update form when user changes
  React.useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username || "",
        phone: user.phone || "",
        status: user.status,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleAssignRole = async () => {
    if (!user || !selectedRoleId) return;

    try {
      await assignRole({
        variables: {
          input: {
            userId: user.id,
            roleId: selectedRoleId,
            scope: "global",
            isActive: true,
          },
        },
      });
      setSelectedRoleId("");
    } catch (error) {
      console.error("Failed to assign role:", error);
    }
  };

  const handleRevokeRole = async (userRoleId: string) => {
    await revokeRole({
      variables: {
        userRoleId,
      },
    });
  };

  const availableRoles: Role[] = rolesData?.roles || [];
  const userRoles = userRolesData?.userRoles || [];
  const assignedRoleIds = userRoles.map((ur: any) => ur.roleId);
  
  // Get assigned role details by matching roleId
  const assignedRoles = availableRoles.filter(role => 
    assignedRoleIds.includes(role.id)
  );
  
  // Filter out roles that are already assigned
  // Only include roles that are assignable and belong to the user's organization (or system roles)
  const unassignedRoles = availableRoles.filter(
    (role) =>
      !assignedRoleIds.includes(role.id) && 
      role.isAssignable !== false &&
      (role.organizationId === organizationId || role.organizationId === null)
  );

  console.log("Available roles count:", availableRoles.length);
  console.log("Unassigned roles count:", unassignedRoles.length);
  console.log("Available roles:", availableRoles.map(r => ({ id: r.id, name: r.name, isAssignable: r.isAssignable, organizationId: r.organizationId })));

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user details and settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName">First Name</Label>
              <Input
                id="edit-firstName"
                value={form.firstName || ""}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastName">Last Name</Label>
              <Input
                id="edit-lastName"
                value={form.lastName || ""}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-username">Username</Label>
            <Input
              id="edit-username"
              value={form.username || ""}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="johndoe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1234567890"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={form.status || ""}
              onValueChange={(value) => setForm({ ...form, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3 border-t pt-4">
            <Label>Roles</Label>
            <div className="space-y-2">
              {assignedRoles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {assignedRoles.map((role: Role) => {
                    const userRoleId = userRoles.find((ur: any) => ur.roleId === role.id)?.id;
                    return (
                      <Badge
                        key={role.id}
                        variant="default"
                        className="flex items-center gap-1"
                      >
                        {role.name}
                        <button
                          onClick={() => userRoleId && handleRevokeRole(userRoleId)}
                          className="ml-1 hover:text-destructive"
                          type="button"
                        >
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No roles assigned</p>
              )}
            </div>
            
            {(rolesLoading ? (
              <p className="text-sm text-muted-foreground">Loading roles...</p>
            ) : unassignedRoles.length > 0 ? (
              <div className="flex gap-2">
                <Select
                  value={selectedRoleId}
                  onValueChange={setSelectedRoleId}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select role to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {unassignedRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={handleAssignRole}
                  disabled={!selectedRoleId}
                  size="sm"
                >
                  Assign
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No roles available to assign</p>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update User</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

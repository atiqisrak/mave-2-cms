"use client";

import { useState, useMemo } from "react";
import { useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Users } from "lucide-react";
import {
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION,
  DELETE_USER_MUTATION,
} from "@/lib/graphql/user-queries";
import { useAllUsers } from "@/hooks/use-all-users";
import { CreateUserModal } from "./create-user-modal";
import { EditUserModal } from "./edit-user-modal";
import { UserTable } from "./user-table";
import { OrganizationGroup } from "./organization-group";

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

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface CreateUserInput {
  organizationId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  phone?: string;
}

interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  status?: string;
}

export function UserManagementTable() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"name" | "role" | "created">("name");

  const { users, organizations, loading, error, refetch } = useAllUsers();

  const [createUser] = useMutation(CREATE_USER_MUTATION, {
    onCompleted: () => {
      toast.success("User created successfully!");
      setIsCreateModalOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      toast.success("User updated successfully!");
      setIsEditModalOpen(false);
      setEditingUser(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => {
      toast.success("User deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateSubmit = async (data: CreateUserInput) => {
    await createUser({
      variables: {
        input: {
          organizationId: data.organizationId,
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username || undefined,
          phone: data.phone || undefined,
        },
      },
    });
  };

  const handleEditSubmit = async (data: UpdateUserInput) => {
    if (!editingUser) return;

    await updateUser({
      variables: {
        id: editingUser.id,
        input: data,
      },
    });
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser({
        variables: { id: userId },
      });
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const toggleOrgExpansion = (orgId: string) => {
    const newExpanded = new Set(expandedOrgs);
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
    }
    setExpandedOrgs(newExpanded);
  };

  // Group users by organization and sort them
  const groupedUsers = useMemo(() => {
    if (!users || !organizations) return {};

    // Group users by organization
    const grouped: Record<string, { org: Organization; users: User[] }> = {};

    organizations.forEach((org: Organization) => {
      grouped[org.id] = {
        org,
        users: users.filter((user: User) => user.organizationId === org.id),
      };
    });

    // Sort users within each organization
    Object.keys(grouped).forEach((orgId) => {
      grouped[orgId].users.sort((a, b) => {
        switch (sortBy) {
          case "name":
            return `${a.firstName} ${a.lastName}`.localeCompare(
              `${b.firstName} ${b.lastName}`
            );
          case "role":
            const aRole = a.roles?.[0]?.role?.slug || "";
            const bRole = b.roles?.[0]?.role?.slug || "";
            return aRole.localeCompare(bRole);
          case "created":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          default:
            return 0;
        }
      });
    });

    return grouped;
  }, [users, organizations, sortBy]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users
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
            <Users className="h-5 w-5" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive">
              Error loading users: {error.message}
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalUsers = users?.length || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users ({totalUsers})
            </CardTitle>
            <CardDescription>
              Manage all users across organizations
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={sortBy}
              onValueChange={(value: "name" | "role" | "created") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="role">Sort by Role</SelectItem>
                <SelectItem value="created">Sort by Created</SelectItem>
              </SelectContent>
            </Select>
            <CreateUserModal
              isOpen={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
              organizations={organizations || []}
              onSubmit={handleCreateSubmit}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedUsers).map(([orgId, { org, users }]) => (
            <OrganizationGroup
              key={orgId}
              org={org}
              users={users}
              isExpanded={expandedOrgs.has(orgId)}
              onToggle={() => toggleOrgExpansion(orgId)}
            >
              <UserTable
                users={users}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            </OrganizationGroup>
          ))}
        </div>

        <EditUserModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          user={editingUser}
          onSubmit={handleEditSubmit}
          organizationId={editingUser?.organizationId}
        />
      </CardContent>
    </Card>
  );
}

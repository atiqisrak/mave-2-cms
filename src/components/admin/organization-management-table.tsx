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
import { Building2 } from "lucide-react";
import {
  ALL_ORGANIZATIONS_QUERY,
  CREATE_ORGANIZATION_MUTATION,
  UPDATE_ORGANIZATION_MUTATION,
  DELETE_ORGANIZATION_MUTATION,
} from "@/lib/graphql/organization-queries";
import { CreateOrganizationModal } from "./create-organization-modal";
import { EditOrganizationModal } from "./edit-organization-modal";
import { OrganizationTable } from "./organization-table";

interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  plan: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
  };
}

interface CreateOrganizationInput {
  name: string;
  slug: string;
  domain?: string;
  plan?: string;
  customSubdomain?: string;
  autoGenerateSubdomain?: boolean;
}

interface UpdateOrganizationInput {
  name?: string;
  domain?: string;
  plan?: string;
  isActive?: boolean;
}

export function OrganizationManagementTable() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const { data, loading, error, refetch } = useQuery(ALL_ORGANIZATIONS_QUERY, {
    variables: { skip: 0, take: 100 },
  });

  const [createOrganization] = useMutation(CREATE_ORGANIZATION_MUTATION, {
    onCompleted: () => {
      toast.success("Organization created successfully!");
      setIsCreateModalOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION_MUTATION, {
    onCompleted: () => {
      toast.success("Organization updated successfully!");
      setIsEditModalOpen(false);
      setEditingOrg(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [deleteOrganization] = useMutation(DELETE_ORGANIZATION_MUTATION, {
    onCompleted: () => {
      toast.success("Organization deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateSubmit = async (data: CreateOrganizationInput) => {
    await createOrganization({
      variables: {
        input: {
          name: data.name,
          slug: data.slug,
          domain: data.domain || undefined,
          plan: data.plan,
          customSubdomain: data.customSubdomain || undefined,
          autoGenerateSubdomain: data.autoGenerateSubdomain,
        },
      },
    });
  };

  const handleEditSubmit = async (data: UpdateOrganizationInput) => {
    if (!editingOrg) return;

    await updateOrganization({
      variables: {
        id: editingOrg.id,
        input: data,
      },
    });
  };

  const handleDelete = async (orgId: string) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      await deleteOrganization({
        variables: { id: orgId },
      });
    }
  };

  const openEditModal = (org: Organization) => {
    setEditingOrg(org);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organizations
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
            <Building2 className="h-5 w-5" />
            Organizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive">
              Error loading organizations: {error.message}
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const organizations = data?.organizations || [];
  
  // Deduplicate organizations by ID to prevent duplicate key errors
  const uniqueOrganizations = organizations.filter((org: Organization, index: number, self: Organization[]) => 
    index === self.findIndex((o: Organization) => o.id === org.id)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organizations ({uniqueOrganizations.length})
            </CardTitle>
            <CardDescription>
              Manage all organizations in the system
            </CardDescription>
          </div>
          <CreateOrganizationModal
            isOpen={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onSubmit={handleCreateSubmit}
          />
        </div>
      </CardHeader>
      <CardContent>
        <OrganizationTable
          organizations={uniqueOrganizations}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />

        <EditOrganizationModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          organization={editingOrg}
          onSubmit={handleEditSubmit}
        />
      </CardContent>
    </Card>
  );
}

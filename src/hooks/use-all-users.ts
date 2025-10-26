"use client";

import { useQuery } from "@apollo/client";
import { ALL_ORGANIZATIONS_QUERY } from "@/lib/graphql/organization-queries";
import { ALL_USERS_QUERY } from "@/lib/graphql/user-queries";

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
}

interface Organization {
  id: string;
  name: string;
  slug: string;
}

export function useAllUsers() {
  const { data: orgsData, loading: orgsLoading, error: orgsError, refetch: refetchOrgs } = useQuery(
    ALL_ORGANIZATIONS_QUERY,
    {
      variables: { skip: 0, take: 100 },
    }
  );

  // For now, we'll fetch users from the system organization
  // In a real implementation, you'd need to fetch from all organizations
  const { data: usersData, loading: usersLoading, error: usersError, refetch: refetchUsers } = useQuery(
    ALL_USERS_QUERY,
    {
      variables: { 
        organizationId: "37bbe2d7-5dd2-4ab5-a50f-3f94d498e9d8", // System org
        skip: 0, 
        take: 1000 
      },
      skip: !orgsData, // Wait for organizations to load first
    }
  );

  const organizations = orgsData?.organizations || [];
  const users = usersData?.users || [];

  // Add organization info to users
  const usersWithOrg = users.map((user: User) => ({
    ...user,
    organization: organizations.find((org: Organization) => org.id === user.organizationId) || {
      id: user.organizationId,
      name: "Unknown",
      slug: "unknown"
    },
    roles: [] // We'll need to fetch roles separately if needed
  }));

  const refetch = () => {
    refetchOrgs();
    refetchUsers();
  };

  return {
    users: usersWithOrg,
    organizations,
    loading: orgsLoading || usersLoading,
    error: orgsError || usersError,
    refetch,
  };
}

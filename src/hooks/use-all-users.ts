"use client";

import { useQuery } from "@apollo/client";
import { ALL_ORGANIZATIONS_QUERY } from "@/lib/graphql/organization-queries";
import { ALL_USERS_ACROSS_ORGS_QUERY } from "@/lib/graphql/user-queries";

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

export function useAllUsers() {
  const { data: orgsData, loading: orgsLoading, error: orgsError, refetch: refetchOrgs } = useQuery(
    ALL_ORGANIZATIONS_QUERY,
    {
      variables: { skip: 0, take: 100 },
    }
  );

  const { data: usersData, loading: usersLoading, error: usersError, refetch: refetchUsers } = useQuery(
    ALL_USERS_ACROSS_ORGS_QUERY,
    {
      variables: { 
        skip: 0, 
        take: 1000 
      },
    }
  );

  const organizations = orgsData?.organizations || [];
  const users = usersData?.allUsers || [];

  // Add roles to users (empty for now, can be fetched separately if needed)
  const usersWithRoles = users.map((user: User) => ({
    ...user,
    roles: [] // We'll need to fetch roles separately if needed
  }));

  const refetch = () => {
    refetchOrgs();
    refetchUsers();
  };

  return {
    users: usersWithRoles,
    organizations,
    loading: orgsLoading || usersLoading,
    error: orgsError || usersError,
    refetch,
  };
}

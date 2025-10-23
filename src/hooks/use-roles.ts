import { useQuery } from '@apollo/client';
import { GET_ROLES_QUERY } from '@/lib/graphql/queries';
import { Role } from '@/types/auth';

interface GetRolesResponse {
  roles: Role[];
}

export function useRoles() {
  const { data, loading, error, refetch } = useQuery<GetRolesResponse>(GET_ROLES_QUERY, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  });

  return {
    roles: data?.roles || [],
    loading,
    error,
    refetch,
  };
}

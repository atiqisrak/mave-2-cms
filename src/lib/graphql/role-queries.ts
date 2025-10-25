import { gql } from '@apollo/client';

// Role and Permission Queries
export const ROLES_QUERY = gql`
  query Roles($where: RoleWhereInput, $orderBy: [RoleOrderByInput!], $skip: Int, $take: Int) {
    roles(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {
      id
      name
      description
      permissions {
        id
        name
        resource
        action
      }
      _count {
        users
      }
    }
  }
`;

export const GET_ROLES_QUERY = gql`
  query GetRoles {
    roles {
      id
      name
      slug
      description
      permissions
      color
      icon
      priority
      isSystem
      isDefault
    }
  }
`;

export const PERMISSIONS_QUERY = gql`
  query Permissions($where: PermissionWhereInput, $orderBy: [PermissionOrderByInput!], $skip: Int, $take: Int) {
    permissions(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {
      id
      name
      resource
      action
      description
      _count {
        roles
      }
    }
  }
`;

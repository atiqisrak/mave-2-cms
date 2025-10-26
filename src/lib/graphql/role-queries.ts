import { gql } from '@apollo/client';

// Role and Permission Queries
export const ROLES_QUERY = gql`
  query Roles($organizationId: String, $skip: Int, $take: Int) {
    roles(organizationId: $organizationId, skip: $skip, take: $take) {
      id
      name
      slug
      description
      color
      icon
      priority
      isSystem
      isAssignable
      isDefault
      permissions
      level
      roleType
      organizationId
      createdAt
      updatedAt
    }
  }
`;

export const ALL_ROLES_QUERY = gql`
  query AllRoles($skip: Int, $take: Int) {
    roles(skip: $skip, take: $take) {
      id
      name
      slug
      description
      color
      icon
      priority
      isSystem
      isAssignable
      isDefault
      permissions
      level
      roleType
      organizationId
      createdAt
      updatedAt
    }
  }
`;

export const ROLE_QUERY = gql`
  query Role($id: String!) {
    role(id: $id) {
      id
      name
      slug
      description
      color
      icon
      priority
      isSystem
      isAssignable
      isDefault
      permissions
      level
      roleType
      organizationId
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

export const USER_ROLES_QUERY = gql`
  query UserRoles($userId: String!) {
    userRoles(userId: $userId) {
      id
      roleId
      scope
      resourceType
      resourceId
      assignedAt
      isActive
      createdAt
    }
  }
`;

export const ASSIGN_ROLE_MUTATION = gql`
  mutation AssignRole($input: AssignRoleInput!, $assignedBy: String) {
    assignRole(input: $input, assignedBy: $assignedBy) {
      id
      roleId
      userId
      scope
      isActive
      assignedAt
    }
  }
`;

export const REVOKE_ROLE_MUTATION = gql`
  mutation RevokeRole($userRoleId: String!) {
    revokeRole(userRoleId: $userRoleId)
  }
`;

export const CREATE_ROLE_MUTATION = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      id
      name
      slug
      description
      color
      icon
      priority
      isSystem
      isAssignable
      isDefault
      permissions
      level
      roleType
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ROLE_MUTATION = gql`
  mutation UpdateRole($id: String!, $input: UpdateRoleInput!) {
    updateRole(id: $id, input: $input) {
      id
      name
      slug
      description
      color
      icon
      priority
      isSystem
      isAssignable
      isDefault
      permissions
      level
      roleType
      updatedAt
    }
  }
`;

export const DELETE_ROLE_MUTATION = gql`
  mutation DeleteRole($id: String!) {
    removeRole(id: $id) {
      id
      name
    }
  }
`;

export const PERMISSIONS_QUERY = gql`
  query Permissions($skip: Int, $take: Int) {
    permissions(skip: $skip, take: $take) {
      id
      name
      slug
      description
      module
      category
      permissionType
      riskLevel
      requiresMfa
      requiresApproval
      isActive
      isSystem
      isDeprecated
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PERMISSION_MUTATION = gql`
  mutation CreatePermission($input: CreatePermissionInput!) {
    createPermission(input: $input) {
      id
      name
      slug
      description
      module
      category
      permissionType
      riskLevel
      requiresMfa
      requiresApproval
      isActive
      isSystem
    }
  }
`;

export const UPDATE_PERMISSION_MUTATION = gql`
  mutation UpdatePermission($id: String!, $input: UpdatePermissionInput!) {
    updatePermission(id: $id, input: $input) {
      id
      name
      slug
      description
      module
      category
      isActive
    }
  }
`;

export const DELETE_PERMISSION_MUTATION = gql`
  mutation DeletePermission($id: String!) {
    removePermission(id: $id) {
      id
      name
    }
  }
`;

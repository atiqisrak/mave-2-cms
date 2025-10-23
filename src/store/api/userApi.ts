import { baseApi } from './baseApi';
import { createGraphQLMutation, createGraphQLQuery } from './baseApi';
import { User, UpdateUserInput, ChangePasswordInput, UserRole, Permission } from '@/types/auth';

const UPDATE_USER_MUTATION = `
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      firstName
      lastName
      phone
      timezone
      locale
      status
      updatedAt
    }
  }
`;

const CHANGE_PASSWORD_MUTATION = `
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

const GET_USER_QUERY = `
  query GetUser($id: String!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      phone
      timezone
      locale
      status
      twoFactorEnabled
      lastLoginAt
      createdAt
      updatedAt
      organization {
        id
        name
        slug
      }
    }
  }
`;

const GET_USER_ROLES_QUERY = `
  query GetUserRoles($userId: String!) {
    userRoles(userId: $userId) {
      id
      roleId
      role {
        id
        name
        slug
        description
        color
        icon
        priority
        isSystem
      }
      scope
      isActive
      assignedAt
    }
  }
`;

const GET_USER_PERMISSIONS_QUERY = `
  query GetUserPermissions($userId: String!) {
    userPermissionsWithDetails(userId: $userId) {
      id
      name
      slug
      module
      category
      riskLevel
      requiresMfa
      requiresApproval
    }
  }
`;

const GET_USERS_QUERY = `
  query GetUsers($organizationId: String!) {
    users(organizationId: $organizationId) {
      id
      email
      firstName
      lastName
      status
      twoFactorEnabled
      lastLoginAt
      createdAt
      organization {
        id
        name
      }
    }
  }
`;

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation<User, { id: string; input: UpdateUserInput }>({
      queryFn: createGraphQLMutation(UPDATE_USER_MUTATION),
      invalidatesTags: ['User'],
    }),
    
    changePassword: builder.mutation<boolean, ChangePasswordInput>({
      queryFn: createGraphQLMutation(CHANGE_PASSWORD_MUTATION),
    }),
    
    getUser: builder.query<User, { id: string }>({
      queryFn: createGraphQLQuery(GET_USER_QUERY),
      providesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    
    getUserRoles: builder.query<UserRole[], { userId: string }>({
      queryFn: createGraphQLQuery(GET_USER_ROLES_QUERY),
      providesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),
    
    getUserPermissions: builder.query<Permission[], { userId: string }>({
      queryFn: createGraphQLQuery(GET_USER_PERMISSIONS_QUERY),
      providesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),
    
    getUsers: builder.query<User[], { organizationId: string }>({
      queryFn: createGraphQLQuery(GET_USERS_QUERY),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useChangePasswordMutation,
  useGetUserQuery,
  useGetUserRolesQuery,
  useGetUserPermissionsQuery,
  useGetUsersQuery,
} = userApi;

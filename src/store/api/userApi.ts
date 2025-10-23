import { baseApi, graphqlQuery } from './baseApi';
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
  overrideExisting: true,
  endpoints: (builder) => ({
    updateUser: builder.mutation<User, { id: string; input: UpdateUserInput }>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: UPDATE_USER_MUTATION,
          variables: args,
        },
      }),
      transformResponse: (response: any) => response.data.updateUser,
      invalidatesTags: ['User'],
    }),
    
    changePassword: builder.mutation<boolean, ChangePasswordInput>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: CHANGE_PASSWORD_MUTATION,
          variables: args,
        },
      }),
      transformResponse: (response: any) => response.data.changePassword,
    }),
    
    getUser: builder.query<User, { id: string }>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: GET_USER_QUERY,
          variables: args,
        },
      }),
      transformResponse: (response: any) => response.data.user,
      providesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    
    getUserRoles: builder.query<UserRole[], { userId: string }>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: GET_USER_ROLES_QUERY,
          variables: args,
        },
      }),
      transformResponse: (response: any) => response.data.userRoles,
      providesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),
    
    getUserPermissions: builder.query<Permission[], { userId: string }>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: GET_USER_PERMISSIONS_QUERY,
          variables: args,
        },
      }),
      transformResponse: (response: any) => response.data.userPermissionsWithDetails,
      providesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),
    
    getUsers: builder.query<User[], { organizationId: string }>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: GET_USERS_QUERY,
          variables: args,
        },
      }),
      transformResponse: (response: any) => response.data.users,
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

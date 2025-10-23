import { baseApi, graphqlQuery } from './baseApi';
import { 
  AuthResponse, 
  LoginInput, 
  RegisterInput, 
  User, 
  Organization,
  CreateOrganizationInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
  UserRole,
  Permission
} from '@/types/auth';

// GraphQL Queries and Mutations
const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        organizationId
      }
    }
  }
`;

const REGISTER_MUTATION = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        organizationId
      }
    }
  }
`;

const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        organizationId
      }
    }
  }
`;

const LOGOUT_MUTATION = `
  mutation Logout {
    logout
  }
`;

const GET_CURRENT_USER_QUERY = `
  query GetCurrentUser {
    me {
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
        domain
        plan
        settings
        branding
        isActive
        createdAt
        updatedAt
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
        permissions
        color
        icon
        priority
        isSystem
        isDefault
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
      isActive
    }
  }
`;

const VALIDATE_TOKEN_QUERY = `
  query ValidateToken {
    validateToken
  }
`;

const GET_USER_DETAILS_QUERY = `
  query GetUserDetails($id: String!) {
    userDetails(id: $id) {
      user {
        id
        organizationId
        email
        username
        firstName
        lastName
        phone
        avatarUrl
        bio
        emailVerifiedAt
        twoFactorEnabled
        lastLoginAt
        lastLoginIp
        lastActivityAt
        status
        isSystem
        timezone
        locale
        preferences
        metadata
        createdAt
        updatedAt
        deletedAt
      }
      organization {
        id
        name
        slug
        domain
        plan
        settings
        branding
        isActive
        createdAt
        updatedAt
        deletedAt
      }
      roles {
        id
        userId
        roleId
        scope
        resourceType
        resourceId
        conditions
        startsAt
        expiresAt
        assignedBy
        assignedReason
        assignedAt
        isActive
        createdAt
        role {
          id
          name
          slug
          description
          parentRoleId
          level
          roleType
          isSystem
          isAssignable
          isDefault
          permissions
          color
          icon
          priority
          metadata
          createdAt
          updatedAt
          deletedAt
        }
      }
      permissions
      detailedPermissions {
        id
        name
        slug
        description
        module
        category
        permissionType
        dependsOn
        conflictsWith
        riskLevel
        requiresMfa
        requiresApproval
        isSystem
        isActive
        isDeprecated
        metadata
        createdAt
        updatedAt
      }
    }
  }
`;

const CREATE_ORGANIZATION_MUTATION = `
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      slug
      domain
      plan
      settings
      branding
      isActive
      createdAt
    }
  }
`;

const UPDATE_ORGANIZATION_MUTATION = `
  mutation UpdateOrganization($id: String!, $input: UpdateOrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
      id
      name
      slug
      domain
      plan
      settings
      branding
      isActive
      updatedAt
    }
  }
`;

const REQUEST_PASSWORD_RESET_MUTATION = `
  mutation RequestPasswordReset($organizationSlug: String!, $email: String!) {
    requestPasswordReset(organizationSlug: $organizationSlug, email: $email)
  }
`;

const RESET_PASSWORD_MUTATION = `
  mutation ResetPassword($resetToken: String!, $newPassword: String!) {
    resetPassword(resetToken: $resetToken, newPassword: $newPassword)
  }
`;

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginInput>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: LOGIN_MUTATION,
          variables: { input: args },
        },
      }),
      transformResponse: (response: any) => response.data.login,
    }),
    
    register: builder.mutation<AuthResponse, RegisterInput>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: REGISTER_MUTATION,
          variables: { input: args },
        },
      }),
      transformResponse: (response: any) => response.data.register,
    }),
    
    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: REFRESH_TOKEN_MUTATION,
          variables: { input: args },
        },
      }),
      transformResponse: (response: any) => response.data.refreshToken,
    }),
    
    logout: builder.mutation<boolean, void>({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: LOGOUT_MUTATION,
          variables: {},
        },
      }),
      transformResponse: (response: any) => response.data.logout,
    }),
    
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: GET_CURRENT_USER_QUERY,
          variables: {},
        },
      }),
      transformResponse: (response: any) => response.data.me,
      providesTags: ['User'],
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
    
    validateToken: builder.query<boolean, void>({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: VALIDATE_TOKEN_QUERY,
          variables: {},
        },
      }),
      transformResponse: (response: any) => response.data.validateToken,
    }),
    
    getUserDetails: builder.query<any, { id: string }>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: GET_USER_DETAILS_QUERY,
          variables: args,
        },
      }),
      transformResponse: (response: any) => response.data.userDetails,
      providesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    
    createOrganization: builder.mutation<Organization, CreateOrganizationInput>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: CREATE_ORGANIZATION_MUTATION,
          variables: { input: args },
        },
      }),
      transformResponse: (response: any) => response.data.createOrganization,
      invalidatesTags: ['Organization'],
    }),
    
    updateOrganization: builder.mutation<Organization, { id: string; input: any }>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: UPDATE_ORGANIZATION_MUTATION,
          variables: args,
        },
      }),
      transformResponse: (response: any) => response.data.updateOrganization,
      invalidatesTags: ['Organization'],
    }),
    
    requestPasswordReset: builder.mutation<boolean, RequestPasswordResetInput>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: REQUEST_PASSWORD_RESET_MUTATION,
          variables: args,
        },
      }),
      transformResponse: (response: any) => response.data.requestPasswordReset,
    }),
    
    resetPassword: builder.mutation<boolean, ResetPasswordInput>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: RESET_PASSWORD_MUTATION,
          variables: args,
        },
      }),
      transformResponse: (response: any) => response.data.resetPassword,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useGetUserRolesQuery,
  useGetUserPermissionsQuery,
  useValidateTokenQuery,
  useGetUserDetailsQuery,
  useLazyGetUserDetailsQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi;
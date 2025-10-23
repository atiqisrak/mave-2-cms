import { baseApi } from './baseApi';
import { createGraphQLMutation, createGraphQLQuery } from './baseApi';
import { 
  AuthResponse, 
  LoginInput, 
  RegisterInput, 
  User, 
  Organization,
  CreateOrganizationInput,
  RequestPasswordResetInput,
  ResetPasswordInput
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

const ME_QUERY = `
  query Me {
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
      }
    }
  }
`;

const VALIDATE_TOKEN_QUERY = `
  query ValidateToken {
    validateToken
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

const VALIDATE_INVITATION_QUERY = `
  query ValidateInvitation($input: ValidateInvitationInput!) {
    validateInvitationToken(input: $input) {
      isValid
      invitation {
        id
        email
        roleId
        organizationId
        expiresAt
        status
        type
      }
      error
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
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginInput>({
      queryFn: createGraphQLMutation(LOGIN_MUTATION),
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation<AuthResponse, RegisterInput>({
      queryFn: createGraphQLMutation(REGISTER_MUTATION),
      invalidatesTags: ['User', 'Organization'],
    }),
    
    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      queryFn: createGraphQLMutation(REFRESH_TOKEN_MUTATION),
    }),
    
    logout: builder.mutation<boolean, void>({
      queryFn: createGraphQLMutation(LOGOUT_MUTATION),
      invalidatesTags: ['User'],
    }),
    
    getCurrentUser: builder.query<User, void>({
      queryFn: createGraphQLQuery(ME_QUERY),
      providesTags: ['User'],
    }),
    
    validateToken: builder.query<boolean, void>({
      queryFn: createGraphQLQuery(VALIDATE_TOKEN_QUERY),
    }),
    
    createOrganization: builder.mutation<Organization, CreateOrganizationInput>({
      queryFn: createGraphQLMutation(CREATE_ORGANIZATION_MUTATION),
      invalidatesTags: ['Organization'],
    }),
    
    validateInvitation: builder.query<{
      isValid: boolean;
      invitation?: {
        id: string;
        email: string;
        roleId: string;
        organizationId: string;
        expiresAt: string;
        status: string;
        type: string;
      };
      error?: string;
    }, { input: { token: string } }>({
      queryFn: createGraphQLQuery(VALIDATE_INVITATION_QUERY),
    }),
    
    requestPasswordReset: builder.mutation<boolean, RequestPasswordResetInput>({
      queryFn: createGraphQLMutation(REQUEST_PASSWORD_RESET_MUTATION),
    }),
    
    resetPassword: builder.mutation<boolean, ResetPasswordInput>({
      queryFn: createGraphQLMutation(RESET_PASSWORD_MUTATION),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useValidateTokenQuery,
  useCreateOrganizationMutation,
  useValidateInvitationQuery,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi;

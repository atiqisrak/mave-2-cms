import { baseApi } from './baseApi';
import { createGraphQLMutation, createGraphQLQuery, graphqlQuery } from './baseApi';
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
      organizationId
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
      queryFn: async (variables: LoginInput, { getState }) => {
        const result = await createGraphQLMutation(LOGIN_MUTATION)(variables, { getState });
        // Transform the GraphQL response to match AuthResponse structure
        return {
          data: result.data.login
        };
      },
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation<AuthResponse, RegisterInput>({
      queryFn: async (variables: RegisterInput, { getState }) => {
        const result = await createGraphQLMutation(REGISTER_MUTATION)(variables, { getState });
        // Transform the GraphQL response to match AuthResponse structure
        return {
          data: result.data.register
        };
      },
      invalidatesTags: ['User', 'Organization'],
    }),
    
    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      queryFn: async (variables: { refreshToken: string }, { getState }) => {
        const result = await createGraphQLMutation(REFRESH_TOKEN_MUTATION)(variables, { getState });
        // Transform the GraphQL response to match AuthResponse structure
        return {
          data: result.data.refreshToken
        };
      },
    }),
    
    logout: builder.mutation<boolean, void>({
      queryFn: async (variables: void, { getState }) => {
        const result = await createGraphQLMutation(LOGOUT_MUTATION)(variables, { getState });
        // Transform the GraphQL response to return boolean
        return {
          data: result.data.logout
        };
      },
      invalidatesTags: ['User'],
    }),
    
    getCurrentUser: builder.query<User, { userId: string }>({
      queryFn: async (variables: { userId: string }, { getState }) => {
        const result = await createGraphQLQuery(GET_USER_QUERY)(variables, { getState });
        // Transform the GraphQL response to match User structure
        return {
          data: result.data.user
        };
      },
      providesTags: ['User'],
    }),
    
    validateToken: builder.query<boolean, void>({
      queryFn: async (variables: void, { getState }) => {
        const result = await createGraphQLQuery(VALIDATE_TOKEN_QUERY)(variables, { getState });
        // Transform the GraphQL response to return boolean
        return {
          data: result.data.validateToken
        };
      },
    }),
    
    createOrganization: builder.mutation<Organization, CreateOrganizationInput>({
      queryFn: async (variables: CreateOrganizationInput, { getState }) => {
        const result = await createGraphQLMutation(CREATE_ORGANIZATION_MUTATION)(variables, { getState });
        // Transform the GraphQL response to match Organization structure
        return {
          data: result.data.createOrganization
        };
      },
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
      queryFn: async (variables: { input: { token: string } }, { getState }) => {
        const result = await createGraphQLQuery(VALIDATE_INVITATION_QUERY)(variables, { getState });
        // Transform the GraphQL response to match the expected structure
        return {
          data: result.data.validateInvitationToken
        };
      },
    }),
    
    requestPasswordReset: builder.mutation<boolean, RequestPasswordResetInput>({
      queryFn: async (variables: RequestPasswordResetInput, { getState }) => {
        // This mutation doesn't use input pattern, pass variables directly
        const result = await graphqlQuery(REQUEST_PASSWORD_RESET_MUTATION, variables, getState as any);
        // Transform the GraphQL response to return boolean
        return {
          data: result.data.requestPasswordReset
        };
      },
    }),
    
    resetPassword: builder.mutation<boolean, ResetPasswordInput>({
      queryFn: async (variables: ResetPasswordInput, { getState }) => {
        // This mutation doesn't use input pattern, pass variables directly
        const result = await graphqlQuery(RESET_PASSWORD_MUTATION, variables, getState as any);
        // Transform the GraphQL response to return boolean
        return {
          data: result.data.resetPassword
        };
      },
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

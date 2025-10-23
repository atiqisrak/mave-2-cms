import { baseApi } from './baseApi';
import { createGraphQLMutation, createGraphQLQuery } from './baseApi';
import { 
  CreateInvitationInput, 
  Invitation, 
  ValidateInvitationInput, 
  ValidateInvitationResponse,
  RegisterWithInvitationInput,
  RegisterWithInvitationResponse,
  ListInvitationsInput,
  ListInvitationsResponse,
  ResendInvitationInput,
  RevokeInvitationInput
} from '@/types/auth';

const INVITE_USER_BY_EMAIL_MUTATION = `
  mutation InviteUserByEmail($input: CreateInvitationInput!) {
    inviteUserByEmail(input: $input) {
      id
      email
      token
      roleId
      organizationId
      invitedBy
      expiresAt
      status
      type
      createdAt
    }
  }
`;

const CREATE_SHAREABLE_INVITE_LINK_MUTATION = `
  mutation CreateShareableInviteLink($input: CreateInvitationInput!) {
    createShareableInviteLink(input: $input) {
      id
      token
      roleId
      organizationId
      invitedBy
      expiresAt
      status
      type
      maxUses
      usedCount
      createdAt
    }
  }
`;

const VALIDATE_INVITATION_TOKEN_QUERY = `
  query ValidateInvitationToken($input: ValidateInvitationInput!) {
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

const GET_INVITATION_QUERY = `
  query GetInvitation($token: String!) {
    getInvitation(token: $token) {
      id
      email
      token
      roleId
      organizationId
      invitedBy
      acceptedBy
      acceptedAt
      expiresAt
      status
      type
      maxUses
      usedCount
      createdAt
      organization {
        id
        name
        slug
      }
      role {
        id
        name
        slug
        permissions
      }
    }
  }
`;

const LIST_INVITATIONS_QUERY = `
  query ListInvitations($input: ListInvitationsInput!) {
    listInvitations(input: $input) {
      invitations {
        id
        email
        token
        roleId
        organizationId
        invitedBy
        acceptedBy
        acceptedAt
        expiresAt
        status
        type
        maxUses
        usedCount
        createdAt
      }
      total
      hasMore
    }
  }
`;

const RESEND_INVITE_MUTATION = `
  mutation ResendInvite($input: ResendInvitationInput!) {
    resendInvite(input: $input)
  }
`;

const REVOKE_INVITE_MUTATION = `
  mutation RevokeInvite($input: RevokeInvitationInput!) {
    revokeInvite(input: $input)
  }
`;

const REGISTER_WITH_INVITATION_MUTATION = `
  mutation RegisterWithInvitation($input: RegisterWithInvitationInput!) {
    registerWithInvitation(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        organizationId
      }
      invitation {
        id
        status
        acceptedAt
      }
    }
  }
`;

export const invitationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    inviteUserByEmail: builder.mutation<Invitation, CreateInvitationInput>({
      queryFn: createGraphQLMutation(INVITE_USER_BY_EMAIL_MUTATION),
      invalidatesTags: ['Invitation'],
    }),
    
    createShareableInviteLink: builder.mutation<Invitation, CreateInvitationInput>({
      queryFn: createGraphQLMutation(CREATE_SHAREABLE_INVITE_LINK_MUTATION),
      invalidatesTags: ['Invitation'],
    }),
    
    validateInvitationToken: builder.query<ValidateInvitationResponse, ValidateInvitationInput>({
      queryFn: createGraphQLQuery(VALIDATE_INVITATION_TOKEN_QUERY),
    }),
    
    getInvitation: builder.query<Invitation, { token: string }>({
      queryFn: createGraphQLQuery(GET_INVITATION_QUERY),
      providesTags: (result, error, { token }) => [{ type: 'Invitation', id: token }],
    }),
    
    listInvitations: builder.query<ListInvitationsResponse, ListInvitationsInput>({
      queryFn: createGraphQLQuery(LIST_INVITATIONS_QUERY),
      providesTags: ['Invitation'],
    }),
    
    resendInvite: builder.mutation<boolean, ResendInvitationInput>({
      queryFn: createGraphQLMutation(RESEND_INVITE_MUTATION),
    }),
    
    revokeInvite: builder.mutation<boolean, RevokeInvitationInput>({
      queryFn: createGraphQLMutation(REVOKE_INVITE_MUTATION),
      invalidatesTags: ['Invitation'],
    }),
    
    registerWithInvitation: builder.mutation<RegisterWithInvitationResponse, RegisterWithInvitationInput>({
      queryFn: createGraphQLMutation(REGISTER_WITH_INVITATION_MUTATION),
      invalidatesTags: ['User', 'Invitation'],
    }),
  }),
});

export const {
  useInviteUserByEmailMutation,
  useCreateShareableInviteLinkMutation,
  useValidateInvitationTokenQuery,
  useGetInvitationQuery,
  useListInvitationsQuery,
  useResendInviteMutation,
  useRevokeInviteMutation,
  useRegisterWithInvitationMutation,
} = invitationApi;

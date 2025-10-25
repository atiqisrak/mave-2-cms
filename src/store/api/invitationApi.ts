import { baseApi } from './baseApi';
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

export const invitationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    inviteUserByEmail: builder.mutation<Invitation, CreateInvitationInput>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: INVITE_USER_BY_EMAIL_MUTATION,
          variables: { input: args },
        },
      }),
      transformResponse: (response: any) => response.data.inviteUserByEmail,
      invalidatesTags: ['Invitation'],
    }),
    
    createShareableInviteLink: builder.mutation<Invitation, CreateInvitationInput>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: CREATE_SHAREABLE_INVITE_LINK_MUTATION,
          variables: { input: args },
        },
      }),
      transformResponse: (response: any) => response.data.createShareableInviteLink,
      invalidatesTags: ['Invitation'],
    }),
    
    validateInvitationToken: builder.query<ValidateInvitationResponse, ValidateInvitationInput>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: VALIDATE_INVITATION_TOKEN_QUERY,
          variables: { input: args },
        },
      }),
      transformResponse: (response: any) => {
        console.log('ValidateInvitationToken response:', response);
        if (!response.data) {
          console.error('No data in response:', response);
          throw new Error('No data received from server');
        }
        return response.data.validateInvitationToken;
      },
    }),
    
    getInvitation: builder.query<Invitation, { token: string }>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: GET_INVITATION_QUERY,
          variables: args,
        },
      }),
      transformResponse: (response: any) => response.data.getInvitation,
      providesTags: (result, error, { token }) => [{ type: 'Invitation', id: token }],
    }),
    
    listInvitations: builder.query<ListInvitationsResponse, ListInvitationsInput>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: LIST_INVITATIONS_QUERY,
          variables: { input: args },
        },
      }),
      transformResponse: (response: any) => response.data.listInvitations,
      providesTags: ['Invitation'],
    }),
    
    resendInvite: builder.mutation<boolean, ResendInvitationInput>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: RESEND_INVITE_MUTATION,
          variables: { input: args },
        },
      }),
      transformResponse: (response: any) => response.data.resendInvite,
    }),
    
    revokeInvite: builder.mutation<boolean, RevokeInvitationInput>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: REVOKE_INVITE_MUTATION,
          variables: { input: args },
        },
      }),
      transformResponse: (response: any) => response.data.revokeInvite,
      invalidatesTags: ['Invitation'],
    }),
    
    registerWithInvitation: builder.mutation<RegisterWithInvitationResponse, RegisterWithInvitationInput>({
      query: (args) => ({
        url: '',
        method: 'POST',
        body: {
          query: REGISTER_WITH_INVITATION_MUTATION,
          variables: { input: args },
        },
      }),
      transformResponse: (response: any) => response.data.registerWithInvitation,
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

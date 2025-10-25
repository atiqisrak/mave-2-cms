export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  timezone?: string;
  locale?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  organization?: Organization;
  roles?: UserRole[];
  permissions?: Permission[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  plan: 'free' | 'pro' | 'enterprise';
  settings?: Record<string, any>;
  branding?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  role: Role;
  scope: 'global' | 'organization';
  isActive: boolean;
  assignedAt: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  permissions: string[];
  color?: string;
  icon?: string;
  priority: number;
  isSystem: boolean;
  isDefault: boolean;
}

export interface Permission {
  id: string;
  name: string;
  slug: string;
  description?: string;
  module: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresMfa: boolean;
  requiresApproval: boolean;
  isActive: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  organization?: Organization;
  requiresTwoFactor?: boolean;
  twoFactorToken?: string;
}

export interface LoginInput {
  organizationId?: string;
  organizationSlug?: string;
  emailOrUsername: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterInput {
  organizationId?: string;
  organizationSlug?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
  invitationToken?: string;
}

export interface Invitation {
  id: string;
  email?: string;
  token: string;
  roleId: string;
  organizationId: string;
  invitedBy: string;
  acceptedBy?: string;
  acceptedAt?: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  type: 'email' | 'shareable';
  maxUses?: number;
  usedCount?: number;
  createdAt: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  role?: {
    id: string;
    name: string;
    slug: string;
    permissions: string[];
  };
}

export interface InvitationToken {
  token: string;
  email: string;
  organizationId: string;
  roleId: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  organization: Organization | null;
  roles: UserRole[];
  permissions: Permission[];
  invitationToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  plan?: 'free' | 'pro' | 'enterprise';
  description?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  timezone?: string;
  locale?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface RequestPasswordResetInput {
  organizationSlug: string;
  email: string;
}

export interface ResetPasswordInput {
  resetToken: string;
  newPassword: string;
}

export interface CreateInvitationInput {
  organizationId: string;
  email?: string;
  roleId: string;
  expiresInDays?: number;
  maxUses?: number;
}

export interface ValidateInvitationInput {
  token: string;
}

export interface ValidateInvitationResponse {
  isValid: boolean;
  invitation?: Invitation;
  error?: string;
}

export interface RegisterWithInvitationInput {
  token: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
}

export interface RegisterWithInvitationResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  organization?: Organization;
  invitation: {
    id: string;
    status: string;
    acceptedAt: string;
  };
}

export interface ListInvitationsInput {
  organizationId: string;
  status?: 'pending' | 'accepted' | 'expired' | 'revoked';
  skip?: number;
  take?: number;
}

export interface ListInvitationsResponse {
  invitations: Invitation[];
  total: number;
  hasMore: boolean;
}

export interface ResendInvitationInput {
  invitationId: string;
}

export interface RevokeInvitationInput {
  invitationId: string;
}

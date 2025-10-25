import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Organization, AuthTokens, AuthState, UserRole, Permission, AuthUser } from '@/types/auth';

// Helper functions for localStorage
const saveToLocalStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const loadFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

const clearFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  const savedTokens = loadFromLocalStorage('mave_cms_tokens');
  const savedUser = loadFromLocalStorage('mave_cms_user');
  const savedOrganization = loadFromLocalStorage('mave_cms_organization');
  const savedRoles = loadFromLocalStorage('mave_cms_roles') || [];
  const savedPermissions = loadFromLocalStorage('mave_cms_permissions') || [];
  
  return {
    user: savedUser,
    tokens: savedTokens,
    isAuthenticated: !!(savedTokens?.accessToken && savedUser),
    organization: savedOrganization,
    roles: savedRoles,
    permissions: savedPermissions,
    invitationToken: null,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AuthUser; tokens: AuthTokens; organization?: Organization }>) => {
      const { user, tokens, organization } = action.payload;
      // Convert AuthUser to User with default values
      const fullUser: User = {
        ...user,
        phone: undefined,
        timezone: 'UTC',
        locale: 'en',
        status: 'active' as const,
        twoFactorEnabled: false,
        lastLoginAt: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        organization: organization || undefined,
        roles: [],
        permissions: [],
      };
      state.user = fullUser;
      state.tokens = tokens;
      state.organization = organization || null;
      state.isAuthenticated = true;
      state.error = null;
      
      // Save to localStorage
      saveToLocalStorage('mave_cms_user', fullUser);
      saveToLocalStorage('mave_cms_tokens', tokens);
      if (organization) {
        saveToLocalStorage('mave_cms_organization', organization);
      }
    },
    
    setUserData: (state, action: PayloadAction<{
      user: User;
      organization?: Organization;
      roles: UserRole[];
      permissions: Permission[];
    }>) => {
      const { user, organization, roles, permissions } = action.payload;
      state.user = user;
      state.organization = organization || null;
      state.roles = roles;
      state.permissions = permissions;
      state.isAuthenticated = true;
      state.error = null;
      
      // Save to localStorage
      saveToLocalStorage('mave_cms_user', user);
      saveToLocalStorage('mave_cms_roles', roles);
      saveToLocalStorage('mave_cms_permissions', permissions);
      if (organization) {
        saveToLocalStorage('mave_cms_organization', organization);
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.tokens = null;
      state.organization = null;
      state.roles = [];
      state.permissions = [];
      state.isAuthenticated = false;
      state.invitationToken = null;
      state.error = null;
      
      // Clear from localStorage
      // clearFromLocalStorage('mave_cms_user');
      // clearFromLocalStorage('mave_cms_tokens');
      // clearFromLocalStorage('mave_cms_organization');
      // clearFromLocalStorage('mave_cms_roles');
      // clearFromLocalStorage('mave_cms_permissions');
      // clearFromLocalStorage('mave_cms_organization_slug');
      // clear all from local storage
      localStorage.clear();
    },
    setInvitationToken: (state, action: PayloadAction<string | null>) => {
      state.invitationToken = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update localStorage
        saveToLocalStorage('mave_cms_user', state.user);
      }
    },
    updateOrganization: (state, action: PayloadAction<Partial<Organization>>) => {
      if (state.organization) {
        state.organization = { ...state.organization, ...action.payload };
        // Update localStorage
        saveToLocalStorage('mave_cms_organization', state.organization);
      }
    },
  },
});

export const {
  setCredentials,
  setUserData,
  clearCredentials,
  setInvitationToken,
  setLoading,
  setError,
  updateUser,
  updateOrganization,
} = authSlice.actions;

export default authSlice.reducer;

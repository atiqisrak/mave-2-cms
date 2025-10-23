import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Organization, AuthTokens, AuthState } from '@/types/auth';

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
  
  return {
    user: savedUser,
    tokens: savedTokens,
    isAuthenticated: !!(savedTokens?.accessToken && savedUser),
    organization: savedOrganization,
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
    setCredentials: (state, action: PayloadAction<{ user: User; tokens: AuthTokens; organization?: Organization }>) => {
      const { user, tokens, organization } = action.payload;
      state.user = user;
      state.tokens = tokens;
      state.organization = organization || user.organization || null;
      state.isAuthenticated = true;
      state.error = null;
      
      // Save to localStorage
      saveToLocalStorage('mave_cms_user', user);
      saveToLocalStorage('mave_cms_tokens', tokens);
      if (organization) {
        saveToLocalStorage('mave_cms_organization', organization);
      }
      
    },
    clearCredentials: (state) => {
      state.user = null;
      state.tokens = null;
      state.organization = null;
      state.isAuthenticated = false;
      state.invitationToken = null;
      state.error = null;
      
      // Clear from localStorage
      clearFromLocalStorage('mave_cms_user');
      clearFromLocalStorage('mave_cms_tokens');
      clearFromLocalStorage('mave_cms_organization');
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
  clearCredentials,
  setInvitationToken,
  setLoading,
  setError,
  updateUser,
  updateOrganization,
} = authSlice.actions;

export default authSlice.reducer;

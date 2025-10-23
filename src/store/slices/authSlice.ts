import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Organization, AuthTokens, AuthState } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  organization: null,
  invitationToken: null,
  isLoading: false,
  error: null,
};

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
    },
    clearCredentials: (state) => {
      state.user = null;
      state.tokens = null;
      state.organization = null;
      state.isAuthenticated = false;
      state.invitationToken = null;
      state.error = null;
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
      }
    },
    updateOrganization: (state, action: PayloadAction<Partial<Organization>>) => {
      if (state.organization) {
        state.organization = { ...state.organization, ...action.payload };
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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'super_admin' | 'manager' | 'employee';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const loadAuthState = (): AuthState => {
  const stored = localStorage.getItem('auth');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { user: null, isAuthenticated: false };
    }
  }
  return { user: null, isAuthenticated: false };
};

const initialState: AuthState = loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      // Mock authentication logic
      const mockUsers: Record<string, AuthUser> = {
        'admin@company.com': {
          id: '1',
          name: 'Super Admin',
          email: 'admin@company.com',
          role: 'super_admin',
          token: 'mock-token-admin',
        },
        'manager@company.com': {
          id: '2',
          name: 'Manager',
          email: 'manager@company.com',
          role: 'manager',
          token: 'mock-token-manager',
        },
        'employee@company.com': {
          id: '3',
          name: 'Employee',
          email: 'employee@company.com',
          role: 'employee',
          token: 'mock-token-employee',
        },
      };

      const user = mockUsers[action.payload.email];
      if (user && action.payload.password === 'password123') {
        state.user = user;
        state.isAuthenticated = true;
        localStorage.setItem('auth', JSON.stringify(state));
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

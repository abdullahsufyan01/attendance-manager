import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mockUsersData from '../../mock/users.json';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'manager' | 'employee';
  branch: string;
  department: string;
  kioskNumber: string;
  startDate: string;
  isActive: boolean;
}

interface UsersState {
  users: User[];
}

const loadUsersState = (): UsersState => {
  const stored = localStorage.getItem('users');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { users: mockUsersData as User[] };
    }
  }
  return { users: mockUsersData as User[] };
};

const initialState: UsersState = loadUsersState();

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      localStorage.setItem('users', JSON.stringify(state));
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
        localStorage.setItem('users', JSON.stringify(state));
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
      localStorage.setItem('users', JSON.stringify(state));
    },
    toggleUserActive: (state, action: PayloadAction<string>) => {
      const user = state.users.find((u) => u.id === action.payload);
      if (user) {
        user.isActive = !user.isActive;
        localStorage.setItem('users', JSON.stringify(state));
      }
    },
  },
});

export const { addUser, updateUser, deleteUser, toggleUserActive } = usersSlice.actions;
export default usersSlice.reducer;

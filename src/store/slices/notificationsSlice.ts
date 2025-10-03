import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mockNotificationsData from '../../mock/notifications.json';

export interface Notification {
  id: string;
  type: 'shift_added' | 'shift_edited' | 'timesheet_submitted' | 'timesheet_approved' | 'timesheet_declined' | 'exceed_limit' | 'auto_clockout';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationPreferences {
  webPush: boolean;
  mobile: boolean;
  email: boolean;
}

interface NotificationsState {
  notifications: Notification[];
  preferences: NotificationPreferences;
}

const loadNotificationsState = (): NotificationsState => {
  const stored = localStorage.getItem('notifications');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return mockNotificationsData as NotificationsState;
    }
  }
  return mockNotificationsData as NotificationsState;
};

const initialState: NotificationsState = loadNotificationsState();

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      localStorage.setItem('notifications', JSON.stringify(state));
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
        localStorage.setItem('notifications', JSON.stringify(state));
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.read = true));
      localStorage.setItem('notifications', JSON.stringify(state));
    },
    updatePreferences: (state, action: PayloadAction<Partial<NotificationPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
      localStorage.setItem('notifications', JSON.stringify(state));
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, updatePreferences } = notificationsSlice.actions;
export default notificationsSlice.reducer;

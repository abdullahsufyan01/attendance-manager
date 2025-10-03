import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mockTimesheetsData from '../../mock/timesheets.json';

export interface Timesheet {
  id: string;
  userId: string;
  userName: string;
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'declined';
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
}

interface TimesheetsState {
  timesheets: Timesheet[];
}

const loadTimesheetsState = (): TimesheetsState => {
  const stored = localStorage.getItem('timesheets');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { timesheets: mockTimesheetsData as Timesheet[] };
    }
  }
  return { timesheets: mockTimesheetsData as Timesheet[] };
};

const initialState: TimesheetsState = loadTimesheetsState();

const timesheetsSlice = createSlice({
  name: 'timesheets',
  initialState,
  reducers: {
    submitTimesheet: (state, action: PayloadAction<string>) => {
      const timesheet = state.timesheets.find((t) => t.id === action.payload);
      if (timesheet && timesheet.status === 'draft') {
        timesheet.status = 'submitted';
        timesheet.submittedAt = new Date().toISOString();
        localStorage.setItem('timesheets', JSON.stringify(state));
      }
    },
    approveTimesheet: (state, action: PayloadAction<{ id: string; approvedBy: string }>) => {
      const timesheet = state.timesheets.find((t) => t.id === action.payload.id);
      if (timesheet && timesheet.status === 'submitted') {
        timesheet.status = 'approved';
        timesheet.approvedAt = new Date().toISOString();
        timesheet.approvedBy = action.payload.approvedBy;
        localStorage.setItem('timesheets', JSON.stringify(state));
      }
    },
    declineTimesheet: (state, action: PayloadAction<string>) => {
      const timesheet = state.timesheets.find((t) => t.id === action.payload);
      if (timesheet && timesheet.status === 'submitted') {
        timesheet.status = 'declined';
        localStorage.setItem('timesheets', JSON.stringify(state));
      }
    },
    reopenTimesheet: (state, action: PayloadAction<string>) => {
      const timesheet = state.timesheets.find((t) => t.id === action.payload);
      if (timesheet && (timesheet.status === 'approved' || timesheet.status === 'declined')) {
        timesheet.status = 'draft';
        delete timesheet.submittedAt;
        delete timesheet.approvedAt;
        delete timesheet.approvedBy;
        localStorage.setItem('timesheets', JSON.stringify(state));
      }
    },
  },
});

export const { submitTimesheet, approveTimesheet, declineTimesheet, reopenTimesheet } = timesheetsSlice.actions;
export default timesheetsSlice.reducer;

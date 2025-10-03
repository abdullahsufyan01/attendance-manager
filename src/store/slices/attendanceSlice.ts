import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mockAttendanceData from '../../mock/attendance.json';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  duration: number;
  status: 'present' | 'absent' | 'late' | 'on_leave';
  branch: string;
}

interface AttendanceState {
  records: AttendanceRecord[];
}

const loadAttendanceState = (): AttendanceState => {
  const stored = localStorage.getItem('attendance');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { records: mockAttendanceData as AttendanceRecord[] };
    }
  }
  return { records: mockAttendanceData as AttendanceRecord[] };
};

const initialState: AttendanceState = loadAttendanceState();

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    updateAttendanceRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      const index = state.records.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
        localStorage.setItem('attendance', JSON.stringify(state));
      }
    },
    addAttendanceRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      state.records.push(action.payload);
      localStorage.setItem('attendance', JSON.stringify(state));
    },
  },
});

export const { updateAttendanceRecord, addAttendanceRecord } = attendanceSlice.actions;
export default attendanceSlice.reducer;

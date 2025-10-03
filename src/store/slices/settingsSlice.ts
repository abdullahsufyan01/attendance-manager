import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mockSettingsData from '../../mock/settings.json';

export interface CompanySettings {
  companyName: string;
  companyCode: string;
  companyId: string;
  industry: string;
  country: string;
  branches: { name: string; manager: string }[];
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  lengthFormat: string;
  logo?: string;
  primaryColor: string;
}

export interface BillingSettings {
  currentPlan: string;
  seats: number;
  cardLast4: string;
  invoices: {
    id: string;
    date: string;
    type: string;
    plan: string;
    amount: number;
    status: string;
  }[];
}

export interface PayrollSettings {
  workDays: number;
  defaultDailyHours: number;
  dailyLimit: number;
  autoClockOut: boolean;
  payrollCycle: string;
  payrollEndDate: string;
  overnightShiftRule: string;
  timesheetApprovalRequired: boolean;
  approvers: string[];
}

export interface GeolocationSettings {
  mode: 'off' | 'clock-in-out' | 'breadcrumbs';
  geoFences: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    radius: number;
  }[];
}

interface SettingsState {
  company: CompanySettings;
  billing: BillingSettings;
  payroll: PayrollSettings;
  geolocation: GeolocationSettings;
}

const loadSettingsState = (): SettingsState => {
  const stored = localStorage.getItem('settings');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return mockSettingsData as SettingsState;
    }
  }
  return mockSettingsData as SettingsState;
};

const initialState: SettingsState = loadSettingsState();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateCompanySettings: (state, action: PayloadAction<Partial<CompanySettings>>) => {
      state.company = { ...state.company, ...action.payload };
      localStorage.setItem('settings', JSON.stringify(state));
    },
    updateBillingSettings: (state, action: PayloadAction<Partial<BillingSettings>>) => {
      state.billing = { ...state.billing, ...action.payload };
      localStorage.setItem('settings', JSON.stringify(state));
    },
    updatePayrollSettings: (state, action: PayloadAction<Partial<PayrollSettings>>) => {
      state.payroll = { ...state.payroll, ...action.payload };
      localStorage.setItem('settings', JSON.stringify(state));
    },
    updateGeolocationSettings: (state, action: PayloadAction<Partial<GeolocationSettings>>) => {
      state.geolocation = { ...state.geolocation, ...action.payload };
      localStorage.setItem('settings', JSON.stringify(state));
    },
  },
});

export const {
  updateCompanySettings,
  updateBillingSettings,
  updatePayrollSettings,
  updateGeolocationSettings,
} = settingsSlice.actions;
export default settingsSlice.reducer;

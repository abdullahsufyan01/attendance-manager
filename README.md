# Attendance Management System

A fully functional React.js frontend for managing employee attendance, timesheets, and reporting with mock data.

## Project Overview

This is a complete attendance management system built with React, Redux Toolkit, and modern UI components. The application uses mock data stored in Redux slices with localStorage persistence, making it ready for API integration when backend services are available.

## Technologies Used

- **React 18** - Latest stable with functional components and hooks
- **Redux Toolkit** - State management with slices (no RTK Query)
- **React Router v6** - Client-side routing
- **TailwindCSS** - Responsive UI styling
- **shadcn/ui** - Modern UI component library
- **Formik + Yup** - Form handling and validation
- **LocalStorage** - Data persistence for mock data
- **Axios** - Reserved for future API integration
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

## Features

### Authentication
- Mock JWT authentication with role-based access
- Roles: `super_admin`, `manager`, `employee`
- Protected routes with automatic redirection
- Logout clears Redux state and localStorage

### Dashboard
- Key performance indicators (KPIs)
- Active users count
- Today's clock-ins
- Pending timesheet approvals
- Recent activity widgets

### User Management (/users)
- List view with search, pagination, and filters
- Add new users
- Edit existing users
- Activate/Deactivate toggle
- User fields: name, email, role, branch, department, kiosk number, start date
- Mock data: 200 diverse users across multiple branches

### Attendance (/attendance)
- Comprehensive attendance records (9,700+ records for 90 days)
- Advanced filters: date, branch, user
- Search functionality
- Edit attendance records (adjust clock in/out times)
- Export to CSV and PDF
- Pagination for large datasets
- Status indicators: present, late, absent, on leave

### Timesheets (/timesheets)
- List view with pagination
- Submit, Approve, Reopen workflows
- Approved entries are locked (cannot edit)
- Role-based actions (only managers/admins can approve)

### Settings
- **Company Settings** (/settings/company)
  - Company information
  - Primary color customization
  - Time zone configuration
  - Date and time format preferences

- **Billing** (/settings/billing)
  - Mock subscription management
  - Plans and pricing
  - Invoice history

- **Payroll** (/settings/payroll)
  - Work days configuration
  - Daily hours limits
  - Auto clock-out settings
  - Timesheet approval rules

- **Geolocation** (/settings/geolocation)
  - Geo-fencing configuration
  - Location tracking modes
  - Site management

### Notifications (/notifications)
- Notification history
- Preferences management (Web Push, Mobile, Email)
- Mark as read functionality
- Notification types: shift changes, timesheet submissions, approvals, limit warnings

### Reports (/reports)
- Attendance reports
- Payroll reports
- Timesheet summaries
- Export to CSV and PDF

### Profile (/profile)
- Edit personal information
- Change password
- View role and permissions

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Mock Login Credentials

Use any of these credentials to log in:

### Super Admin
- Email: `joseph.johnson@company.com`
- Password: `password` (any password works in mock mode)
- Role: super_admin

### Manager
- Email: `thomas.wright@company.com`
- Password: `password`
- Role: manager

### Employee
- Email: `sarah.lewis@company.com`
- Password: `password`
- Role: employee

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── layout/         # Layout components (Sidebar, TopBar)
│   └── ui/             # UI components (shadcn/ui)
├── pages/              # Route pages
│   └── settings/       # Settings sub-pages
├── store/              # Redux store
│   └── slices/         # Redux slices
├── mock/               # Mock JSON data
├── lib/                # Utility functions
└── hooks/              # Custom React hooks
```

## Mock Data

The application includes comprehensive mock data:
- **Users**: 200 users across 10 branches and multiple departments
- **Attendance**: 9,700+ records covering 90 days
- **Timesheets**: Sample timesheet data with various statuses
- **Notifications**: Sample notifications for different events
- **Settings**: Pre-configured company, payroll, and geolocation settings

All data is loaded into Redux on startup and persists to localStorage for changes.

## Migrating to Real API Integration

The application is designed for easy API integration. To switch from mock data to real APIs:

### Step 1: Replace Redux Slice Reducers with Async Thunks

Current (Mock):
```typescript
// usersSlice.ts
reducers: {
  addUser: (state, action) => {
    state.users.push(action.payload);
    localStorage.setItem('users', JSON.stringify(state));
  }
}
```

Future (API):
```typescript
// usersSlice.ts
extraReducers: (builder) => {
  builder.addCase(addUser.fulfilled, (state, action) => {
    state.users.push(action.payload);
  });
}

export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData) => {
    const response = await axios.post('/api/users', userData);
    return response.data;
  }
);
```

### Step 2: Configure Axios Base URL

Update `src/lib/api.ts` (create if needed):
```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Step 3: Update Environment Variables

Create `.env` file:
```
VITE_API_URL=https://your-api-endpoint.com
```

### Step 4: Remove localStorage Logic

Remove all `localStorage.setItem()` calls from slices since the backend will persist data.

## Code Quality

- **ESLint** configured for code quality
- **TypeScript** for type safety
- **Consistent code style** with Prettier
- **Component-based architecture**
- **Single Responsibility Principle** applied to all components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This project uses Redux Toolkit slices for state management. When adding new features:
1. Create appropriate Redux slices
2. Add mock data to `/src/mock/`
3. Implement UI components
4. Test with mock data before API integration

## License

This project is proprietary and confidential.

## Support

For issues or questions, please contact the development team.

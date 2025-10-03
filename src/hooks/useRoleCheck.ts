import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@/store/slices/authSlice';

export const useRoleCheck = () => {
  const user = useAppSelector((state) => state.auth.user);
  
  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isManager = user?.role === 'manager' || user?.role === 'super_admin';
  const isEmployee = user?.role === 'employee';

  return {
    hasRole,
    isSuperAdmin,
    isManager,
    isEmployee,
    userRole: user?.role,
  };
};

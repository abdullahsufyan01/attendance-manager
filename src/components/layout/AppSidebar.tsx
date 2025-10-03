import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  Settings,
  Bell,
  BarChart3,
  User,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAppSelector } from '@/store/hooks';
import { UserRole } from '@/store/slices/authSlice';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard, roles: ['super_admin', 'manager', 'employee'] as UserRole[] },
  { title: 'Users', url: '/users', icon: Users, roles: ['super_admin', 'manager'] as UserRole[] },
  { title: 'Attendance', url: '/attendance', icon: Clock, roles: ['super_admin', 'manager'] as UserRole[] },
  { title: 'Timesheets', url: '/timesheets', icon: FileText, roles: ['super_admin', 'manager', 'employee'] as UserRole[] },
  { title: 'Reports', url: '/reports', icon: BarChart3, roles: ['super_admin', 'manager'] as UserRole[] },
  { title: 'Notifications', url: '/notifications', icon: Bell, roles: ['super_admin', 'manager', 'employee'] as UserRole[] },
  { title: 'Settings', url: '/settings', icon: Settings, roles: ['super_admin'] as UserRole[] },
  { title: 'Profile', url: '/profile', icon: User, roles: ['super_admin', 'manager', 'employee'] as UserRole[] },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const userRole = useAppSelector((state) => state.auth.user?.role);

  const visibleMenuItems = menuItems.filter((item) =>
    userRole ? item.roles.includes(userRole) : false
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 flex items-center gap-2 border-b border-sidebar-border">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Clock className="h-5 w-5 text-primary-foreground" />
          </div>
          {open && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">AttendSync</h2>
              <p className="text-xs text-sidebar-foreground/60">Attendance System</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                          : 'hover:bg-sidebar-accent/50'
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

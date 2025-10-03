import { useEffect } from 'react';
import { useNavigate, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, CreditCard, DollarSign, MapPin, Palette, Bell } from 'lucide-react';
import CompanySettings from './settings/CompanySettings';
import BillingSettings from './settings/BillingSettings';
import PayrollSettings from './settings/PayrollSettings';
import GeolocationSettings from './settings/GeolocationSettings';
import LogoSettings from './settings/LogoSettings';
import NotificationSettings from './settings/NotificationSettings';
import { useRoleCheck } from '@/hooks/useRoleCheck';
import { toast } from 'sonner';

export default function Settings() {
  const navigate = useNavigate();
  const { isSuperAdmin } = useRoleCheck();

  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error('Access denied - Super Admin only');
      navigate('/');
    }
  }, [isSuperAdmin, navigate]);

  const settingsNavigation = [
    { name: 'Logo & Colors', href: '/settings/logo', icon: Palette },
    { name: 'Company Info', href: '/settings/company', icon: Building2 },
    { name: 'Billing', href: '/settings/billing', icon: CreditCard },
    { name: 'Payroll', href: '/settings/payroll', icon: DollarSign },
    { name: 'Geolocation', href: '/settings/geolocation', icon: MapPin },
    { name: 'Notifications', href: '/settings/notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {settingsNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Routes>
            <Route index element={<Navigate to="/settings/logo" replace />} />
            <Route path="logo" element={<LogoSettings />} />
            <Route path="company" element={<CompanySettings />} />
            <Route path="billing" element={<BillingSettings />} />
            <Route path="payroll" element={<PayrollSettings />} />
            <Route path="geolocation" element={<GeolocationSettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

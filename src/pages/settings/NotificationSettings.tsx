import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface NotificationSettings {
  users: {
    addedShift: { mobile: boolean; webPush: boolean; email: boolean };
    editedShift: { mobile: boolean; webPush: boolean; email: boolean };
    exceedsLimit: { mobile: boolean; webPush: boolean; email: boolean };
    autoClockOut: { mobile: boolean; webPush: boolean; email: boolean };
    pendingApproval: { mobile: boolean; webPush: boolean; email: boolean };
    submittedTimesheet: { mobile: boolean; webPush: boolean; email: boolean };
  };
  admins: {
    approvedDeclined: { mobile: boolean; webPush: boolean; email: boolean };
  };
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const stored = localStorage.getItem('notificationSettings');
    return stored ? JSON.parse(stored) : {
      users: {
        addedShift: { mobile: true, webPush: true, email: false },
        editedShift: { mobile: true, webPush: true, email: false },
        exceedsLimit: { mobile: true, webPush: true, email: true },
        autoClockOut: { mobile: true, webPush: true, email: false },
        pendingApproval: { mobile: true, webPush: true, email: false },
        submittedTimesheet: { mobile: true, webPush: true, email: true },
      },
      admins: {
        approvedDeclined: { mobile: true, webPush: true, email: false },
      },
    };
  });

  const handleSave = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    toast.success('Notification settings saved');
  };

  const updateSetting = (
    category: 'users' | 'admins',
    event: string,
    channel: 'mobile' | 'webPush' | 'email',
    value: boolean
  ) => {
    setSettings((prev) => {
      const categorySettings = prev[category];
      const eventSettings = categorySettings[event as keyof typeof categorySettings] as { mobile: boolean; webPush: boolean; email: boolean };
      
      return {
        ...prev,
        [category]: {
          ...categorySettings,
          [event]: {
            ...eventSettings,
            [channel]: value,
          },
        },
      };
    });
  };

  const NotificationRow = ({
    title,
    category,
    event,
    settings: eventSettings,
  }: {
    title: string;
    category: 'users' | 'admins';
    event: string;
    settings: { mobile: boolean; webPush: boolean; email: boolean };
  }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm">{title}</span>
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={eventSettings.mobile}
            onCheckedChange={(checked) => updateSetting(category, event, 'mobile', checked)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={eventSettings.webPush}
            onCheckedChange={(checked) => updateSetting(category, event, 'webPush', checked)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={eventSettings.email}
            onCheckedChange={(checked) => updateSetting(category, event, 'email', checked)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Time Clock Notifications</CardTitle>
          <CardDescription>
            You can manage all notifications in the notifications center
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Get notified when users:</h3>
            <div className="flex justify-end gap-6 mb-2 text-sm font-medium text-muted-foreground">
              <span className="w-16 text-center">Mobile</span>
              <span className="w-16 text-center">Web push</span>
              <span className="w-16 text-center">Email</span>
            </div>
            <Separator />
            <NotificationRow
              title="Added a new shift"
              category="users"
              event="addedShift"
              settings={settings.users.addedShift}
            />
            <Separator />
            <NotificationRow
              title="Edited a shift"
              category="users"
              event="editedShift"
              settings={settings.users.editedShift}
            />
            <Separator />
            <NotificationRow
              title="Exceeds work hour limit"
              category="users"
              event="exceedsLimit"
              settings={settings.users.exceedsLimit}
            />
            <Separator />
            <NotificationRow
              title="Auto clock out"
              category="users"
              event="autoClockOut"
              settings={settings.users.autoClockOut}
            />
            <Separator />
            <NotificationRow
              title="Requests are pending approval"
              category="users"
              event="pendingApproval"
              settings={settings.users.pendingApproval}
            />
            <Separator />
            <NotificationRow
              title="Submitted their timesheet"
              category="users"
              event="submittedTimesheet"
              settings={settings.users.submittedTimesheet}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Will be sent to admins who manage groups and are permitted to approve timesheets
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Get notified when admins:</h3>
            <div className="flex justify-end gap-6 mb-2 text-sm font-medium text-muted-foreground">
              <span className="w-16 text-center">Mobile</span>
              <span className="w-16 text-center">Web push</span>
              <span className="w-16 text-center">Email</span>
            </div>
            <Separator />
            <NotificationRow
              title="Approved or declined a shift request"
              category="admins"
              event="approvedDeclined"
              settings={settings.admins.approvedDeclined}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

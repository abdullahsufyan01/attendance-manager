import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/store/hooks';
import { Users, Clock, FileText, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const users = useAppSelector((state) => state.users.users);
  const attendance = useAppSelector((state) => state.attendance.records);
  const timesheets = useAppSelector((state) => state.timesheets.timesheets);

  const activeUsers = users.filter((u) => u.isActive).length;
  const todayAttendance = attendance.filter(
    (a) => a.date === new Date().toISOString().split('T')[0]
  ).length;
  const pendingTimesheets = timesheets.filter((t) => t.status === 'submitted').length;

  const stats = [
    {
      title: 'Active Users',
      value: activeUsers,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: "Today's Clock-ins",
      value: todayAttendance,
      icon: Clock,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Pending Approvals',
      value: pendingTimesheets,
      icon: FileText,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Users',
      value: users.length,
      icon: AlertCircle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your attendance system</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendance.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{record.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.status === 'present' ? 'Clocked in' : record.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{record.clockIn}</p>
                    <p className="text-xs text-muted-foreground">{record.branch}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Timesheets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timesheets
                .filter((t) => t.status === 'submitted')
                .slice(0, 5)
                .map((timesheet) => (
                  <div key={timesheet.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{timesheet.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        Week {timesheet.weekStart} - {timesheet.weekEnd}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{timesheet.totalHours}h</p>
                      <p className="text-xs text-warning capitalize">{timesheet.status}</p>
                    </div>
                  </div>
                ))}
              {timesheets.filter((t) => t.status === 'submitted').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No pending timesheets
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

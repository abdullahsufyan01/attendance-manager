import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import { exportToCSV, exportToPDF } from '@/lib/export';
import { useRoleCheck } from '@/hooks/useRoleCheck';

export default function Reports() {
  const navigate = useNavigate();
  const { isSuperAdmin, isManager } = useRoleCheck();
  const attendance = useAppSelector((state) => state.attendance.records);
  const timesheets = useAppSelector((state) => state.timesheets.timesheets);

  useEffect(() => {
    if (!isSuperAdmin && !isManager) {
      toast.error('Access denied');
      navigate('/');
    }
  }, [isSuperAdmin, isManager, navigate]);

  const handleExport = (type: string, format: string) => {
    const exportFormat = localStorage.getItem('exportFormat') || 'time';
    let data: any[] = [];
    let title = '';

    if (type === 'Attendance Report') {
      title = 'Attendance Report';
      data = attendance.map(r => ({
        Employee: r.userName,
        Date: r.date,
        'Clock In': r.clockIn,
        'Clock Out': r.clockOut || '-',
        Duration: `${r.duration}h`,
        Branch: r.branch,
        Status: r.status,
      }));
    } else if (type === 'Payroll Report') {
      title = 'Payroll Report';
      data = timesheets.map(t => ({
        Employee: t.userName,
        'Week Start': t.weekStart,
        'Week End': t.weekEnd,
        'Total Hours': `${t.totalHours}h`,
        Status: t.status,
      }));
    } else if (type === 'Timesheet Summary') {
      title = 'Timesheet Summary';
      data = timesheets.filter(t => t.status === 'approved').map(t => ({
        Employee: t.userName,
        'Week Start': t.weekStart,
        'Week End': t.weekEnd,
        'Total Hours': `${t.totalHours}h`,
        'Approved By': t.approvedBy || '-',
      }));
    }

    if (format === 'csv') {
      exportToCSV(data, title.toLowerCase().replace(/\s+/g, '-'));
      toast.success(`Exported ${title} as CSV`);
    } else {
      exportToPDF(data, title.toLowerCase().replace(/\s+/g, '-'), title);
      toast.success(`Exported ${title} as PDF`);
    }
  };

  const reports = [
    {
      title: 'Attendance Report',
      description: 'Export attendance records for all employees',
      icon: FileText,
    },
    {
      title: 'Payroll Report',
      description: 'Export payroll data with hours worked',
      icon: FileText,
    },
    {
      title: 'Timesheet Summary',
      description: 'Export approved timesheet summaries',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and export reports</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.title}>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <report.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(report.title, 'csv')}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(report.title, 'pdf')}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

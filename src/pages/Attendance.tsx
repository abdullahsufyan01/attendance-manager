import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { AttendanceRecord } from '@/store/slices/attendanceSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Filter, CreditCard as Edit } from 'lucide-react';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { EditAttendanceModal } from '@/components/EditAttendanceModal';
import { exportToCSV, exportToPDF } from '@/lib/export';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRoleCheck } from '@/hooks/useRoleCheck';
import { toast } from 'sonner';

// Date preset helpers
const getDatePreset = (preset: string): string => {
  const today = new Date();
  switch (preset) {
    case 'today':
      return today.toISOString().split('T')[0];
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    }
    case 'last7days': {
      const last7 = new Date(today);
      last7.setDate(last7.getDate() - 7);
      return last7.toISOString().split('T')[0];
    }
    case 'thisMonth': {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return firstDay.toISOString().split('T')[0];
    }
    case 'lastMonth': {
      const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      return firstDay.toISOString().split('T')[0];
    }
    case '20/20': {
      const last20 = new Date(today);
      last20.setDate(last20.getDate() - 20);
      return last20.toISOString().split('T')[0];
    }
    default:
      return '';
  }
};

export default function Attendance() {
  const navigate = useNavigate();
  const { isSuperAdmin, isManager } = useRoleCheck();
  const attendance = useAppSelector((state) => state.attendance.records);
  const users = useAppSelector((state) => state.users.users);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [datePreset, setDatePreset] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    if (!isSuperAdmin && !isManager) {
      toast.error('Access denied');
      navigate('/');
    }
  }, [isSuperAdmin, isManager, navigate]);

  const branches = Array.from(new Set(users.map(u => u.branch)));

  const handleDatePresetChange = (preset: string) => {
    setDatePreset(preset);
    if (preset === 'all') {
      setDateFilter('');
    } else {
      setDateFilter(getDatePreset(preset));
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const exportData = filteredRecords.map(r => ({
      Employee: r.userName,
      Date: r.date,
      'Clock In': r.clockIn,
      'Clock Out': r.clockOut || '-',
      Duration: `${r.duration}h`,
      Branch: r.branch,
      Status: r.status,
    }));

    if (format === 'csv') {
      exportToCSV(exportData, 'attendance-report');
    } else {
      exportToPDF(exportData, 'attendance-report', 'Attendance Report');
    }
  };

  const filteredRecords = attendance.filter(
    (record) => {
      const matchesSearch = record.userName.toLowerCase().includes(search.toLowerCase()) ||
        record.branch.toLowerCase().includes(search.toLowerCase());
      const matchesDate = !dateFilter || record.date === dateFilter;
      const matchesBranch = branchFilter === 'all' || record.branch === branchFilter;
      const matchesUser = userFilter === 'all' || record.userId === userFilter;

      return matchesSearch && matchesDate && matchesBranch && matchesUser;
    }
  );

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-success/10 text-success';
      case 'late':
        return 'bg-warning/10 text-warning';
      case 'absent':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Track employee attendance records</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('pdf')}>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search attendance..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <Select value={datePreset} onValueChange={handleDatePresetChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Preset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="20/20">20/20 (Last 20 days)</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setDatePreset('all');
            }}
            className="w-[180px]"
            placeholder="Custom date"
          />
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.slice(0, 50).map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDateFilter('');
              setDatePreset('all');
              setBranchFilter('all');
              setUserFilter('all');
              setSearch('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.userName}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.clockIn}</TableCell>
                <TableCell>{record.clockOut || '-'}</TableCell>
                <TableCell>{record.duration}h</TableCell>
                <TableCell>{record.branch}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingRecord(record)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredRecords.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <EditAttendanceModal
        record={editingRecord}
        open={!!editingRecord}
        onClose={() => setEditingRecord(null)}
      />
    </div>
  );
}

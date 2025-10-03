import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { approveTimesheet, declineTimesheet, submitTimesheet, reopenTimesheet } from '@/store/slices/timesheetsSlice';
import { Button } from '@/components/ui/button';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRoleCheck } from '@/hooks/useRoleCheck';

export default function Timesheets() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isSuperAdmin, isManager, isEmployee } = useRoleCheck();
  const timesheets = useAppSelector((state) => state.timesheets.timesheets);
  const currentUser = useAppSelector((state) => state.auth.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Load approval config from localStorage
  const approvalConfig = JSON.parse(localStorage.getItem('timesheetApprovalConfig') || '{"whoCanApprove":["super_admin","manager"],"whoCanReopen":["super_admin"]}');

  const canApprove = isSuperAdmin || (isManager && approvalConfig.whoCanApprove.includes('manager'));
  const canReopen = isSuperAdmin || (isManager && approvalConfig.whoCanReopen.includes('manager'));

  // Filter timesheets based on role
  const filteredTimesheets = isEmployee 
    ? timesheets.filter(t => t.userId === currentUser?.id)
    : timesheets;

  const totalPages = Math.ceil(filteredTimesheets.length / pageSize);
  const paginatedTimesheets = filteredTimesheets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSubmit = (id: string) => {
    dispatch(submitTimesheet(id));
    toast.success('Timesheet submitted');
  };

  const handleApprove = (id: string) => {
    if (!canApprove) {
      toast.error('You do not have permission to approve timesheets');
      return;
    }
    dispatch(approveTimesheet({ id, approvedBy: currentUser?.name || 'Unknown' }));
    toast.success('Timesheet approved');
  };

  const handleDecline = (id: string) => {
    if (!canApprove) {
      toast.error('You do not have permission to decline timesheets');
      return;
    }
    dispatch(declineTimesheet(id));
    toast.error('Timesheet declined');
  };

  const handleReopen = (id: string) => {
    if (!canReopen) {
      toast.error('You do not have permission to reopen timesheets');
      return;
    }
    dispatch(reopenTimesheet(id));
    toast.info('Timesheet reopened');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success/10 text-success';
      case 'submitted':
        return 'bg-warning/10 text-warning';
      case 'declined':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Timesheets</h1>
        <p className="text-muted-foreground">Manage employee timesheets</p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Week Start</TableHead>
              <TableHead>Week End</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTimesheets.map((timesheet) => (
              <TableRow key={timesheet.id}>
                <TableCell className="font-medium">{timesheet.userName}</TableCell>
                <TableCell>{timesheet.weekStart}</TableCell>
                <TableCell>{timesheet.weekEnd}</TableCell>
                <TableCell>{timesheet.totalHours}h</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(timesheet.status)}>
                    {timesheet.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {timesheet.status === 'draft' && (
                      <Button size="sm" onClick={() => handleSubmit(timesheet.id)}>
                        Submit
                      </Button>
                    )}
                    {timesheet.status === 'submitted' && canApprove && (
                      <>
                        <Button size="sm" onClick={() => handleApprove(timesheet.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDecline(timesheet.id)}>
                          Decline
                        </Button>
                      </>
                    )}
                    {(timesheet.status === 'approved' || timesheet.status === 'declined') &&
                      canReopen && (
                        <Button size="sm" variant="outline" onClick={() => handleReopen(timesheet.id)}>
                          Reopen
                        </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredTimesheets.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}

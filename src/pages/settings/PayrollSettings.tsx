import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updatePayrollSettings } from '@/store/slices/settingsSlice';
import { toast } from 'sonner';
import { useState } from 'react';

const validationSchema = Yup.object({
  workDays: Yup.number().required('Work days is required').min(1).max(7),
  defaultDailyHours: Yup.number().required('Default daily hours is required').min(1).max(24),
  dailyLimit: Yup.number().required('Daily limit is required').min(1).max(24),
});

export default function PayrollSettings() {
  const dispatch = useAppDispatch();
  const payrollSettings = useAppSelector((state) => state.settings.payroll);
  const [whoCanApprove, setWhoCanApprove] = useState<string[]>(['super_admin', 'manager']);
  const [whoCanReopen, setWhoCanReopen] = useState<string[]>(['super_admin']);
  const [requireSubmit, setRequireSubmit] = useState(true);
  const [exportFormat, setExportFormat] = useState<'time' | 'decimal'>('time');

  const formik = useFormik({
    initialValues: {
      workDays: payrollSettings.workDays,
      defaultDailyHours: payrollSettings.defaultDailyHours,
      dailyLimit: payrollSettings.dailyLimit,
      autoClockOut: payrollSettings.autoClockOut,
      payrollCycle: payrollSettings.payrollCycle,
      payrollEndDate: payrollSettings.payrollEndDate,
      overnightShiftRule: payrollSettings.overnightShiftRule,
      timesheetApprovalRequired: payrollSettings.timesheetApprovalRequired,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(updatePayrollSettings(values));
      localStorage.setItem('timesheetApprovalConfig', JSON.stringify({
        whoCanApprove,
        whoCanReopen,
        requireSubmit,
      }));
      localStorage.setItem('exportFormat', exportFormat);
      toast.success('Payroll settings updated');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Configuration</CardTitle>
        <CardDescription>Configure payroll rules and schedules</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="workDays">Work Days per Week</Label>
              <Input
                id="workDays"
                type="number"
                {...formik.getFieldProps('workDays')}
              />
              {formik.touched.workDays && formik.errors.workDays && (
                <p className="text-sm text-destructive">{formik.errors.workDays}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultDailyHours">Default Daily Hours</Label>
              <Input
                id="defaultDailyHours"
                type="number"
                {...formik.getFieldProps('defaultDailyHours')}
              />
              {formik.touched.defaultDailyHours && formik.errors.defaultDailyHours && (
                <p className="text-sm text-destructive">{formik.errors.defaultDailyHours}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Daily Limit (Hours)</Label>
              <Input
                id="dailyLimit"
                type="number"
                {...formik.getFieldProps('dailyLimit')}
              />
              {formik.touched.dailyLimit && formik.errors.dailyLimit && (
                <p className="text-sm text-destructive">{formik.errors.dailyLimit}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payrollCycle">Payroll Cycle</Label>
              <Input id="payrollCycle" {...formik.getFieldProps('payrollCycle')} />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoClockOut">Auto Clock-Out</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically clock out after daily limit
                </p>
              </div>
              <Switch
                id="autoClockOut"
                checked={formik.values.autoClockOut}
                onCheckedChange={(checked) => formik.setFieldValue('autoClockOut', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="timesheetApprovalRequired">Require Timesheet Approval</Label>
                <p className="text-sm text-muted-foreground">
                  Timesheets must be approved before processing
                </p>
              </div>
              <Switch
                id="timesheetApprovalRequired"
                checked={formik.values.timesheetApprovalRequired}
                onCheckedChange={(checked) =>
                  formik.setFieldValue('timesheetApprovalRequired', checked)
                }
              />
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Timesheets Approval</h3>
              <p className="text-sm text-muted-foreground mb-4">
                An admin can approve users' timesheets. The approval action will lock the timesheet to prevent users and other admins from editing entries after they have been approved.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Who can approve timesheets</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={whoCanApprove.includes('super_admin')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWhoCanApprove([...whoCanApprove, 'super_admin']);
                          } else {
                            setWhoCanApprove(whoCanApprove.filter(r => r !== 'super_admin'));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">Super Admin</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={whoCanApprove.includes('manager')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWhoCanApprove([...whoCanApprove, 'manager']);
                          } else {
                            setWhoCanApprove(whoCanApprove.filter(r => r !== 'manager'));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">Manager</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Who can reopen timesheets</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={whoCanReopen.includes('super_admin')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWhoCanReopen([...whoCanReopen, 'super_admin']);
                          } else {
                            setWhoCanReopen(whoCanReopen.filter(r => r !== 'super_admin'));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">Super Admin</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={whoCanReopen.includes('manager')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWhoCanReopen([...whoCanReopen, 'manager']);
                          } else {
                            setWhoCanReopen(whoCanReopen.filter(r => r !== 'manager'));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">Manager</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require users to submit their timesheet</Label>
                    <p className="text-sm text-muted-foreground">
                      Users will be required to review and submit their timesheet at the end of a pay period
                    </p>
                  </div>
                  <Switch
                    checked={requireSubmit}
                    onCheckedChange={setRequireSubmit}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Timesheet & payroll export format</Label>
              <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as 'time' | 'decimal')}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Time (04:30)</SelectItem>
                  <SelectItem value="decimal">Decimal (4.5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="mt-6">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}

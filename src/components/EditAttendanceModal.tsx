import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '@/store/hooks';
import { updateAttendanceRecord, AttendanceRecord } from '@/store/slices/attendanceSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormDrawer } from '@/components/ui/form-drawer';
import { toast } from 'sonner';

const validationSchema = Yup.object({
  clockIn: Yup.string().required('Clock in time is required'),
  clockOut: Yup.string(),
});

interface EditAttendanceModalProps {
  record: AttendanceRecord | null;
  open: boolean;
  onClose: () => void;
}

export function EditAttendanceModal({ record, open, onClose }: EditAttendanceModalProps) {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      clockIn: record?.clockIn || '',
      clockOut: record?.clockOut || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (!record) return;

      const clockInParts = values.clockIn.split(':');
      const clockOutParts = values.clockOut ? values.clockOut.split(':') : null;

      let duration = 0;
      if (clockOutParts) {
        const startMin = parseInt(clockInParts[0]) * 60 + parseInt(clockInParts[1]);
        const endMin = parseInt(clockOutParts[0]) * 60 + parseInt(clockOutParts[1]);
        duration = Math.round((endMin - startMin) / 60 * 10) / 10;
      }

      dispatch(updateAttendanceRecord({
        ...record,
        clockIn: values.clockIn,
        clockOut: values.clockOut || null,
        duration,
      }));

      toast.success('Attendance record updated');
      onClose();
    },
  });

  return (
    <FormDrawer
      open={open}
      onOpenChange={onClose}
      title="Edit Attendance Record"
      description={`Update clock in and clock out times for ${record?.userName || 'employee'}`}
      footer={
        <div className="flex gap-4">
          <Button onClick={formik.submitForm}>Save Changes</Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clockIn">Clock In Time</Label>
          <Input
            id="clockIn"
            type="time"
            {...formik.getFieldProps('clockIn')}
          />
          {formik.touched.clockIn && formik.errors.clockIn && (
            <p className="text-sm text-destructive">{formik.errors.clockIn}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="clockOut">Clock Out Time</Label>
          <Input
            id="clockOut"
            type="time"
            {...formik.getFieldProps('clockOut')}
          />
          {formik.touched.clockOut && formik.errors.clockOut && (
            <p className="text-sm text-destructive">{formik.errors.clockOut}</p>
          )}
        </div>
      </form>
    </FormDrawer>
  );
}

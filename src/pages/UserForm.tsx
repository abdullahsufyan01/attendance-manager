import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addUser, updateUser } from '@/store/slices/usersSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
  branch: Yup.string().required('Branch is required'),
  department: Yup.string().required('Department is required'),
  kioskNumber: Yup.string().required('Kiosk number is required'),
  startDate: Yup.string().required('Start date is required'),
});

interface UserFormProps {
  userId: string | null;
  onClose: () => void;
}

export default function UserForm({ userId, onClose }: UserFormProps) {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const user = userId ? users.find((u) => u.id === userId) : null;
  const isEdit = !!user;

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'employee',
      branch: user?.branch || '',
      department: user?.department || '',
      kioskNumber: user?.kioskNumber || '',
      startDate: user?.startDate || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const userData = {
        id: user?.id || Date.now().toString(),
        ...values,
        isActive: user?.isActive ?? true,
      };

      if (isEdit) {
        dispatch(updateUser(userData as any));
        toast.success('User updated successfully');
      } else {
        dispatch(addUser(userData as any));
        toast.success('User added successfully');
      }
      onClose();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...formik.getFieldProps('name')} />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-sm text-destructive">{formik.errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...formik.getFieldProps('email')} />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-destructive">{formik.errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formik.values.role} onValueChange={(value) => formik.setFieldValue('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.role && formik.errors.role && (
                  <p className="text-sm text-destructive">{formik.errors.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" {...formik.getFieldProps('branch')} />
                {formik.touched.branch && formik.errors.branch && (
                  <p className="text-sm text-destructive">{formik.errors.branch}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" {...formik.getFieldProps('department')} />
                {formik.touched.department && formik.errors.department && (
                  <p className="text-sm text-destructive">{formik.errors.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="kioskNumber">Kiosk Number</Label>
                <Input id="kioskNumber" {...formik.getFieldProps('kioskNumber')} />
                {formik.touched.kioskNumber && formik.errors.kioskNumber && (
                  <p className="text-sm text-destructive">{formik.errors.kioskNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...formik.getFieldProps('startDate')} />
                {formik.touched.startDate && formik.errors.startDate && (
                  <p className="text-sm text-destructive">{formik.errors.startDate}</p>
                )}
              </div>
            </div>

      <div className="flex gap-4">
        <Button type="submit">{isEdit ? 'Update User' : 'Add User'}</Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

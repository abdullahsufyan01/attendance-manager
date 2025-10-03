import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateCompanySettings } from '@/store/slices/settingsSlice';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const validationSchema = Yup.object({
  companyName: Yup.string().required('Company name is required'),
  companyCode: Yup.string().required('Company code is required'),
  companyId: Yup.string().required('Company ID is required'),
  industry: Yup.string().required('Industry is required'),
  country: Yup.string().required('Country is required'),
  timeZone: Yup.string().required('Time zone is required'),
});

interface Branch {
  id: string;
  name: string;
  manager: string;
}

export default function CompanySettings() {
  const dispatch = useAppDispatch();
  const companySettings = useAppSelector((state) => state.settings.company);
  const users = useAppSelector((state) => state.users.users);

  const [branches, setBranches] = useState<Branch[]>(() => {
    const stored = localStorage.getItem('companyBranches');
    return stored ? JSON.parse(stored) : [
      { id: '1', name: 'Branch 1', manager: '' },
      { id: '2', name: 'Branch 2', manager: '' },
      { id: '3', name: 'Branch 3', manager: '' },
    ];
  });

  const managers = users.filter(u => u.role === 'manager' || u.role === 'super_admin');

  const formik = useFormik({
    initialValues: {
      companyName: companySettings.companyName,
      companyCode: companySettings.companyCode,
      companyId: companySettings.companyId,
      industry: companySettings.industry,
      employees: companySettings.employees || '1-10',
      country: companySettings.country,
      timeZone: companySettings.timeZone,
      dateFormat: companySettings.dateFormat,
      timeFormat: companySettings.timeFormat,
      lengthFormat: companySettings.lengthFormat,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateCompanySettings(values));
      localStorage.setItem('companyBranches', JSON.stringify(branches));
      toast.success('Company settings updated');
    },
  });

  const addBranch = () => {
    const newBranch = {
      id: Date.now().toString(),
      name: `Branch ${branches.length + 1}`,
      manager: '',
    };
    setBranches([...branches, newBranch]);
  };

  const removeBranch = (id: string) => {
    setBranches(branches.filter(b => b.id !== id));
  };

  const updateBranch = (id: string, field: 'name' | 'manager', value: string) => {
    setBranches(branches.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>Manage your company details and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" {...formik.getFieldProps('companyName')} />
                {formik.touched.companyName && formik.errors.companyName && (
                  <p className="text-sm text-destructive">{formik.errors.companyName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyCode">Company Code</Label>
                <Input id="companyCode" {...formik.getFieldProps('companyCode')} />
                {formik.touched.companyCode && formik.errors.companyCode && (
                  <p className="text-sm text-destructive">{formik.errors.companyCode}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyId">Company ID</Label>
                <Input id="companyId" {...formik.getFieldProps('companyId')} />
                {formik.touched.companyId && formik.errors.companyId && (
                  <p className="text-sm text-destructive">{formik.errors.companyId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" {...formik.getFieldProps('industry')} />
                {formik.touched.industry && formik.errors.industry && (
                  <p className="text-sm text-destructive">{formik.errors.industry}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employees">Employees</Label>
                <Select
                  value={formik.values.employees}
                  onValueChange={(value) => formik.setFieldValue('employees', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-500">201-500</SelectItem>
                    <SelectItem value="500+">500+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...formik.getFieldProps('country')} />
                {formik.touched.country && formik.errors.country && (
                  <p className="text-sm text-destructive">{formik.errors.country}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Branches</h3>
            <p className="text-sm text-muted-foreground">
              Map your company's structure to deliver a personalized experience for managers
            </p>
            <div className="space-y-3">
              {branches.map((branch) => (
                <div key={branch.id} className="flex items-center gap-4">
                  <Input
                    placeholder="Branch name"
                    value={branch.name}
                    onChange={(e) => updateBranch(branch.id, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Select
                    value={branch.manager}
                    onValueChange={(value) => updateBranch(branch.id, 'manager', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select Manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBranch(branch.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addBranch}>
                <Plus className="mr-2 h-4 w-4" />
                Add Branch
              </Button>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Formats</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timeZone">Time Zone</Label>
                <Select
                  value={formik.values.timeZone}
                  onValueChange={(value) => formik.setFieldValue('timeZone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    <SelectItem value="America/Chicago">America/Chicago (CST)</SelectItem>
                    <SelectItem value="America/Denver">America/Denver (MST)</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Europe/Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.timeZone && formik.errors.timeZone && (
                  <p className="text-sm text-destructive">{formik.errors.timeZone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeFormat">Time Format</Label>
                <Select
                  value={formik.values.timeFormat}
                  onValueChange={(value) => formik.setFieldValue('timeFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (3:00 PM)</SelectItem>
                    <SelectItem value="24h">24-hour (15:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select
                  value={formik.values.dateFormat}
                  onValueChange={(value) => formik.setFieldValue('dateFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lengthFormat">Length Format</Label>
                <Select
                  value={formik.values.lengthFormat}
                  onValueChange={(value) => formik.setFieldValue('lengthFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meters">Meters</SelectItem>
                    <SelectItem value="feet">Feet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button type="submit">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}

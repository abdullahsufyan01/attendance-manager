import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateGeolocationSettings } from '@/store/slices/settingsSlice';
import { toast } from 'sonner';

export default function GeolocationSettings() {
  const dispatch = useAppDispatch();
  const geolocationSettings = useAppSelector((state) => state.settings.geolocation);

  const formik = useFormik({
    initialValues: {
      mode: geolocationSettings.mode,
    },
    onSubmit: (values) => {
      dispatch(updateGeolocationSettings(values));
      toast.success('Geolocation settings updated');
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Geolocation Tracking</CardTitle>
          <CardDescription>Configure location tracking settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mode">Tracking Mode</Label>
              <Select
                value={formik.values.mode}
                onValueChange={(value) => formik.setFieldValue('mode', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  <SelectItem value="clock-in-out">Clock In/Out Only</SelectItem>
                  <SelectItem value="breadcrumbs">Live Breadcrumbs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Geo-Fences</CardTitle>
          <CardDescription>Manage location boundaries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {geolocationSettings.geoFences.map((fence) => (
              <div key={fence.id} className="p-4 border rounded-lg">
                <h4 className="font-medium">{fence.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Lat: {fence.lat}, Lng: {fence.lng}, Radius: {fence.radius}m
                </p>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Add Geo-Fence
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

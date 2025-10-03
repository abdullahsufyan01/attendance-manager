import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleUserActive, deleteUser } from '@/store/slices/usersSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, CreditCard as Edit, Trash2, AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { FormDrawer } from '@/components/ui/form-drawer';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import UserForm from './UserForm';
import { useRoleCheck } from '@/hooks/useRoleCheck';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Users() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isSuperAdmin, isManager } = useRoleCheck();
  const users = useAppSelector((state) => state.users.users);
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!isSuperAdmin && !isManager) {
      toast.error('Access denied');
      navigate('/');
    }
  }, [isSuperAdmin, isManager, navigate]);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Filter users based on role
  const accessibleUsers = isManager && !isSuperAdmin
    ? users.filter(user => user.branch === currentUser?.name.split(' ')[0]) // Mock: manager sees their branch
    : users;

  const filteredUsers = accessibleUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.branch.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleToggleActive = (id: string) => {
    dispatch(toggleUserActive(id));
    toast.success('User status updated');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
      toast.success('User deleted');
    }
  };

  const handleAddUser = () => {
    setSelectedUserId(null);
    setDrawerOpen(true);
  };

  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedUserId(null);
  };

  return (
    <div className="space-y-6">
      {!isSuperAdmin && isManager && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You can only view and manage users in your branch.
          </AlertDescription>
        </Alert>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Kiosk #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'manager' ? 'default' : 'secondary'}>
                    {user.role.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{user.branch}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-base">
                    {user.kioskNumber}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={() => handleToggleActive(user.id)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditUser(user.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
          totalItems={filteredUsers.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={selectedUserId ? 'Edit User' : 'Add User'}
        description={selectedUserId ? 'Update user information' : 'Create a new user account'}
      >
        <UserForm userId={selectedUserId} onClose={handleCloseDrawer} />
      </FormDrawer>
    </div>
  );
}

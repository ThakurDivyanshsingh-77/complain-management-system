import { useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useAuth } from './context/AuthContext';
import { complaintService } from './services/api';
import { getStatusColor } from './lib/utils';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
const CATEGORY_OPTIONS = [
  'IT',
  'Infrastructure',
  'Library',
  'Hostel',
  'Transport',
  'Canteen',
  'Academic',
  'Administrative',
  'Security',
  'Other',
];

const normalizeStatus = (status) => {
  const map = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
    Pending: 'Pending',
    'In Progress': 'In Progress',
    Resolved: 'Resolved',
    Rejected: 'Rejected',
  };

  return map[status] || 'Pending';
};

const statusToApi = (status) => {
  if (status === 'In Progress') return 'in-progress';
  return status.toLowerCase();
};

const badgeClassFromStatus = (status) => {
  const key = statusToApi(normalizeStatus(status));
  return getStatusColor(key);
};

const NavBar = () => {
  const {
    isAuthenticated,
    isAdmin,
    isUser,
    logout,
    user,
    notifications,
    markNotificationsRead,
  } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleNotifications = () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      markNotificationsRead();
    }
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="text-lg font-semibold text-blue-700">
          Complaint CMS
        </NavLink>

        <div className="relative flex items-center gap-4 text-sm">
          {!isAuthenticated && (
            <>
              <NavLink to="/login" className="hover:text-blue-600">
                Login
              </NavLink>
              <NavLink to="/register" className="hover:text-blue-600">
                Register
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <>
              {isAdmin && (
                <>
                  <NavLink to="/admin" className="hover:text-blue-600">
                    Admin Dashboard
                  </NavLink>
                  <NavLink to="/manage-complaints" className="hover:text-blue-600">
                    Manage Complaints
                  </NavLink>
                  <NavLink to="/users" className="hover:text-blue-600">
                    View All Users
                  </NavLink>
                </>
              )}

              {isUser && (
                <>
                  <NavLink to="/dashboard" className="hover:text-blue-600">
                    User Dashboard
                  </NavLink>
                  <NavLink to="/my-complaints" className="hover:text-blue-600">
                    My Complaints
                  </NavLink>
                  <NavLink to="/profile" className="hover:text-blue-600">
                    Profile
                  </NavLink>
                </>
              )}

              <button
                onClick={toggleNotifications}
                className="relative rounded border px-2 py-1 text-gray-700 hover:bg-gray-50"
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {open && (
                <div className="absolute right-24 top-11 z-20 w-80 rounded border bg-white p-2 shadow-lg">
                  <p className="border-b px-2 py-1 text-xs font-semibold text-gray-500">Notifications</p>
                  <div className="max-h-60 overflow-auto">
                    {notifications.length === 0 ? (
                      <p className="px-2 py-3 text-sm text-gray-500">No notifications</p>
                    ) : (
                      notifications.map((item) => (
                        <div key={item.id} className="border-b px-2 py-2 text-sm last:border-b-0">
                          <p className={item.read ? 'text-gray-600' : 'font-medium text-gray-900'}>{item.message}</p>
                          <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <span className="text-gray-500">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const Page = ({ title, description }) => (
  <div className="mx-auto max-w-6xl px-4 py-10">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="mt-3 text-gray-600">{description}</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <Page title="Loading" description="Checking authentication..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } });

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const loggedInUser = await login(formData.email, formData.password);
      navigate(loggedInUser.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-12 max-w-md rounded border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded border px-3 py-2"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded border px-3 py-2"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
          })}
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

const RegisterPage = () => {
  const { register: registerUser, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: '', email: '', password: '' } });

  if (isAuthenticated) return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const createdUser = await registerUser(formData.name, formData.email, formData.password);
      navigate(createdUser.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-12 max-w-md rounded border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full rounded border px-3 py-2"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded border px-3 py-2"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          })}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded border px-3 py-2"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
          })}
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

const UserDashboardPage = () => {
  const { user, addNotificationForUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      category: 'IT',
      description: '',
      priority: 'medium',
    },
  });

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('category', formData.category);
      payload.append('description', formData.description);
      payload.append('priority', formData.priority);
      await complaintService.create(payload);
      toast.success('Complaint submitted');
      if (user?._id) {
        addNotificationForUser(user._id, `Complaint submitted: ${formData.title}`);
      }
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p className="mt-2 text-gray-600">Submit a new complaint below.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3 rounded border bg-white p-4">
        <input
          placeholder="Complaint title"
          className="w-full rounded border px-3 py-2"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}

        <select className="w-full rounded border px-3 py-2" {...register('category', { required: true })}>
          {CATEGORY_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Describe your complaint"
          className="w-full rounded border px-3 py-2"
          rows={4}
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}

        <select className="w-full rounded border px-3 py-2" {...register('priority')}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
          <option value="critical">critical</option>
        </select>

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {submitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

const ComplaintTable = ({ complaints, showDetailLink }) => (
  <div className="mt-4 overflow-x-auto rounded border bg-white">
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left font-medium text-gray-700">Title</th>
          <th className="px-4 py-3 text-left font-medium text-gray-700">Category</th>
          <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
          <th className="px-4 py-3 text-left font-medium text-gray-700">Priority</th>
          {showDetailLink && <th className="px-4 py-3 text-left font-medium text-gray-700">Action</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {complaints.map((complaint) => {
          const formattedStatus = normalizeStatus(complaint.status);
          return (
            <tr key={complaint._id}>
              <td className="px-4 py-3">{complaint.title}</td>
              <td className="px-4 py-3">{complaint.category}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${badgeClassFromStatus(formattedStatus)}`}>
                  {formattedStatus}
                </span>
              </td>
              <td className="px-4 py-3 capitalize">{complaint.priority}</td>
              {showDetailLink && (
                <td className="px-4 py-3">
                  <Link className="text-blue-600 hover:underline" to={`/manage-complaints/${complaint._id}`}>
                    View Detail
                  </Link>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const ManageComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      setLoading(true);
      try {
        const params = { sort: sortOrder };
        if (statusFilter !== 'all') params.status = statusToApi(statusFilter);
        if (searchQuery.trim()) params.search = searchQuery.trim();
        const response = await complaintService.getAllComplaints(params);
        setComplaints(response.data.data.complaints || []);
      } catch {
        toast.error('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, [statusFilter, searchQuery, sortOrder]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Manage Complaints</h1>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search title or description"
            className="w-60 rounded border px-3 py-2"
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded border px-3 py-2">
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="rounded border px-3 py-2">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {loading ? <p className="mt-4 text-gray-600">Loading complaints...</p> : complaints.length === 0 ? <p className="mt-4 text-gray-600">No complaints found.</p> : <ComplaintTable complaints={complaints} showDetailLink />}
    </div>
  );
};

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const loadMyComplaints = async () => {
      try {
        const params = { sort: sortOrder };
        if (statusFilter !== 'all') params.status = statusToApi(statusFilter);
        if (searchQuery.trim()) params.search = searchQuery.trim();
        const response = await complaintService.getMyComplaints(params);
        setComplaints(response.data.data.complaints || []);
      } catch {
        toast.error('Failed to load your complaints');
      }
    };

    loadMyComplaints();
  }, [statusFilter, searchQuery, sortOrder]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My Complaints</h1>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search title or description"
            className="w-60 rounded border px-3 py-2"
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded border px-3 py-2">
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="rounded border px-3 py-2">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {complaints.length === 0 ? <p className="mt-4 text-gray-600">No complaints found.</p> : <ComplaintTable complaints={complaints} />}
    </div>
  );
};

const AdminComplaintDetailPage = () => {
  const { id } = useParams();
  const { addNotificationForUser } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState('Pending');
  const [saving, setSaving] = useState(false);

  const loadComplaint = async () => {
    try {
      const response = await complaintService.getById(id);
      const data = response.data.data.complaint;
      setComplaint(data);
      setStatus(normalizeStatus(data.status));
    } catch {
      toast.error('Failed to load complaint detail');
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const updateStatus = async () => {
    setSaving(true);
    try {
      await complaintService.updateStatus(id, {
        status: statusToApi(status),
        note: `Status updated to ${status}`,
      });
      if (complaint?.userId?._id) {
        addNotificationForUser(
          complaint.userId._id,
          `Your complaint "${complaint.title}" status changed to ${status}`
        );
      }
      toast.success('Status updated');
      loadComplaint();
    } catch {
      toast.error('Status update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!complaint) return <Page title="Complaint Detail" description="Loading complaint details..." />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">Complaint Detail</h1>
      <div className="mt-4 rounded border bg-white p-4">
        <h2 className="text-lg font-semibold">{complaint.title}</h2>
        <p className="mt-2 text-gray-600">{complaint.description}</p>
        <p className="mt-2 text-sm text-gray-500">Category: {complaint.category}</p>
        <p className="mt-1 text-sm text-gray-500">Priority: {complaint.priority}</p>
        <p className="mt-1 text-sm">
          Current Status:{' '}
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${badgeClassFromStatus(status)}`}>
            {status}
          </span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded border bg-white p-4">
        <label className="text-sm font-medium">Update Status</label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded border px-3 py-2">
          {STATUS_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <button
          onClick={updateStatus}
          disabled={saving}
          className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {saving ? 'Updating...' : 'Update Status'}
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Page title="Complaint Management System" description="Please login to access your dashboard based on your role." />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Page title="Unauthorized" description="You do not have permission to view this page." />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['user']}>
                <UserDashboardPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['user']}>
                <MyComplaintsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['user']}>
                <Page title="Profile" description="View and update your profile details." />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <Page title="Admin Dashboard" description="Welcome to /admin. Manage complaints, users, and system analytics." />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-complaints"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <ManageComplaintsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-complaints/:id"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminComplaintDetailPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <Page title="View All Users" description="Admin-only page to view and manage all users." />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

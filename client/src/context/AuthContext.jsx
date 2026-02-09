import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);
const NOTIFICATION_KEY = 'cms_notifications';

const readNotifications = () => {
  const raw = localStorage.getItem(NOTIFICATION_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const writeNotifications = (notifications) => {
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [notifications, setNotifications] = useState([]);

  const loadUserNotifications = (userId, showUnreadToast = false) => {
    const all = readNotifications();
    const scoped = all
      .filter((item) => item.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (showUnreadToast) {
      const unread = scoped.filter((item) => !item.read);
      unread.forEach((item) => toast.success(item.message));
      if (unread.length > 0) {
        const updated = all.map((item) =>
          item.userId === userId ? { ...item, read: true } : item
        );
        writeNotifications(updated);
      }
    }

    const refreshed = readNotifications()
      .filter((item) => item.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setNotifications(refreshed);
  };

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await authService.getMe();
      const currentUser = res.data.data.user;
      setUser(currentUser);
      loadUserNotifications(currentUser._id, true);
    } catch {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { user, token } = res.data.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    loadUserNotifications(user._id, true);
    toast.success('Login successful!');
    return user;
  };

  const register = async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    const { user, token } = res.data.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    loadUserNotifications(user._id, false);
    toast.success('Registration successful!');
    return user;
  };

  const addNotificationForUser = (userId, message) => {
    const all = readNotifications();
    const notification = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      userId,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updated = [notification, ...all];
    writeNotifications(updated);

    if (user?._id === userId) {
      setNotifications(
        updated
          .filter((item) => item.userId === userId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    }
  };

  const markNotificationsRead = () => {
    if (!user?._id) return;
    const all = readNotifications();
    const updated = all.map((item) =>
      item.userId === user._id ? { ...item, read: true } : item
    );
    writeNotifications(updated);
    setNotifications(
      updated
        .filter((item) => item.userId === user._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setNotifications([]);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    token,
    loading,
    notifications,
    login,
    register,
    logout,
    addNotificationForUser,
    markNotificationsRead,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isUser: user?.role === 'user',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

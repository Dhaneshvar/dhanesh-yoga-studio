import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const USERS_STORAGE_KEY = 'yoga_app_users';
const SESSION_STORAGE_KEY = 'yoga_app_session';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    if (session) {
      try {
        const user = JSON.parse(session);
        setAuthState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const getStoredUsers = (): User[] => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveUser = (user: User) => {
    const users = getStoredUsers();
    users.push(user);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const register = useCallback(async (
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Validation
    if (!name.trim() || !email.trim() || !password) {
      return { success: false, error: 'All fields are required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    // Check if user already exists
    const users = getStoredUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
    };

    // Store user (password would be hashed in real app - storing email only for demo)
    saveUser(newUser);

    // Store password mapping (demo only - never do this in production!)
    const passwords = JSON.parse(localStorage.getItem('yoga_passwords') || '{}');
    passwords[email.toLowerCase()] = password;
    localStorage.setItem('yoga_passwords', JSON.stringify(passwords));

    // Auto login
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
    setAuthState({ user: newUser, isAuthenticated: true, isLoading: false });

    toast.success('Account created successfully!');
    navigate('/');
    return { success: true };
  }, [navigate]);

  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email.trim() || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      return { success: false, error: 'No account found with this email' };
    }

    // Check password (demo only)
    const passwords = JSON.parse(localStorage.getItem('yoga_passwords') || '{}');
    if (passwords[email.toLowerCase()] !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    // Login success
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true, isLoading: false });

    toast.success(`Welcome back, ${user.name}!`);
    navigate('/');
    return { success: true };
  }, [navigate]);

  const loginWithGoogle = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    // Demo: Create a mock Google user
    toast.info('Google login requires backend authentication. Please use email/password for now.');
    return { success: false, error: 'Google login requires backend setup. Please register with email/password.' };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    toast.success('Logged out successfully');
    navigate('/login');
  }, [navigate]);

  return {
    ...authState,
    register,
    login,
    loginWithGoogle,
    logout,
  };
};

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { loginSuccess, logout, updateUser } from '@/store/slices/authSlice';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/users';
import { useCallback, useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, token, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  const handleLogout = async () => {
    // Clear Redux state
    dispatch(logout());

    // Clear NextAuth session
    await signOut({ redirect: false });

    // Redirect to login page
    router.push('/platform/auth/login');
  };

  const setCurrentUser = (user: User) => {
    dispatch(
      loginSuccess({
        user,
        token: 'nextauth-session', // Indicates we're using NextAuth
      }),
    );
  };

  const clearAuth = () => {
    dispatch(logout());
  };

  // Function to refresh user data from Airtable
  const refreshUserData = useCallback(async () => {
    if (!user?.id || !isAuthenticated) return;

    try {
      const response = await fetch(`/api/users/${user.id}`);

      if (!response.ok) {
        return;
      }

      const freshUserData = await response.json();

      // Update Redux with fresh data
      dispatch(updateUser(freshUserData));
    } catch {
      // Silently handle errors to avoid console spam
    }
  }, [user?.id, isAuthenticated, dispatch]);

  // Periodic refresh every 5 minutes
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const interval = setInterval(refreshUserData, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshUserData, isAuthenticated, user?.id]);

  // Refresh when user returns to the tab (page focus)
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const handleFocus = () => {
      refreshUserData();
    };

    window.addEventListener('focus', handleFocus);

    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshUserData, isAuthenticated, user?.id]);

  return {
    user,
    isAuthenticated,
    token,
    isLoading,
    logout: handleLogout,
    setCurrentUser,
    clearAuth,
    refreshUserData, // Expose for manual refresh if needed
  };
};

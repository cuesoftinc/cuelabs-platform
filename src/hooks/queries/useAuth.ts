import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  loginSuccess,
  logout,
} from '@/store/slices/authSlice';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/users';

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
    dispatch(loginSuccess({
      user,
      token: 'nextauth-session', // Indicates we're using NextAuth
    }));
  };

  const clearAuth = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    token,
    isLoading,
    logout: handleLogout,
    setCurrentUser,
    clearAuth,
  };
};

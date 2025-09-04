import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from '@/store/slices/authSlice';
import { signOut } from 'next-auth/react';
import { User } from '@/types/users';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, token, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  const handleLogout = async () => {
    // Clear Redux state
    dispatch(logout());
    
    // Clear NextAuth session
    await signOut({ redirect: false });
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

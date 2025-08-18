import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from '@/store/slices/authSlice';
import { useMutation } from '@tanstack/react-query';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, token, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  // Mock login function - replace with your actual authentication logic
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Replace with your actual login API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return response.json();
    },
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (data) => {
      dispatch(loginSuccess({ user: data.user, token: data.token }));
    },
    onError: () => {
      dispatch(loginFailure());
    },
  });

  const handleLogout = () => {
    dispatch(logout());
    // Clear any additional cleanup here (e.g., clear cookies)
  };

  return {
    user,
    isAuthenticated,
    token,
    isLoading: isLoading || loginMutation.isPending,
    login: loginMutation.mutate,
    logout: handleLogout,
    loginError: loginMutation.error,
  };
};

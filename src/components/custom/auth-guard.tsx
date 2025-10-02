'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/hooks/queries/useAuth';
import CustomSpinner from '@/components/custom/custom-spinner';
import { Button } from '@/components/ui/button';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className='flex items-center justify-center h-screen bg-black'>
        <CustomSpinner />
      </div>
    );
  }

  // Check if user is authenticated
  const isUserAuthenticated = isAuthenticated && user && session?.user?.id;

  // If not authenticated, show fallback or default login prompt
  if (!isUserAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className='flex items-center justify-center h-screen bg-black'>
        <div className='text-center max-w-md mx-auto p-8'>
          <h2 className='text-2xl font-bold text-white mb-4'>
            Access Restricted
          </h2>
          <p className='text-auth-text mb-6'>
            You need to be logged in to access this page. Please sign in to
            continue.
          </p>
          <Button
            onClick={() => router.push('/platform/auth/login')}
            className='btn-main-p'
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}

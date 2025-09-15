'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/queries/useAuth';
import { useRouter } from 'next/navigation';
import CustomSpinner from '@/components/custom/custom-spinner';

interface AdminGuardProps {
  children: React.ReactNode;
}

function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Handle navigation in useEffect to avoid setState during render
  useEffect(() => {
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!user) {
      router.push('/platform/auth/login');
      return;
    }

    // Check if user has admin access
    const isAdmin = user.fields.Access === 'Admin';

    // Redirect to dashboard if not admin
    if (!isAdmin) {
      router.push('/platform/dashboard');
      return;
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking authentication or during redirect
  if (isLoading || !user || user.fields.Access !== 'Admin') {
    return (
      <div className='flex items-center justify-center h-screen'>
        <CustomSpinner />
      </div>
    );
  }

  // Render children if user is admin
  return <>{children}</>;
}

export default AdminGuard;

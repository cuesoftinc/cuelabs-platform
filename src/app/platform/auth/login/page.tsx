'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { signIn, useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/queries/useAuth';
import CustomSpinner from '@/components/custom/custom-spinner';

import githubIcon from '@/svgs/github.svg';

function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setCurrentUser } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleUserSession = useCallback(async (session: { user?: { id?: string } }) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Validate session has required data
      if (!session?.user?.id) {
        await signOut({ redirect: false });
        return;
      }

      // Fetch user from Airtable using the ID from session
      const response = await fetch(`/api/users/${session.user.id}`);
      
      if (!response.ok) {
        await signOut({ redirect: false });
        return;
      }

      const userData = await response.json();
      
      // Set user in Redux
      setCurrentUser(userData);
      
      // Redirect to dashboard
      router.push('/platform/dashboard');
      
    } catch (error) {
      console.error('Error processing user session:', error);
      
      // Clear the session on any error and allow fresh login
      await signOut({ redirect: false });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, setCurrentUser, router]);

  useEffect(() => {
    if (status === 'loading') return;
    
    // Only process session if user has a valid Airtable ID
    if (session?.user?.id) {
      handleUserSession(session);
    }
  }, [session, status, handleUserSession]);

  const handleGitHubSignIn = () => {
    setIsSigningIn(true);
    // Remove callbackUrl to prevent redirect loops
    signIn('github');
  };

  // Show loading while NextAuth is initializing
  if (status === 'loading') {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <CustomSpinner />
        <p className='text-auth-text mt-4'>Initializing...</p>
      </div>
    );
  }

  // Show loading while signing in with GitHub
  if (isSigningIn) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <CustomSpinner />
        <p className='text-auth-text mt-4'>Redirecting to GitHub...</p>
      </div>
    );
  }

  // Show loading while processing session
  if (isProcessing) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <CustomSpinner />
        <p className='text-auth-text mt-4'>Setting up your account...</p>
      </div>
    );
  }

  return (
    <>
      <h1 className='text-white text-2xl leading-[120%] font-semibold mb-2'>
        Sign-in to your account
      </h1>
      <p className='text-16c text-auth-text leading-[140%] '>
        Choose your preferred sign-in method
      </p>

      <div className='my-8 w-full flex flex-col gap-4'>
        <div
          onClick={handleGitHubSignIn}
          className='bg-[#0F0F0F] flex justify-center items-center gap-3 h-[48px] rounded-[1000px] cursor-pointer hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Image src={githubIcon} alt='Github Icon' width={24} height={24} />
          <span className='text-[#E9E3DD] text-[15px] leading-[26px] font-semibold'>
            Sign In with Github
          </span>
        </div>
      </div>
    </>
  );
}

export default LoginPage;

'use client';

import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (status === 'loading') return;
    
    // Only process session if user has a valid Airtable ID
    if (session?.user?.id) {
      handleUserSession(session);
    }
  }, [session, status]);

  const handleUserSession = async (session: any) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Validate session has required data
      if (!session?.user?.id) {
        console.log('🔄 Invalid session: missing user ID, clearing session');
        await signOut({ redirect: false });
        return;
      }

      // Fetch user from Airtable using the ID from session
      const response = await fetch(`/api/users/${session.user.id}`);
      
      if (!response.ok) {
        console.log(`🔄 User not found in Airtable (${response.status}), clearing session`);
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
      console.log('🔄 Error occurred, clearing session and allowing fresh login');
      
      // Clear the session on any error and allow fresh login
      await signOut({ redirect: false });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGitHubSignIn = () => {
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

  // Show loading while processing
  if (isProcessing) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <CustomSpinner />
        <p className='text-auth-text mt-4'>Processing your login...</p>
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
          className='bg-[#0F0F0F] flex justify-center items-center gap-3 h-[48px] rounded-[1000px] cursor-pointer hover:opacity-70'
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

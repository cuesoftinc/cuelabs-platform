'use client';

import React from 'react';
import Image from 'next/image';

import { signIn, getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Eye, EyeOff } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';

import googleIcon from '@/svgs/google.svg';
import githubIcon from '@/svgs/github.svg';
import appleIcon from '@/svgs/apple.svg';

function LoginPage() {
  // const [showPassword, setShowPassword] = useState(false);
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const router = useRouter();

  // const isFormValid = email.trim() !== '' && password.trim() !== '';

  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };

  const router = useRouter();

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard');
      }
    });
  }, [router]);

  const handleSignIn = (provider: string) => {
    signIn(provider, {
      callbackUrl: '/dashboard',
      redirect: true,
    });
  };

  return (
    <>
      <h1 className='text-white text-2xl leading-[120%] font-semibold mb-2'>
        Create your account
      </h1>
      <p className='text-16c text-auth-text leading-[140%] '>
        Choose your preferred sign-in method
      </p>

      <div className='my-8 w-full flex flex-col gap-4'>
        <div
          onClick={() => handleSignIn('google')}
          className='bg-[#0F0F0F] flex justify-center items-center gap-3 h-[48px] rounded-[1000px] cursor-pointer hover:opacity-70'
        >
          <Image src={googleIcon} alt='Google Icon' width={24} height={24} />
          <span className='text-[#E9E3DD] text-[15px] leading-[26px] font-semibold'>
            Sign In with Google
          </span>
        </div>

        <div
          onClick={() => handleSignIn('apple')}
          className='bg-[#0F0F0F] flex justify-center items-center gap-3 h-[48px] rounded-[1000px] cursor-pointer hover:opacity-70'
        >
          <Image src={appleIcon} alt='Apple Icon' width={24} height={24} />
          <span className='text-[#E9E3DD] text-[15px] leading-[26px] font-semibold'>
            Sign In with Apple
          </span>
        </div>

        <div
          onClick={() => handleSignIn('github')}
          className='bg-[#0F0F0F] flex justify-center items-center gap-3 h-[48px] rounded-[1000px] cursor-pointer hover:opacity-70'
        >
          <Image src={githubIcon} alt='Github Icon' width={24} height={24} />
          <span className='text-[#E9E3DD] text-[15px] leading-[26px] font-semibold'>
            Sign In with Github
          </span>
        </div>
      </div>

      {/* <div className='mt-8 w-full flex flex-col gap-6'>
        <div className='input-style'>
          <Label htmlFor='email' className=''>
            Email
          </Label>
          <Input
            type='email'
            id='email'
            placeholder='Enter email address'
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='input-style'>
          <Label htmlFor='password' className=''>
            Password
          </Label>
          <div className='relative'>
            <Input
              type={showPassword ? 'text' : 'password'}
              id='password'
              placeholder='Enter password'
              className='pr-12'
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-auth-text hover:text-gray-700 focus:outline-none'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className='w-full text-center'>
        <Button
          className='btn-main-p my-8'
          disabled={!isFormValid}
          onClick={() => router.push('/platform/dashboard')}
        >
          Log in
        </Button>
        <p className='text-16c '>
          Don&apos;t have an account?{' '}
          <span
            className='gradient-bg-text cursor-pointer'
            onClick={() => router.push('/platform/auth/signup')}
          >
            Create Account
          </span>
        </p>
      </div> */}
    </>
  );
}

export default LoginPage;

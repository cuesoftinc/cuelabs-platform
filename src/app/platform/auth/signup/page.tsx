'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = () => {
    router.push('/platform/auth/otp');
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <>
      <h1 className='text-white text-2xl leading-[120%] font-semibold mb-2'>
        Create Account
      </h1>
      <p className='text-16c text-auth-text leading-[140%] '>
        Enter your details to create an account.
      </p>

      <div className='mt-8 w-full flex flex-col gap-6'>
        <div className='flex flex-col gap-6 md:gap-4 lg:gap-0 md:flex-row justify-between'>
          <div className='input-style lg:w-[48%]'>
            <Label htmlFor='firstname' className=''>
              First Name
            </Label>
            <Input
              type='text'
              id='firstname'
              placeholder='Enter First Name'
              required
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
          </div>

          <div className='input-style lg:w-[48%]'>
            <Label htmlFor='lastname' className=''>
              Last Name
            </Label>
            <Input
              type='text'
              id='lastname'
              placeholder='Enter Last Name'
              required
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
          </div>
        </div>
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
            value={email}
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
              value={password}
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
          onClick={handleSubmit}
        >
          Create Account
        </Button>
        <p className='text-16c '>
          Already have an account?{' '}
          <span className='gradient-bg-text cursor-pointer'>Log in</span>
        </p>
      </div>
    </>
  );
}

export default SignupPage;

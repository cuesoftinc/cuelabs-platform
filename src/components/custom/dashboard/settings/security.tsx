'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

function Security() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const togglePasswordVisibility = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (e.currentTarget.name === 'current-password-visibility') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (e.currentTarget.name === 'new-password-visibility') {
      setShowNewPassword(!showNewPassword);
    } else if (e.currentTarget.name === 'confirm-password-visibility') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className='card-container p-5 w-[58%] max-w-[600px]'>
      <div className='border-b-[0.6px] border-[#1F1F1F] pb-4'>
        <p className='text-16c font-medium leading-[18px]'>Change Password</p>
      </div>

      <div className=' w-full flex flex-col gap-6 mt-8'>
        <div className='input-style'>
          <Label htmlFor='current-password' className=''>
            Current Password
          </Label>
          <div className='relative'>
            <Input
              type={showCurrentPassword ? 'text' : 'password'}
              id='current-password'
              placeholder='Enter current password'
              className='pr-12'
              onChange={(e) => setCurrentPassword(e.target.value)}
              value={currentPassword}
            />
            <button
              name='current-password-visibility'
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-auth-text hover:text-gray-700 focus:outline-none'
              aria-label={
                showCurrentPassword ? 'Hide password' : 'Show password'
              }
            >
              {showCurrentPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>
        </div>

        <div className='input-style'>
          <Label htmlFor='new-password' className=''>
            New Password
          </Label>
          <div className='relative'>
            <Input
              type={showNewPassword ? 'text' : 'password'}
              id='new-password'
              placeholder='Enter new password'
              className='pr-12'
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
            <button
              type='button'
              name='new-password-visibility'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-auth-text hover:text-gray-700 focus:outline-none'
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>
        </div>

        <div className='input-style'>
          <Label htmlFor='confirm-password' className=''>
            Confirm New Password
          </Label>
          <div className='relative'>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              id='confirm-password'
              placeholder='Confirm new password'
              className='pr-12'
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
            <button
              type='button'
              name='confirm-password-visibility'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-auth-text hover:text-gray-700 focus:outline-none'
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              {showConfirmPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>
        </div>
      </div>

      <Button
        className='btn-main-p mt-12'
        //   disabled={!isFormValid}
        //   onClick={handleSubmit}
      >
        Save Changes
      </Button>
    </div>
  );
}

export default Security;

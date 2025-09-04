'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  return (
    // <div className='auth-form-content-wrapper'>
      <div className='my-8 w-full flex flex-col gap-4'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold'>
            Authentication Error
          </h2>
          <p className='mt-2 text-center text-sm text-red-600'>
            {getErrorMessage(error)}
          </p>
        </div>

        <div className='mt-8'>
          <Link
            href='/platform/auth/login'
            className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Try Again
          </Link>
        </div>
      </div>
    // </div>
  );
}

'use client';

import { FormEvent, useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { FaCheckCircle } from 'react-icons/fa';

function JoinWaitlist() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (error !== '') {
      const timer = setTimeout(() => {
        setError('');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    if (!name || !email) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_BASE_ID}/${process.env.NEXT_PUBLIC_TABLE_ID}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            fldzIf97m8zhZhywF: name,
            fldfbkaTJEFXyyioo: email,
          },
        }),
      },
    )
      .then((response) => {
        if (!response.ok) {
          setError('An error occurred, please try again');
          //   return;
          throw new Error('Failed to submit form');
        }
        return response.json();
      })
      .then(() => {
        // console.log("Airtable Response:", data);
        setSuccess(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('An Error occured, please try again');
        setLoading(false);
        return;
      });
  };

  return (
    <>
      {success && <SuccessMessage />}

      {/* {error && <div>Error</div>} */}

      {!success && (
        <WaitingListForm
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          loading={loading}
          handleSubmit={handleSubmit}
          error={error}
        />
      )}
    </>
  );
}

export default JoinWaitlist;

type WaitingListFormProps = {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  loading: boolean;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  error: string;
};
const WaitingListForm = ({
  name,
  setName,
  setEmail,
  email,
  loading,
  handleSubmit,
  error,
}: WaitingListFormProps) => {
  return (
    <div className=''>
      <div className='mt-4 lg:mt-8'>
        <h3 className='text-2xl md:text-3xl lg:text-[32px] lg:leading-[38.4px] font-extrabold'>
          We&apos;re cooking up something special just for you
        </h3>
        <p className='text-sm lg:text-[16px] lg:leading-[28px] mt-2 md:mt-4'>
          Be the first to experience it,{' '}
          <span className='font-extrabold gradient-bg-text'>
            join our waitlist
          </span>{' '}
          and stay in the loop!
        </p>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
        <Input
          type='text'
          placeholder='Full Name'
          className='rounded-[50px] py-2.5 px-8 h-[50px] border-product-walkthrough-border'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type='email'
          placeholder='Email'
          className='rounded-[50px] py-2.5 px-8 h-[50px] border-product-walkthrough-border'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && (
          <div className='bg-featured-projects-bg p-2 text-sm text-red-400 font-bold'>
            {error}
          </div>
        )}

        <Button
          variant={'default'}
          className={`btn-main w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Join our waitlist'}
          {/* Join our waitlist */}
          {/* <Image src={btnIcon} alt='Arrow Icon' /> */}
        </Button>
      </form>
    </div>
  );
};

const SuccessMessage = () => {
  return (
    <div className='text-white text-center p-4 rounded-md '>
      <FaCheckCircle className='text-green-500 mb-2 mx-auto' size={50} />

      <h3 className='text-lg font-bold '>Success!</h3>
      <p>Your form has been submitted successfully.</p>
    </div>
  );
};

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ProfileInformation() {
  return (
    <div className='card-container p-5 md:w-[58%] max-w-[600px]'>
      <div className='border-b-[0.6px] border-[#1F1F1F] pb-4'>
        <div className='text-white flex items-center gap-1'>
          <ImageIcon width={12} height={12} />
          <span className='text-xs font-medium'>Photo</span>
        </div>
        <div className='flex gap-2 items-center mt-2'>
          <div className='bg-pink-400 w-[48px] h-[48px] rounded-full'></div>
          <span className='gradient-bg-text text-[10px] leading-[14px] font-medium'>
            Change Photo
          </span>
        </div>
      </div>
      <div className=' w-full flex flex-col gap-6 mt-4'>
        <div className='flex flex-col gap-6 md:flex-row justify-between'>
          <div className='input-style md:w-[48%]'>
            <Label htmlFor='firstname' className=''>
              First Name
            </Label>
            <Input
              type='text'
              id='firstname'
              placeholder='Enter First Name'
              required
              //   onChange={(e) => setFirstName(e.target.value)}
              //   value={firstName}
            />
          </div>

          <div className='input-style md:w-[48%]'>
            <Label htmlFor='lastname' className=''>
              Last Name
            </Label>
            <Input
              type='text'
              id='lastname'
              placeholder='Enter Last Name'
              required
              //   onChange={(e) => setLastName(e.target.value)}
              //   value={lastName}
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
            // onChange={(e) => setEmail(e.target.value)}
            // value={email}
          />
        </div>

        <div className='input-style'>
          <Label htmlFor='address' className=''>
            Address
          </Label>
          <Input
            type='text'
            id='address'
            placeholder='Enter Address'
            required
            //   onChange={(e) => setFirstName(e.target.value)}
            //   value={firstName}
          />
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

export default ProfileInformation;

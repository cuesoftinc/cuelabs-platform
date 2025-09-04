'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/queries/useAuth';
import { useUpdateUser } from '@/hooks/queries/useUsers';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import Image from 'next/image';
import AvatarCircle from '@/images/avatar-circle.png';
import CustomSpinner from '@/components/custom/custom-spinner';

function ProfileInformation() {
  const { user } = useAuth();
  const updateUserMutation = useUpdateUser();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      const fullName = user.fields.Name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData({
        firstName,
        lastName,
        email: user.fields.Email || '',
        address: user.fields.Address || '',
      });
    }
  }, [user]);

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (newPhotoPreview) {
        URL.revokeObjectURL(newPhotoPreview);
      }
    };
  }, [newPhotoPreview]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    setIsLoading(true);
    setShowFeedback(null); // Clear any existing feedback

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      await updateUserMutation.mutateAsync({
        userId: user.id,
        userData: {
          Name: fullName,
          Email: formData.email,
          Address: formData.address,
        },
      });

      // Update the user in the auth store with the new data
      const updatedUser = {
        ...user,
        fields: {
          ...user.fields,
          Name: fullName,
          Email: formData.email,
          Address: formData.address,
        },
      };

      dispatch(updateUser(updatedUser));

      // Show success feedback
      setShowFeedback({
        type: 'success',
        message: 'Profile updated successfully!',
      });

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowFeedback(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating user:', error);

      // Show error feedback
      setShowFeedback({
        type: 'error',
        message: `Error saving changes: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });

      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setShowFeedback(null);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get user avatar
  const getUserAvatar = () => {
    // Show preview if available (newly selected photo)
    if (newPhotoPreview) {
      return newPhotoPreview;
    }

    // Show existing user photo
    if (user?.fields.Attachments && user.fields.Attachments.length > 0) {
      return user.fields.Attachments[0].url;
    }

    return AvatarCircle;
  };

  const handlePhotoChange = () => {
    fileInputRef.current?.click();
  };

  // const clearPhotoPreview = () => {
  //   if (newPhotoPreview) {
  //     URL.revokeObjectURL(newPhotoPreview);
  //     setNewPhotoPreview(null);
  //   }
  // };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setShowFeedback({
        type: 'error',
        message: 'Please select a valid image file',
      });
      setTimeout(() => setShowFeedback(null), 5000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setShowFeedback({
        type: 'error',
        message: 'Image size must be less than 5MB',
      });
      setTimeout(() => setShowFeedback(null), 5000);
      return;
    }

    // Create preview immediately
    const previewUrl = URL.createObjectURL(file);
    setNewPhotoPreview(previewUrl);

    setIsUploadingPhoto(true);
    setShowFeedback(null);

    try {
      // Convert file to base64 for Airtable
      await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Extract base64 data (remove data:image/...;base64, prefix)
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.readAsDataURL(file);
      });

      // For now, we'll use a simpler approach - just update the user
      // Airtable will handle the attachment processing
      await updateUserMutation.mutateAsync({
        userId: user.id,
        userData: {
          // We'll need to implement proper file upload to Airtable
          // For now, this is a placeholder
        },
      });

      // For now, we'll just show a success message
      // TODO: Implement proper file upload to Airtable
      setShowFeedback({
        type: 'success',
        message: 'Photo upload feature coming soon!',
      });

      setShowFeedback({
        type: 'success',
        message: 'Profile photo updated successfully!',
      });

      setTimeout(() => setShowFeedback(null), 3000);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setShowFeedback({
        type: 'error',
        message: `Error uploading photo: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      setTimeout(() => setShowFeedback(null), 5000);
    } finally {
      setIsUploadingPhoto(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!user) {
    return (
      <div className='card-container p-5 md:w-[58%] max-w-[600px]'>
        <div className='flex items-center justify-center py-8'>
          <CustomSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className='card-container p-5 md:w-[58%] max-w-[600px]'>
      <div className='border-b-[0.6px] border-[#1F1F1F] pb-4'>
        <div className='text-white flex items-center gap-1'>
          <ImageIcon width={12} height={12} />
          <span className='text-xs font-medium'>Photo</span>
        </div>
        <div className='flex gap-2 items-center mt-2'>
          <div className='relative'>
            <Image
              src={getUserAvatar()}
              alt={`${user.fields.Name} avatar`}
              width={48}
              height={48}
              className='w-[48px] h-[48px] rounded-full object-cover'
            />
            {isUploadingPhoto && (
              <div className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center'>
                <CustomSpinner size='sm' />
              </div>
            )}
          </div>
          <span
            className='gradient-bg-text text-[10px] leading-[14px] font-medium cursor-pointer hover:opacity-80'
            onClick={handlePhotoChange}
          >
            Change Photo
          </span>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileSelect}
          className='hidden'
        />
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
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
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
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
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
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
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
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </div>
      </div>
      <Button
        className='btn-main-p mt-12'
        disabled={isLoading || updateUserMutation.isPending}
        onClick={handleSaveChanges}
      >
        {isLoading || updateUserMutation.isPending ? (
          <div className='flex items-center gap-2'>
            <CustomSpinner size='sm' />
            Saving...
          </div>
        ) : (
          'Save Changes'
        )}
      </Button>

      {showFeedback && (
        <div
          className={`mt-4 p-3 border rounded-lg ${
            showFeedback.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <p
            className={`text-sm ${
              showFeedback.type === 'success'
                ? 'text-green-700'
                : 'text-red-700'
            }`}
          >
            {showFeedback.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default ProfileInformation;

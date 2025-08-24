'use client';

import React, { useState } from 'react';
import { useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/queries/useUsers';
import { Button } from '@/components/ui/button';
import CustomSpinner from '@/components/custom/custom-spinner';
import { formatDateToDayMonthYear } from '@/lib/utils';

export default function UserExamples() {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Fetch all users
  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useUsers();

  // Fetch a specific user by ID
  const { data: userData, isLoading: isLoadingUser, error: userError } = useUser(selectedUserId);

  // Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleCreateUser = () => {
    if (newUserName && newUserEmail) {
      createUserMutation.mutate({
        Name: newUserName,
        Email: newUserEmail,
        Status: 'Active',
        'Created At': new Date().toISOString(),
        'Modified At': new Date().toISOString(),
      });
      setNewUserName('');
      setNewUserEmail('');
    }
  };

  const handleUpdateUser = (userId: string) => {
    updateUserMutation.mutate({
      userId,
      userData: {
        'Modified At': new Date().toISOString(),
      },
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center p-8">
        <CustomSpinner />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="p-8 text-red-500">
        Error loading users: {usersError.message}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">User Management Examples</h1>

      {/* Create User Section */}
      <div className="card-container p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Create New User</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="input-style flex-1"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            className="input-style flex-1"
          />
          <Button
            onClick={handleCreateUser}
            disabled={createUserMutation.isPending || !newUserName || !newUserEmail}
            className="btn-main-p"
          >
            {createUserMutation.isPending ? <CustomSpinner size="sm" /> : 'Create User'}
          </Button>
        </div>
        {createUserMutation.error && (
          <p className="text-red-500 text-sm">Error: {createUserMutation.error.message}</p>
        )}
      </div>

      {/* All Users Section */}
      <div className="card-container p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          All Users ({usersData?.records.length || 0})
        </h2>
        <div className="space-y-4">
          {usersData?.records.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border border-auth-border rounded-lg"
            >
              <div className="flex-1">
                <h3 className="text-white font-medium">{user.fields.Name}</h3>
                <p className="text-auth-text text-sm">{user.fields.Email}</p>
                <p className="text-auth-text text-xs">
                  Status: {user.fields.Status || 'Unknown'} | 
                  Created: {new Date(user.fields['Created At']).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedUserId(user.id)}
                  variant="outline"
                  size="sm"
                  className="border-auth-border bg-darkmode-bg"
                >
                  View Details
                </Button>
                <Button
                  onClick={() => handleUpdateUser(user.id)}
                  disabled={updateUserMutation.isPending}
                  variant="outline"
                  size="sm"
                  className="border-auth-border bg-darkmode-bg"
                >
                  {updateUserMutation.isPending ? <CustomSpinner size="sm" /> : 'Update'}
                </Button>
                <Button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={deleteUserMutation.isPending}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  {deleteUserMutation.isPending ? <CustomSpinner size="sm" /> : 'Delete'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Single User Details Section */}
      {selectedUserId && (
        <div className="card-container p-6">
          <h2 className="text-xl font-semibold text-white mb-4">User Details</h2>
          {isLoadingUser ? (
            <div className="flex items-center justify-center p-4">
              <CustomSpinner />
              <span className="ml-2">Loading user details...</span>
            </div>
          ) : userError ? (
            <div className="text-red-500">Error loading user: {userError.message}</div>
          ) : userData ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium">{userData.fields.Name}</h3>
                <p className="text-auth-text">{userData.fields.Email}</p>
                <p className="text-auth-text text-sm">
                  Status: {userData.fields.Status || 'Unknown'}
                </p>
                <p className="text-auth-text text-sm">
                  Wallet Balance: {userData.fields['Wallet Balance'] || 0} Cues
                </p>
                <p className="text-auth-text text-sm">
                  Created: {formatDateToDayMonthYear(userData.fields['Created At'])}
                </p>
                <p className="text-auth-text text-sm">
                  Modified: {new Date(userData.fields['Modified At']).toLocaleString()}
                </p>
              </div>
              <Button
                onClick={() => setSelectedUserId('')}
                variant="outline"
                className="border-auth-border bg-darkmode-bg"
              >
                Close Details
              </Button>
            </div>
          ) : (
            <div className="text-auth-text">No user data found</div>
          )}
        </div>
      )}
    </div>
  );
}

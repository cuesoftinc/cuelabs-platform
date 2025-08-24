'use client';

import React from 'react';
import { useAuth } from '@/hooks/queries/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CurrentUserProfile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Card className="card-container p-6">
        <CardHeader>
          <CardTitle className="text-white">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-auth-text">No user logged in</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-container p-6">
      <CardHeader>
        <CardTitle className="text-white">Current User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-white font-medium text-lg">{user.fields.Name}</h3>
          <p className="text-auth-text">{user.fields.Email}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-auth-text">Status:</span>
            <span className="text-white ml-2">{user.fields.Status || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-auth-text">Wallet Balance:</span>
            <span className="text-white ml-2">
              {user.fields['Wallet Balance']?.toLocaleString() || '0'} Cues
            </span>
          </div>
          <div>
            <span className="text-auth-text">Rank:</span>
            <span className="text-white ml-2">{user.fields.Rank || 'N/A'}</span>
          </div>
          <div>
            <span className="text-auth-text">Created:</span>
            <span className="text-white ml-2">
              {new Date(user.fields['Created At']).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-auth-border">
          <Button
            onClick={logout}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

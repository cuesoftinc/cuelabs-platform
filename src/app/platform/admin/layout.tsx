'use client';

import React from 'react';
import AdminGuard from '@/components/custom/admin/admin-guard';
import AdminSidebar from '@/components/custom/admin/admin-sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <div className='flex min-h-screen bg-[#0F0F0F]'>
        <AdminSidebar />
        <main className='flex-1 overflow-auto'>
          <div className='p-6'>{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}

export default AdminLayout;

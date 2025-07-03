import Sidebar from '@/components/custom/dashboard/sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className='h-screen w-screen max-w-[1440px] mx-auto bg-darkmode-bg flex'>
        <Sidebar />

        <div className='flex-1 overflow-auto'>{children}</div>
      </div>
    </div>
  );
}

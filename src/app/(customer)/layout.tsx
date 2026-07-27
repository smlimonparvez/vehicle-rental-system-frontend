'use client';
import AuthGuard from '@/components/auth/AuthGuard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="customer">
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">{children}</main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
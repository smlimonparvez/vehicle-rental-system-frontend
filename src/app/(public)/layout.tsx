import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/**
 * Public layout — no AuthGuard.
 * Used by: /vehicles, /vehicles/[id], /about, /contact
 * Unauthenticated users can freely browse these pages.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">{children}</main>
      <Footer />
    </div>
  );
}
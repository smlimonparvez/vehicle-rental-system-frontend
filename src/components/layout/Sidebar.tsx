'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Car, Users, CalendarCheck, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/vehicles',  label: 'Vehicles',  icon: Car },
  { href: '/admin/users',     label: 'Users',     icon: Users },
  { href: '/admin/bookings',  label: 'Bookings',  icon: CalendarCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car size={16} />
          </div>
          <span className="text-white">VehicleRental</span>
        </Link>
        <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}>
              <Icon size={17} />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — user info + ThemeToggle + logout */}
      <div className="p-4 border-t border-gray-800">
        {/* ✅ ThemeToggle always visible in admin */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Appearance</span>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors">
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}
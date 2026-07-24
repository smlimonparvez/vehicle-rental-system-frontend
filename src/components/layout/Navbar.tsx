'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, Car, LogOut, ChevronDown, LayoutDashboard, CalendarCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const isLanding = pathname === '/';

  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initial = user?.name?.charAt(0).toUpperCase() ?? '?';

  // Keep the navbar readable in light mode while still looking polished on the landing page
  const navBg = isLanding
    ? 'bg-white/95 dark:bg-gray-900/95 border-gray-200 dark:border-white/10 shadow-sm backdrop-blur-sm'
    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm';
  const textCls = isLanding
    ? 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400';

  return (
    <nav className={`${navBg} border-b sticky top-0 z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-400">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car size={16} className="text-white" />
            </div>
            <span className={isLanding ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}>
              VehicleRental
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/vehicles" className={`text-sm transition-colors ${textCls}`}>Vehicles</Link>
            <Link href="/about"    className={`text-sm transition-colors ${textCls}`}>About</Link>
            <Link href="/contact"  className={`text-sm transition-colors ${textCls}`}>Contact</Link>

            {/* ✅ ThemeToggle — always visible */}
            <ThemeToggle />

            {user ? (
              user.role === 'admin' ? (
                <div className="flex items-center gap-3">
                  <Link href="/admin/dashboard" className={`text-sm transition-colors ${textCls}`}>Admin Panel</Link>
                  <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              ) : (
                /* Customer dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${textCls}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {initial}
                    </div>
                    {user.name.split(' ')[0]}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <LayoutDashboard size={15} className="text-gray-400" /> Dashboard
                        </Link>
                        <Link href="/my-bookings" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <CalendarCheck size={15} className="text-gray-400" /> My Bookings
                        </Link>
                        <Link href="/profile" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <span className="text-gray-400 text-sm">👤</span> My Profile
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <LogOut size={15} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className={`text-sm transition-colors ${textCls}`}>Login</Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setMenuOpen(o => !o)} className={`p-1.5 ${isLanding ? 'text-gray-700 dark:text-gray-200' : 'text-gray-600 dark:text-gray-300'}`}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 py-4 flex flex-col gap-3 text-sm px-1">
            <Link href="/vehicles" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 py-1">Vehicles</Link>
            <Link href="/about"    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 py-1">About</Link>
            <Link href="/contact"  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 py-1">Contact</Link>

            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link href="/admin/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 py-1">Admin Panel</Link>
                ) : (
                  <>
                    <Link href="/dashboard"   className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 py-1"><LayoutDashboard size={15} /> Dashboard</Link>
                    <Link href="/my-bookings" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 py-1"><CalendarCheck size={15} /> My Bookings</Link>
                    <Link href="/profile"     className="text-gray-700 dark:text-gray-200 hover:text-blue-600 py-1">👤 My Profile</Link>
                  </>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 dark:text-red-400 py-1 text-left"><LogOut size={15} /> Logout</button>
              </>
            ) : (
              <>
                <Link href="/login"    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 py-1">Login</Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-center hover:bg-blue-700">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
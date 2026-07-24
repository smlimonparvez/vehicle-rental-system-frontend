'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getBookingsApi } from '@/lib/api';
import { Booking } from '@/types';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { CalendarCheck, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (token) getBookingsApi(token).then(r => { if (r.success) setBookings(r.data || []); }).finally(() => setLoading(false));
  }, [token]);

  const stats = [
    { label: 'Total Bookings',  value: bookings.length,                                       icon: CalendarCheck, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
    { label: 'Active',          value: bookings.filter(b => b.status==='active').length,    icon: Clock,         color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
    { label: 'Returned',        value: bookings.filter(b => b.status==='returned').length,  icon: CheckCircle,   color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
    { label: 'Cancelled',       value: bookings.filter(b => b.status==='cancelled').length, icon: XCircle,       color: 'bg-red-50 dark:bg-red-900/20 text-red-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Welcome back, {user?.name}! 👋</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Here's your booking overview</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}><Icon size={20} /></div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{loading ? '...' : value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800 dark:text-white">Recent Bookings</h2>
          <Link href="/my-bookings" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        {loading ? <p className="text-gray-400 text-sm py-4">Loading...</p> : bookings.length === 0 ? (
          <div className="text-center py-8"><p className="text-gray-400 mb-3">No bookings yet</p><Link href="/vehicles" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Browse Vehicles</Link></div>
        ) : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-700">{['Vehicle','Start','End','Price','Status'].map(h => <th key={h} className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">{h}</th>)}</tr></thead>
            <tbody>{bookings.slice(0,5).map(b => (
              <tr key={b.id} className="border-b border-gray-50 dark:border-gray-700/50">
                <td className="py-3 font-medium text-gray-800 dark:text-white">{b.vehicle?.vehicle_name||'—'}</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">{String(b.rent_start_date).split('T')[0]}</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">{String(b.rent_end_date).split('T')[0]}</td>
                <td className="py-3 text-gray-800 dark:text-white">${b.total_price}</td>
                <td className="py-3"><Badge status={b.status} /></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}
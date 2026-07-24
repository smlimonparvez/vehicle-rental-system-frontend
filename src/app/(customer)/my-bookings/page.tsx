'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getBookingsApi, updateBookingApi } from '@/lib/api';
import { Booking } from '@/types';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function MyBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading]   = useState(true);

  const fetchBookings = async () => { if(!token)return; try{const r=await getBookingsApi(token);if(r.success)setBookings(r.data||[]);}finally{setLoading(false);} };
  useEffect(()=>{fetchBookings();},[token]);

  const canCancel = (b: Booking) => b.status==='active' && String(b.rent_start_date).split('T')[0] > new Date().toISOString().split('T')[0];

  const handleCancel = async (id: number) => {
    if(!confirm('Cancel this booking?'))return;
    const r=await updateBookingApi(id,{status:'cancelled'},token!);
    if(r.success){toast.success('Booking cancelled');fetchBookings();}
    else toast.error(r.message||'Failed to cancel');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">My Bookings</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Manage your vehicle rentals</p>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading?<div className="py-20 text-center text-gray-400">Loading bookings...</div>:bookings.length===0?<div className="py-20 text-center text-gray-400">No bookings found</div>:(
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50"><tr>{['#','Vehicle','Start Date','End Date','Total','Status','Action'].map(h=><th key={h} className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {bookings.map(b=>(
                <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-400">#{b.id}</td>
                  <td className="px-4 py-3"><p className="font-medium text-gray-800 dark:text-white">{b.vehicle?.vehicle_name}</p><p className="text-xs text-gray-400 capitalize">{b.vehicle?.type}</p></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{String(b.rent_start_date).split('T')[0]}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{String(b.rent_end_date).split('T')[0]}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white">${b.total_price}</td>
                  <td className="px-4 py-3"><Badge status={b.status}/></td>
                  <td className="px-4 py-3">{canCancel(b)?<button onClick={()=>handleCancel(b.id)} className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>:<span className="text-gray-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}
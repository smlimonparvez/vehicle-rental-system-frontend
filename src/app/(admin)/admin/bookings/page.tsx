'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getBookingsApi, updateBookingApi } from '@/lib/api';
import { Booking } from '@/types';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

const FILTERS=['all','active','returned','cancelled'];

export default function AdminBookingsPage() {
  const {token}=useAuth();
  const [bookings,setBookings]=useState<Booking[]>([]);
  const [filtered,setFiltered]=useState<Booking[]>([]);
  const [loading,setLoading]=useState(true);
  const [sf,setSf]=useState('all');

  const fetchBookings=async()=>{if(!token)return;const r=await getBookingsApi(token);if(r.success){setBookings(r.data||[]);setFiltered(r.data||[]);}setLoading(false);};
  useEffect(()=>{fetchBookings();},[token]);
  useEffect(()=>{setFiltered(sf==='all'?bookings:bookings.filter(b=>b.status===sf));},[sf,bookings]);

  const handleReturn=async(id:number)=>{
    if(!confirm('Mark as returned?'))return;
    const r=await updateBookingApi(id,{status:'returned'},token!);
    if(r.success){toast.success('Booking marked as returned. Vehicle is now available.');fetchBookings();}
    else toast.error(r.message||'Update failed');
  };

  const counts={all:bookings.length,active:bookings.filter(b=>b.status==='active').length,returned:bookings.filter(b=>b.status==='returned').length,cancelled:bookings.filter(b=>b.status==='cancelled').length};

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Bookings</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Manage all vehicle bookings</p>
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map(s=><button key={s} onClick={()=>setSf(s)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${sf===s?'bg-blue-600 text-white':'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300'}`}>{s} ({counts[s as keyof typeof counts]})</button>)}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading?<div className="py-20 text-center text-gray-400">Loading bookings...</div>:filtered.length===0?<div className="py-20 text-center text-gray-400">No bookings found</div>:(
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50"><tr>{['#','Customer','Vehicle','Start','End','Price','Status','Action'].map(h=><th key={h} className="text-left px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filtered.map(b=>(
                <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-400">#{b.id}</td>
                  <td className="px-4 py-3"><p className="font-medium text-gray-800 dark:text-white">{b.customer?.name}</p><p className="text-xs text-gray-400">{b.customer?.email}</p></td>
                  <td className="px-4 py-3"><p className="font-medium text-gray-800 dark:text-white">{b.vehicle?.vehicle_name}</p><p className="text-xs text-gray-400">{b.vehicle?.registration_number}</p></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{String(b.rent_start_date).split('T')[0]}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{String(b.rent_end_date).split('T')[0]}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white">${b.total_price}</td>
                  <td className="px-4 py-3"><Badge status={b.status}/></td>
                  <td className="px-4 py-3">{b.status==='active'?<button onClick={()=>handleReturn(b.id)} className="flex items-center gap-1 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"><CheckCircle size={12}/>Mark Returned</button>:<span className="text-gray-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getVehiclesApi, getUsersApi, getBookingsApi } from '@/lib/api';
import { Car, Users, CalendarCheck, Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { Booking } from '@/types';

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ vehicles:0, users:0, bookings:0, active:0 });
  const [recent, setRecent] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!token)return;
    Promise.all([getVehiclesApi(),getUsersApi(token),getBookingsApi(token)]).then(([v,u,b])=>{
      const bk=b.data||[];
      setStats({vehicles:v.data?.length||0,users:u.data?.length||0,bookings:bk.length,active:bk.filter((x:Booking)=>x.status==='active').length});
      setRecent(bk.slice(0,5));
    }).finally(()=>setLoading(false));
  },[token]);

  const cards=[
    {label:'Total Vehicles', value:stats.vehicles,icon:Car,           color:'bg-blue-50 dark:bg-blue-900/20 text-blue-600',   href:'/admin/vehicles'},
    {label:'Total Users',    value:stats.users,   icon:Users,         color:'bg-purple-50 dark:bg-purple-900/20 text-purple-600',href:'/admin/users'},
    {label:'Total Bookings', value:stats.bookings,icon:CalendarCheck, color:'bg-green-50 dark:bg-green-900/20 text-green-600', href:'/admin/bookings'},
    {label:'Active Bookings',value:stats.active,  icon:Clock,         color:'bg-orange-50 dark:bg-orange-900/20 text-orange-600',href:'/admin/bookings'},
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">System overview</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({label,value,icon:Icon,color,href})=>(
          <Link key={label} href={href} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}><Icon size={20}/></div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{loading?'...':value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          </Link>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800 dark:text-white">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        {loading?<p className="text-gray-400 text-sm py-4">Loading...</p>:recent.length===0?<p className="text-gray-400 text-sm py-4">No bookings yet</p>:(
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-700">{['Customer','Vehicle','Dates','Price','Status'].map(h=><th key={h} className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">{h}</th>)}</tr></thead>
            <tbody>{recent.map((b:any)=>(
              <tr key={b.id} className="border-b border-gray-50 dark:border-gray-700/50">
                <td className="py-3 text-gray-800 dark:text-white">{b.customer?.name}</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">{b.vehicle?.vehicle_name}</td>
                <td className="py-3 text-gray-500 dark:text-gray-500 text-xs">{String(b.rent_start_date).split('T')[0]} → {String(b.rent_end_date).split('T')[0]}</td>
                <td className="py-3 font-medium text-gray-800 dark:text-white">${b.total_price}</td>
                <td className="py-3"><Badge status={b.status}/></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}
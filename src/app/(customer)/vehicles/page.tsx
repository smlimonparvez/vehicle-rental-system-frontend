'use client';
import { useEffect, useState } from 'react';
import { getVehiclesApi, createBookingApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Vehicle } from '@/types';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const TYPES = ['all','car','bike','van','SUV'];

export default function VehiclesPage() {
  const { user, token } = useAuth(); const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filtered, setFiltered] = useState<Vehicle[]>([]);
  const [loading, setLoading]   = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState<Vehicle|null>(null);
  const [dates, setDates]       = useState({ rent_start_date:'', rent_end_date:'' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { getVehiclesApi().then(r => { if(r.success){setVehicles(r.data||[]);setFiltered(r.data||[]);} }).finally(()=>setLoading(false)); },[]);
  useEffect(() => { setFiltered(typeFilter==='all'?vehicles:vehicles.filter(v=>v.type===typeFilter)); },[typeFilter,vehicles]);

  const calcDays = () => {
    if(!dates.rent_start_date||!dates.rent_end_date) return 0;
    const d=Math.ceil((new Date(dates.rent_end_date).getTime()-new Date(dates.rent_start_date).getTime())/86400000);
    return d>0?d:0;
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault(); if(!user||!token||!selected) return;
    if(calcDays()<=0){toast.error('End date must be after start date');return;}
    setSubmitting(true);
    try {
      const res=await createBookingApi({customer_id:user.id,vehicle_id:selected.id,...dates},token);
      if(res.success){toast.success('Booking created!');setSelected(null);setDates({rent_start_date:'',rent_end_date:''});const u=await getVehiclesApi();if(u.success)setVehicles(u.data||[]);}
      else toast.error(res.message||'Booking failed');
    } catch{toast.error('Something went wrong');}
    finally{setSubmitting(false);}
  };

  const onBookClick = (v: Vehicle) => {
    if(!user){toast.error('Please login to book');router.push('/login');return;}
    if(v.availability_status==='booked'){toast.error('Vehicle not available');return;}
    setSelected(v);
  };
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Available Vehicles</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Browse and book from our fleet</p>
      <div className="flex gap-2 mb-6 flex-wrap">
        {TYPES.map(t=><button key={t} onClick={()=>setTypeFilter(t)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${typeFilter===t?'bg-blue-600 text-white':'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300'}`}>{t}</button>)}
      </div>
      {loading?<div className="py-20 text-center text-gray-400">Loading vehicles...</div>:filtered.length===0?<div className="py-20 text-center text-gray-400">No vehicles found</div>:(
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(v=>(
            <div key={v.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div><h3 className="font-semibold text-gray-800 dark:text-white">{v.vehicle_name}</h3><p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-0.5">{v.type} · {v.registration_number}</p></div>
                <Badge status={v.availability_status} />
              </div>
              <p className="text-2xl font-bold text-blue-600">${v.daily_rent_price}<span className="text-sm font-normal text-gray-400">/day</span></p>
              <button onClick={()=>onBookClick(v)} disabled={v.availability_status==='booked'} className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {v.availability_status==='booked'?'Not Available':'Book Now'}
              </button>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={!!selected} onClose={()=>setSelected(null)} title={`Book — ${selected?.vehicle_name}`}>
        <form onSubmit={handleBook} className="flex flex-col gap-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label><input type="date" min={today} required value={dates.rent_start_date} onChange={e=>setDates({...dates,rent_start_date:e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label><input type="date" min={dates.rent_start_date||today} required value={dates.rent_end_date} onChange={e=>setDates({...dates,rent_end_date:e.target.value})} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
          {calcDays()>0&&<div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-sm"><div className="flex justify-between text-gray-600 dark:text-gray-400 mb-1"><span>Duration</span><span>{calcDays()} day(s)</span></div><div className="flex justify-between font-semibold text-gray-800 dark:text-white"><span>Total Price</span><span>${Number(selected!.daily_rent_price)*calcDays()}</span></div></div>}
          <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60">{submitting?'Booking...':'Confirm Booking'}</button>
        </form>
      </Modal>
    </div>
  );
}
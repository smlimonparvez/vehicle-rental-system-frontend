'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import { getVehiclesApi, createBookingApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Vehicle } from '@/types';
import { vehicleEmoji, vehicleGradient, toCurrency } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { VehicleCardSkeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const TYPES = ['all', 'car', 'bike', 'van', 'SUV'];

function VehicleImage({ vehicle }: { vehicle: Vehicle }) {
  const [imgError, setImgError] = useState(false);
  const showFallback = !vehicle.image_url || imgError;
  return (
    <div className={`h-48 flex items-center justify-center relative overflow-hidden ${showFallback ? `bg-gradient-to-br ${vehicleGradient(vehicle.type)}` : 'bg-gray-100 dark:bg-gray-700'}`}>
      {!showFallback ? (
        <img src={vehicle.image_url ?? ''} alt={vehicle.vehicle_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgError(true)} />
      ) : (
        <div className="text-8xl select-none filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
          {vehicleEmoji(vehicle.type)}
        </div>
      )}
      <div className="absolute top-3 right-3"><Badge status={vehicle.availability_status} /></div>
      <div className="absolute bottom-3 left-3">
        <span className="bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full capitalize">{vehicle.type}</span>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  const { user, token }           = useAuth();
  const router                    = useRouter();
  const [vehicles, setVehicles]   = useState<Vehicle[]>([]);
  const [filtered, setFiltered]   = useState<Vehicle[]>([]);
  const [loading, setLoading]     = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState<Vehicle | null>(null);
  const [dates, setDates]         = useState({ rent_start_date: '', rent_end_date: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchVehicles = async () => {
    const res = await getVehiclesApi();
    if (res.success) { setVehicles(res.data || []); setFiltered(res.data || []); }
    setLoading(false);
  };

  useEffect(() => { fetchVehicles(); }, []);

  useEffect(() => {
    let result = vehicles;
    if (typeFilter !== 'all') result = result.filter(v => v.type === typeFilter);
    if (search.trim()) result = result.filter(v => v.vehicle_name.toLowerCase().includes(search.toLowerCase()) || v.registration_number.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [typeFilter, search, vehicles]);

  const calcDays = () => {
    if (!dates.rent_start_date || !dates.rent_end_date) return 0;
    const d = Math.ceil((new Date(dates.rent_end_date).getTime() - new Date(dates.rent_start_date).getTime()) / 86400000);
    return d > 0 ? d : 0;
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token || !selected) return;
    if (calcDays() <= 0) { toast.error('End date must be after start date'); return; }
    setSubmitting(true);
    try {
      const res = await createBookingApi({ customer_id: user.id, vehicle_id: selected.id, ...dates }, token);
      if (res.success) {
        toast.success('Booking created!');
        setSelected(null);
        setDates({ rent_start_date: '', rent_end_date: '' });
        fetchVehicles();
      } else { toast.error(res.message || 'Booking failed'); }
    } catch { toast.error('Something went wrong'); }
    finally { setSubmitting(false); }
  };

  const onBookClick = (v: Vehicle) => {
    if (!user) { toast.error('Please login to book'); router.push('/login'); return; }
    if (v.availability_status === 'booked') { toast.error('Vehicle not available'); return; }
    setSelected(v);
  };

  const today    = new Date().toISOString().split('T')[0];
  const available = filtered.filter(v => v.availability_status === 'available').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">Browse Vehicles</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {loading ? 'Loading...' : `${available} vehicle${available !== 1 ? 's' : ''} available out of ${filtered.length}`}
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or registration..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPES.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${typeFilter === t ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300'}`}>
              {t === 'all' ? 'All' : `${vehicleEmoji(t)} ${t}`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No vehicles match your search</p>
          <button onClick={() => { setSearch(''); setTypeFilter('all'); }} className="mt-4 text-blue-600 hover:underline text-sm">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(v => (
            <div key={v.id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <VehicleImage vehicle={v} />
              <div className="p-5">
                <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">{v.vehicle_name}</h3>
                <p className="text-sm text-gray-400 mb-4">{v.registration_number}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">{toCurrency(v.daily_rent_price)}</span>
                    <span className="text-xs text-gray-400 ml-1">/day</span>
                  </div>
                  <Link href={`/vehicles/${v.id}`}
                    className="text-xs text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors group/link">
                    Details <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <button
                  onClick={() => onBookClick(v)}
                  disabled={v.availability_status === 'booked'}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {v.availability_status === 'booked' ? 'Not Available' : 'Book Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Book — ${selected?.vehicle_name}`}>
        <form onSubmit={handleBook} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Start Date</label>
            <input type="date" min={today} required value={dates.rent_start_date}
              onChange={e => setDates({ ...dates, rent_start_date: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">End Date</label>
            <input type="date" min={dates.rent_start_date || today} required value={dates.rent_end_date}
              onChange={e => setDates({ ...dates, rent_end_date: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {calcDays() > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Daily rate</span><span>{toCurrency(selected?.daily_rent_price ?? 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Duration</span><span>{calcDays()} day(s)</span>
              </div>
              <div className="border-t border-blue-200 dark:border-blue-700 pt-1.5 flex justify-between font-bold text-gray-900 dark:text-white text-lg">
                <span>Total</span>
                <span className="text-blue-600">{toCurrency(parseFloat(String(selected?.daily_rent_price ?? 0)) * calcDays())}</span>
              </div>
            </div>
          )}
          <button type="submit" disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60">
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tag, Hash, Clock, Calendar, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getVehicleByIdApi, createBookingApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Vehicle } from '@/types';
import { vehicleEmoji, vehicleGradient, toCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

function VehicleImage({ vehicle }: { vehicle: Vehicle }) {
  const [imgError, setImgError] = useState(false);
  const showFallback = !vehicle.image_url || imgError;
  const imageSrc = vehicle.image_url ?? '';
  return (
    <div className={`h-80 rounded-2xl overflow-hidden flex items-center justify-center relative ${showFallback ? `bg-gradient-to-br ${vehicleGradient(vehicle.type)}` : 'bg-gray-100 dark:bg-gray-800'}`}>
      {!showFallback ? (
        <img src={imageSrc} alt={vehicle.vehicle_name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
      ) : (
        <div className="text-[120px] select-none filter drop-shadow-lg animate-float">{vehicleEmoji(vehicle.type)}</div>
      )}
      <div className="absolute top-4 right-4"><Badge status={vehicle.availability_status} /></div>
      <div className="absolute bottom-4 left-4">
        <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full capitalize">{vehicle.type}</span>
      </div>
    </div>
  );
}

export default function VehicleDetailPage() {
  const { id }           = useParams<{ id: string }>();
  const { user, token }  = useAuth();
  const router           = useRouter();
  const [vehicle, setVehicle]         = useState<Vehicle | null>(null);
  const [loading, setLoading]         = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [dates, setDates]             = useState({ rent_start_date: '', rent_end_date: '' });
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    if (!id) return;
    getVehicleByIdApi(parseInt(id))
      .then(res => { if (res.success) setVehicle(res.data ?? null); else toast.error('Vehicle not found'); })
      .finally(() => setLoading(false));
  }, [id]);

  const calcDays = () => {
    if (!dates.rent_start_date || !dates.rent_end_date) return 0;
    const d = Math.ceil((new Date(dates.rent_end_date).getTime() - new Date(dates.rent_start_date).getTime()) / 86400000);
    return d > 0 ? d : 0;
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token || !vehicle) return;
    if (calcDays() <= 0) { toast.error('End date must be after start date'); return; }
    setSubmitting(true);
    try {
      const res = await createBookingApi({ customer_id: user.id, vehicle_id: vehicle.id, ...dates }, token);
      if (res.success) { toast.success('Booking created!'); setBookingOpen(false); router.push('/my-bookings'); }
      else toast.error(res.message || 'Booking failed');
    } catch { toast.error('Something went wrong'); }
    finally { setSubmitting(false); }
  };

  const onBookClick = () => {
    if (!user) { toast.error('Please login to book'); router.push('/login'); return; }
    if (vehicle?.availability_status === 'booked') { toast.error('Vehicle not available'); return; }
    setBookingOpen(true);
  };

  const today      = new Date().toISOString().split('T')[0];
  const totalPrice = vehicle ? parseFloat(String(vehicle.daily_rent_price)) * calcDays() : 0;

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Skeleton className="h-5 w-32 mb-8" />
      <div className="grid md:grid-cols-2 gap-10">
        <Skeleton className="h-80 rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-9 w-3/4" /><Skeleton className="h-4 w-1/2" />
          <div className="grid grid-cols-2 gap-3 mt-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
          <Skeleton className="h-10 w-1/3 mt-4" /><Skeleton className="h-12 w-full mt-2" />
        </div>
      </div>
    </div>
  );

  if (!vehicle) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-7xl mb-4">🔍</p>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Vehicle Not Found</h2>
        <Link href="/vehicles" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors">Browse All Vehicles</Link>
      </div>
    </div>
  );

  const specs = [
    { icon: Tag,      label: 'Type',         value: vehicle.type },
    { icon: Hash,     label: 'Registration', value: vehicle.registration_number },
    { icon: Clock,    label: 'Status',       value: vehicle.availability_status },
    { icon: Calendar, label: 'Min. Booking', value: '1 day' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link href="/vehicles" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-8 group transition-colors">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Vehicles
      </Link>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <VehicleImage vehicle={vehicle} />
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold text-sm mb-2">
              <CheckCircle size={16} /> What's included
            </div>
            <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
              <li>✓ Full insurance coverage</li>
              <li>✓ Free cancellation before start date</li>
              <li>✓ 24/7 roadside assistance</li>
              <li>✓ No hidden fees</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">{vehicle.type}</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{vehicle.vehicle_name}</h1>
          <p className="text-gray-400 text-sm mb-6">{vehicle.registration_number}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon size={13} className="text-gray-400" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white capitalize">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-end gap-2 mb-8">
            <span className="text-5xl font-bold text-blue-600">{toCurrency(vehicle.daily_rent_price)}</span>
            <span className="text-gray-400 mb-2 text-lg">/day</span>
          </div>

          <button onClick={onBookClick} disabled={vehicle.availability_status === 'booked'}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
            {vehicle.availability_status === 'booked' ? '✗ Not Available' : '📅 Book This Vehicle'}
          </button>

          {vehicle.availability_status === 'available' && (
            <p className="text-center text-xs text-gray-400 mt-3">✓ Free cancellation · ✓ Instant confirmation</p>
          )}
        </div>
      </div>

      <Modal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} title={`Book — ${vehicle.vehicle_name}`}>
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
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span>Daily rate</span><span>{toCurrency(vehicle.daily_rent_price)}</span></div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span>Duration</span><span>{calcDays()} day(s)</span></div>
              <div className="border-t border-blue-200 dark:border-blue-700 pt-1.5 flex justify-between font-bold text-gray-900 dark:text-white text-lg">
                <span>Total</span><span className="text-blue-600">{toCurrency(totalPrice)}</span>
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
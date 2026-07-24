'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getVehiclesApi } from '@/lib/api';
import { Vehicle } from '@/types';
import { vehicleEmoji, vehicleGradient, toCurrency } from '@/lib/utils';
import { VehicleCardSkeleton } from '@/components/ui/Skeleton';

const TYPES = ['All', 'car', 'bike', 'van', 'SUV'];

export default function FeaturedVehicles() {
  const { ref, visible } = useScrollAnimation(0.1);
  const [vehicles, setVehicles]     = useState<Vehicle[]>([]);
  const [filtered, setFiltered]     = useState<Vehicle[]>([]);
  const [activeType, setActiveType] = useState('All');
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getVehiclesApi().then(r => {
      if (r.success) {
        const data: Vehicle[] = Array.isArray(r.data) ? r.data as Vehicle[] : [];
        setVehicles(data);
        setFiltered(data);
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFiltered(activeType === 'All' ? vehicles : vehicles.filter(v => v.type === activeType));
  }, [activeType, vehicles]);

  const display = filtered.slice(0, 6);

  return (
    <section ref={ref} className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className={`text-center mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Our Fleet</span>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
            Choose Your Perfect Ride
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            From compact cars to spacious SUVs — we have the right vehicle for every journey.
          </p>
          <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        {/* Filter tabs */}
        <div className={`flex justify-center gap-2 flex-wrap mb-10 transition-all duration-700 delay-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                activeType === t
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300'
              }`}
            >
              {t === 'All' ? '🚘 All' : `${vehicleEmoji(t)} ${t}`}
            </button>
          ))}
        </div>

        {/* Vehicle grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
          </div>
        ) : display.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No vehicles in this category</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {display.map((v, i) => (
              <div
                key={v.id}
                className={`group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Vehicle image area */}
                <div className={`h-44 bg-gradient-to-br ${vehicleGradient(v.type)} flex items-center justify-center relative overflow-hidden`}>
                  {/* use image instead of emoji; try common image fields and fallback to emoji if missing */}
                  {((v as any).image || (v as any).image_url) ? (
                    <img
                      src={(v as any).image || (v as any).image_url}
                      alt={v.vehicle_name}
                      className="max-h-full max-w-full group-hover:scale-105 transition-transform duration-500 select-none object-contain"
                    />
                  ) : (
                    <div className="text-8xl group-hover:scale-110 transition-transform duration-500 select-none filter drop-shadow-lg">
                      {vehicleEmoji(v.type)}
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      v.availability_status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {v.availability_status === 'available' ? '✓ Available' : '✗ Booked'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full capitalize border border-white/30">
                      {v.type}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">{v.vehicle_name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{v.registration_number}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{toCurrency(v.daily_rent_price)}</span>
                      <span className="text-xs text-gray-400 ml-1">/day</span>
                    </div>
                    <Link
                      href={`/vehicles/${v.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group/link"
                    >
                      Details <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all group"
          >
            View All Vehicles
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
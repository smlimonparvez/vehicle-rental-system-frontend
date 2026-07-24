'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Car, Users, MapPin, Star, ChevronDown } from 'lucide-react';

const STATS = [
  { value: 500,  suffix: '+', label: 'Vehicles',  icon: Car },
  { value: 10000,suffix: '+', label: 'Customers', icon: Users },
  { value: 50,   suffix: '+', label: 'Cities',    icon: MapPin },
  { value: 4.9,  suffix: '',  label: 'Rating',    icon: Star, decimal: true },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [counts, setCounts]   = useState(STATS.map(() => 0));

  useEffect(() => {
    setMounted(true);
    // Animate counters after mount
    const timers = STATS.map((s, i) => {
      const target = s.value;
      const steps  = 60;
      const inc    = target / steps;
      let cur      = 0;
      return setInterval(() => {
        cur += inc;
        if (cur >= target) {
          setCounts(prev => { const n=[...prev]; n[i]=target; return n; });
          clearInterval(timers[i]);
        } else {
          setCounts(prev => { const n=[...prev]; n[i]=s.decimal?parseFloat(cur.toFixed(1)):Math.floor(cur); return n; });
        }
      }, 25);
    });
    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 animate-gradient" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-300/10 rounded-full blur-2xl pointer-events-none" />

      {/* Spinning ring */}
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/10 animate-spin-slow pointer-events-none hidden lg:block" />
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-white/10 animate-spin-slow pointer-events-none hidden lg:block" style={{animationDirection:'reverse',animationDuration:'14s'}} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full grid lg:grid-cols-2 gap-16 items-center">

        {/* Left — Text */}
        <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Vehicles Available Now
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
            Rent Any
            <span className="block text-yellow-300 drop-shadow-md">Vehicle,</span>
            <span className="block">Anytime.</span>
          </h1>

          <p className="text-blue-100 text-lg leading-relaxed mb-10 max-w-lg">
            Browse cars, bikes, vans and SUVs. Instant booking, transparent pricing, no hidden fees. Your ride is just a click away.
          </p>

          <div className="flex gap-4 flex-wrap mb-14">
            <Link
              href="/vehicles"
              className="group flex items-center gap-2 bg-white text-blue-600 px-7 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 animate-pulse-glow"
            >
              Browse Vehicles
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 border-2 border-white/70 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-4 gap-3">
            {STATS.map(({ label, icon: Icon }, i) => (
              <div key={label} className={`text-center transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                <Icon size={16} className="text-blue-200 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">
                  {counts[i]}{STATS[i].suffix}
                </div>
                <div className="text-xs text-blue-200 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Car visual */}
        <div className={`flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-125 pointer-events-none" />

            {/* Main car */}
            <div className="relative w-[260px] h-[160px] sm:w-[300px] sm:h-[180px] select-none animate-float filter drop-shadow-2xl">
              <img
                src="camry-preview.png"
                alt="Car"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Floating badge 1 */}
            <div className="absolute -top-2 -right-6 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-2xl animate-bounce-soft border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400 font-medium">Starting from</p>
              <p className="text-xl font-bold text-blue-600">$15/day</p>
            </div>

            {/* Floating badge 2 */}
            <div className="absolute -bottom-4 -left-6 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-2xl animate-bounce-soft delay-500 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1.5">
                <div className="flex text-yellow-400 text-sm">★★★★★</div>
              </div>
              <p className="text-sm font-bold text-gray-800 dark:text-white">4.9 / 5.0 rating</p>
            </div>

            {/* Floating badge 3 */}
            <div className="absolute top-1/2 -left-12 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl px-3 py-2.5 shadow-2xl animate-bounce-soft delay-300 border border-gray-100 dark:border-gray-700 hidden sm:block">
              <p className="text-xs text-gray-400">Available</p>
              <p className="text-sm font-bold text-green-600">Now ✓</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 animate-bounce-soft">
        <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
        <ChevronDown size={18} />
      </div>
    </section>
  );
}
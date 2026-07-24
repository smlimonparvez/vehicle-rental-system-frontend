'use client';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const STEPS = [
  {
    step: '01',
    icon: '🔍',
    title: 'Browse & Choose',
    desc: 'Explore our fleet of cars, bikes, vans and SUVs. Filter by type and check real-time availability.',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-100 dark:border-blue-800',
  },
  {
    step: '02',
    icon: '📅',
    title: 'Pick Your Dates',
    desc: 'Select your rental start and end dates. Total price is calculated instantly — no surprises.',
    color: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-100 dark:border-indigo-800',
  },
  {
    step: '03',
    icon: '🚗',
    title: 'Enjoy Your Ride',
    desc: 'Your vehicle is confirmed and ready. Cancel anytime before your start date, hassle free.',
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-100 dark:border-purple-800',
  },
];

export default function HowItWorks() {
  const { ref, visible } = useScrollAnimation(0.15);

  return (
    <section ref={ref} className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Simple Process</span>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Get on the road in three easy steps. No paperwork, no waiting.
          </p>
          <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting dashed line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 border-t-2 border-dashed border-blue-200 dark:border-blue-800 z-0" />

          {STEPS.map(({ step, icon, title, desc, color, bg, border }, i) => (
            <div
              key={step}
              className={`relative z-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div className={`${bg} border ${border} rounded-3xl p-8 h-full hover:shadow-lg transition-shadow`}>
                {/* Step number + icon */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-lg`}>
                    {icon}
                  </div>
                  <span className="text-5xl font-black text-gray-100 dark:text-gray-800 select-none">{step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
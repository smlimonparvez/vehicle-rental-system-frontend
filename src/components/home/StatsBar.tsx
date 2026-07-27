'use client';
import { useScrollAnimation, useCountUp } from '@/hooks/useScrollAnimation';

const STATS = [
  { target: 500,  suffix: '+', label: 'Vehicles Available', icon: '🚗' },
  { target: 50,   suffix: '+', label: 'Cities Covered',     icon: '🌎' },
  { target: 10000,suffix: '+', label: 'Happy Customers',    icon: '😊' },
  { target: 5,    suffix: '+',  label: 'Years of Service',   icon: '🏆' },
];

function StatItem({ target, suffix, label, icon, active }: { target:number; suffix:string; label:string; icon:string; active:boolean }) {
  const count = useCountUp(target, 1800, active);
  return (
    <div className="flex flex-col items-center text-center px-6 py-2">
      <span className="text-4xl mb-2">{icon}</span>
      <span className="text-4xl font-bold text-white">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-gray-400 text-sm mt-1 font-medium">{label}</span>
    </div>
  );
}

export default function StatsBar() {
  const { ref, visible } = useScrollAnimation(0.2);

  return (
    <section ref={ref} className="bg-gray-900 dark:bg-black py-14 border-y border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 divide-x divide-gray-800 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {STATS.map((s, i) => (
            <div key={s.label} className="transition-all" style={{ transitionDelay: `${i * 150}ms` }}>
              <StatItem {...s} active={visible} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
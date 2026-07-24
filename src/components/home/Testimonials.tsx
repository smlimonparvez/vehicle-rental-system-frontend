'use client';
import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
  { name: 'Sarah Johnson',  role: 'Business Traveller', rating: 5, text: 'Incredibly smooth experience from start to finish. Booked a Toyota Camry for a work trip and it was spotless and ready on time. Will definitely use again.', initial: 'S', color: 'bg-blue-500' },
  { name: 'Ahmed Hassan',   role: 'Weekend Tripper',    rating: 5, text: 'The booking process took literally two minutes. Great prices, no hidden fees, and the cancellation policy is very fair. Rented an SUV for a family road trip — loved it.', initial: 'A', color: 'bg-purple-500' },
  { name: 'Priya Sharma',   role: 'Daily Commuter',     rating: 5, text: 'I rent a bike every week for my commute and the process gets easier each time. Customer support was super helpful when I needed to extend my booking.', initial: 'P', color: 'bg-green-500' },
  { name: 'Marcus Lee',     role: 'Photographer',       rating: 5, text: 'Needed a van for a photography shoot and it was perfect. Plenty of space, great price per day, and I love that I could cancel for free before the start date.', initial: 'M', color: 'bg-orange-500' },
  { name: 'Fatima Al-Zahra',role: 'Travel Blogger',     rating: 5, text: 'Rented cars in 4 different cities through VehicleRental and the experience was consistent every time. Transparent pricing and a huge selection of vehicles.', initial: 'F', color: 'bg-red-500' },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-yellow-400 text-sm">
      {Array.from({ length: count }).map((_, i) => <span key={i}>★</span>)}
    </div>
  );
}

export default function Testimonials() {
  const { ref, visible } = useScrollAnimation(0.1);
  const [active, setActive] = useState(0);

  const prev = () => setActive(a => (a === 0 ? REVIEWS.length - 3 : a - 1));
  const next = () => setActive(a => (a >= REVIEWS.length - 3 ? 0 : a + 1));
  const visible3 = REVIEWS.slice(active, active + 3);

  return (
    <section ref={ref} className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className={`text-center mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Customer Stories</span>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Real reviews from real renters. We are proud of the experience we deliver every day.
          </p>
          <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        {/* Cards */}
        <div className={`grid md:grid-cols-3 gap-6 mb-10 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {visible3.map(({ name, role, rating, text, initial, color }, i) => (
            <div
              key={name}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-7 border border-gray-100 dark:border-gray-700 flex flex-col gap-4 hover:shadow-lg transition-shadow"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Quote */}
              <div className="text-4xl text-blue-200 dark:text-blue-800 font-serif leading-none">"</div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1">
                {text}
              </p>
              <Stars count={rating} />
              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className={`w-10 h-10 rounded-full ${color} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                  {initial}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">{name}</p>
                  <p className="text-xs text-gray-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-3">
          <button onClick={prev} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: REVIEWS.length - 2 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === active ? 'bg-blue-600 w-6' : 'bg-gray-300 dark:bg-gray-600'}`}
            />
          ))}
          <button onClick={next} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
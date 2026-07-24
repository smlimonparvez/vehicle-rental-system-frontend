'use client';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const FEATURES = [
  { icon: '💰', title: 'Transparent Pricing',     desc: 'Daily rate × days — that is your total. No hidden fees, no fuel surcharges, no surprises at checkout.', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { icon: '🚘', title: 'Wide Vehicle Selection',  desc: 'Cars, bikes, vans, and SUVs to fit every trip. Weekend getaway, business travel, or daily commute.', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { icon: '↩️', title: 'Easy Cancellation',       desc: 'Life happens. Cancel your booking before the start date at no charge — your plans are always flexible.', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  { icon: '🔒', title: 'Secure & Trusted',        desc: 'JWT-secured accounts, encrypted data, and a verified fleet. Your safety and privacy are our top priority.', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  { icon: '⚡', title: 'Instant Booking',         desc: 'No phone calls, no waiting. Choose your vehicle, select dates, and confirm your booking in under a minute.', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
  { icon: '📞', title: '24/7 Support',            desc: 'Questions before or during your rental? Our support team is available around the clock to help you.', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
];

export default function WhyUs() {
  const { ref, visible } = useScrollAnimation(0.1);

  return (
    <section ref={ref} className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Our Advantages</span>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
            Why Choose VehicleRental?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            We have built a rental experience that is fast, fair, and flexible — designed around your needs.
          </p>
          <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, desc, color }, i) => (
            <div
              key={title}
              className={`group bg-white dark:bg-gray-800 rounded-2xl p-7 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2">{title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
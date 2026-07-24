'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function CTABanner() {
  const { ref, visible } = useScrollAnimation(0.2);

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 animate-gradient" />

      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div
        ref={ref}
        className={`relative z-10 max-w-4xl mx-auto px-6 text-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
          Limited Time — Free Registration
        </div>

        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
          Ready to Hit the Road?
        </h2>

        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Join thousands of happy renters. Create your free account today and get access to our full fleet instantly.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/register"
            className="group flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-lg"
          >
            Create Free Account
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/vehicles"
            className="flex items-center justify-center gap-2 border-2 border-white/70 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm text-lg"
          >
            Browse Vehicles
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-8 mt-12 flex-wrap">
          {['✓ Free Registration', '✓ No Hidden Fees', '✓ Cancel Anytime'].map(t => (
            <span key={t} className="text-blue-100 text-sm font-medium">{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
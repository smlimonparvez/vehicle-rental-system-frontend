import Hero            from '@/components/home/Hero';
import StatsBar        from '@/components/home/StatsBar';
import FeaturedVehicles from '@/components/home/FeaturedVehicles';
import HowItWorks      from '@/components/home/HowItWorks';
import WhyUs           from '@/components/home/WhyUs';
import Testimonials    from '@/components/home/Testimonials';
import CTABanner       from '@/components/home/CTABanner';
import Navbar          from '@/components/layout/Navbar';
import Footer          from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <Hero />
      <StatsBar />
      <FeaturedVehicles />
      <HowItWorks />
      <WhyUs />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  );
}
import Link from 'next/link';
import { Car, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const QUICK_LINKS = [
  { href: '/',          label: 'Home' },
  { href: '/vehicles',  label: 'Browse Vehicles' },
  { href: '/about',     label: 'About Us' },
  { href: '/contact',   label: 'Contact' },
  { href: '/login',     label: 'Sign In' },
  { href: '/register',  label: 'Create Account' },
];

const VEHICLE_TYPES = [
  { href: '/vehicles?type=car',  label: '🚗 Cars' },
  { href: '/vehicles?type=bike', label: '🏍️ Bikes' },
  { href: '/vehicles?type=van',  label: '🚐 Vans' },
  { href: '/vehicles?type=SUV',  label: '🚙 SUVs' },
];

const SOCIALS = [
  { Icon: FaFacebookF,   href: '#', label: 'Facebook' },
  { Icon: FaTwitter,     href: '#', label: 'Twitter' },
  { Icon: FaInstagram,  href: '#', label: 'Instagram' },
  { Icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Col 1 — Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car size={18} />
            </div>
            VehicleRental
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Your trusted partner for affordable, flexible vehicle rentals. Cars, bikes, vans and SUVs — ready when you are.
          </p>
          {/* Socials */}
          <div className="flex gap-3">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 — Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-3">
            {QUICK_LINKS.map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Vehicle Types */}
        <div>
          <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Vehicle Types</h3>
          <ul className="space-y-3">
            {VEHICLE_TYPES.map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mini stat */}
          <div className="mt-8 bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-xs text-gray-500 mb-1">Fleet size</p>
            <p className="text-2xl font-bold text-white">500+ <span className="text-xs font-normal text-gray-400">vehicles</span></p>
            <div className="flex gap-1 mt-2">
              {['bg-blue-500','bg-green-500','bg-orange-500','bg-purple-500'].map(c => (
                <div key={c} className={`h-1 flex-1 ${c} rounded-full`} />
              ))}
            </div>
          </div>
        </div>

        {/* Col 4 — Contact */}
        <div>
          <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-gray-400">
              <MapPin size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <span>123 Rental Street, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Phone size={16} className="text-blue-500 flex-shrink-0" />
              <span>+880 1712-345678</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Mail size={16} className="text-blue-500 flex-shrink-0" />
              <span>support@vehiclerental.com</span>
            </li>
          </ul>

          {/* Hours */}
          <div className="mt-6 bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Business Hours</p>
            <p className="text-sm text-gray-300">Mon – Fri: 9AM – 7PM</p>
            <p className="text-sm text-gray-300">Sat – Sun: 10AM – 5PM</p>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Support online now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} VehicleRental. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-blue-400 transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
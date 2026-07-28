import { Car, Users, MapPin, Award, Target, Heart } from 'lucide-react';

const TEAM = [
  { name: 'Rafiq Ahmed',    role: 'CEO & Founder',    initial: 'R', color: 'bg-blue-600' },
  { name: 'Nadia Islam',    role: 'Head of Fleet',    initial: 'N', color: 'bg-purple-600' },
  { name: 'Karim Hossain', role: 'Lead Developer',   initial: 'K', color: 'bg-green-600' },
  { name: 'Suma Begum',    role: 'Customer Support', initial: 'S', color: 'bg-orange-600' },
];

const VALUES = [
  { icon: Target, title: 'Our Mission',  desc: 'To make vehicle rental simple, affordable and accessible for everyone across Bangladesh and beyond.', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { icon: Heart,  title: 'Our Values',   desc: 'Transparency, reliability, and customer-first thinking drive every decision we make.', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
  { icon: Award,  title: 'Our Promise',  desc: 'No hidden fees, flexible cancellation, and a well-maintained fleet — guaranteed every time.', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-24 text-center px-6">
        <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-white/30">About VehicleRental</span>
        <h1 className="text-5xl font-bold text-white mb-4">Driving Your Journey Forward</h1>
        <p className="text-blue-100 max-w-xl mx-auto text-lg">We are a team passionate about making vehicle rental effortless, fair, and accessible for everyone.</p>
      </section>

      <section className="bg-gray-900 py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{icon:Car,v:'500+',l:'Vehicles'},{icon:Users,v:'10K+',l:'Customers'},{icon:MapPin,v:'50+',l:'Cities'},{icon:Award,v:'5yrs',l:'Experience'}].map(({icon:Icon,v,l})=>(
            <div key={l}>
              <Icon size={22} className="text-blue-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{v}</p>
              <p className="text-gray-400 text-sm">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">VehicleRental was founded with a simple idea: renting a vehicle should be as easy as booking a table at a restaurant. No phone calls, no paperwork — just a few clicks and you are on your way.</p>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">Since 2019, we have grown from a small fleet of 20 cars to over 500 vehicles across 50 cities. We remain committed to our founding principle of transparent, fair, and flexible rentals.</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map(({icon:Icon,title,desc,color})=>(
              <div key={title} className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}><Icon size={22}/></div>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(({name,role,initial,color})=>(
              <div key={name} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4`}>{initial}</div>
                <p className="font-semibold text-gray-800 dark:text-white">{name}</p>
                <p className="text-sm text-gray-400 mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
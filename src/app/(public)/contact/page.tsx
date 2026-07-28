'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const INFO = [
  { icon: MapPin, title: 'Address',        value: '123 Rental Street, Dhaka, Bangladesh' },
  { icon: Phone,  title: 'Phone',          value: '+880 1712-345678' },
  { icon: Mail,   title: 'Email',          value: 'support@vehiclerental.com' },
  { icon: Clock,  title: 'Business Hours', value: 'Mon–Fri 9AM–7PM, Sat–Sun 10AM–5PM' },
];

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  const inp = 'w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-400 transition-all';

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-24 text-center px-6">
        <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-white/30">Get in Touch</span>
        <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-blue-100 max-w-lg mx-auto text-lg">Have a question or need help with your booking? Our support team is ready to assist you.</p>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Contact Information</h2>
            <div className="flex flex-col gap-5 mb-10">
              {INFO.map(({icon:Icon,title,value})=>(
                <div key={title} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0"><Icon size={18} className="text-blue-600"/></div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{title}</p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl h-52 flex items-center justify-center border border-blue-200 dark:border-gray-600">
              <div className="text-center"><div className="text-5xl mb-2">📍</div><p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Dhaka, Bangladesh</p></div>
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="John Doe" required className={inp}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="john@example.com" required className={inp}/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                  <input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="How can we help?" required className={inp}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                  <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Write your message here..." required rows={5} className={`${inp} resize-none`}/>
                </div>
                <button type="submit" disabled={sending}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 mt-2">
                  <Send size={16}/>{sending?'Sending...':'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
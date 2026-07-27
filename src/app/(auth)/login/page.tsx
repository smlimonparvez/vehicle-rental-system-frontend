'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Car } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const DEMO = [
  { label: 'Admin',    email: 'admin@vehiclerental.com', password: 'admin123',    cls: 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
  { label: 'Customer', email: 'sayan@vehiclerental.com',        password: 'Sayan123', cls: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
];
const inp = 'w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400';

export default function LoginPage() {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await loginApi(form);
      if (res.success && res.data) { login(res.data.token, res.data.user); toast.success('Login successful!'); router.push(res.data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard'); }
      else toast.error(res.message || 'Login failed');
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };
  const fillDemo = (email: string, password: string) => { setForm({ email, password }); toast.success('Demo credentials filled!', { icon: '✨' }); };

  return (
    <div className="w-full max-w-md mx-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-6">
          <Link href="/"><div className="flex items-center justify-center gap-2 text-blue-600 font-bold text-xl mb-2"><Car size={24} /> VehicleRental</div></Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">🚀 Try a demo account</p>
          <div className="flex gap-2">
            {DEMO.map(({ label, email, password, cls }) => (
              <button key={label} type="button" onClick={() => fillDemo(email, password)} className={`flex-1 border rounded-xl px-3 py-2.5 text-left transition-colors ${cls}`}>
                <p className="text-xs font-semibold">{label}</p>
                <p className="text-xs opacity-70 truncate mt-0.5">{email}</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">Click a demo account to auto-fill credentials</p>
        </div>

        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
          <div className="relative flex justify-center"><span className="bg-white dark:bg-gray-800 px-3 text-xs text-gray-400">or sign in manually</span></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" placeholder="john@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className={inp} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account? <Link href="/register" className="text-blue-600 hover:underline font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
}
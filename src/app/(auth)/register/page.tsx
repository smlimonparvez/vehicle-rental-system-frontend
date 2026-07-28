'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Car, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerApi } from '@/lib/api';

const inp = 'w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export default function RegisterPage() {
  const [form, setForm]               = useState({ name: '', email: '', password: '', phone: '', role: 'customer' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const router                        = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await registerApi(form);
      if (res.success) { toast.success('Account created! Please sign in.'); router.push('/login'); }
      else toast.error(res.message || 'Registration failed');
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full max-w-md mx-4 my-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-8">
          <Link href="/"><div className="flex items-center justify-center gap-2 text-blue-600 font-bold text-xl mb-2"><Car size={24} /> VehicleRental</div></Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Start renting vehicles today</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              placeholder="John Doe" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required className={inp}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email" placeholder="john@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required className={inp}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
            <input
              placeholder="01712345678" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required className={inp}
            />
          </div>

          {/* Password with eye icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                className={`${inp} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Type</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className={`${inp} bg-white dark:bg-gray-700`}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
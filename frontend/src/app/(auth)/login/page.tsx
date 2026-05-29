'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('priya@example.com');
  const [password, setPassword] = useState('password123');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      toast.success('Logged in successfully!');
      if (user.role === 'authority') {
        router.push('/authority');
      } else {
        router.push('/citizen');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-xl w-full max-w-md z-10"
      >
        {/* Back to Home Button */}
        <Link 
          href="/" 
          className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant hover:text-cyan-accent transition-colors font-mono text-sm z-20 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight">ROADWATCH</h1>
          </Link>
          <p className="text-on-surface-variant mt-2 font-mono text-sm">Secure Access Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-mono text-on-surface-variant mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container border-b-2 border-surface-bright focus:border-cyan-accent text-on-surface p-3 outline-none transition-colors font-mono"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-mono text-on-surface-variant mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container border-b-2 border-surface-bright focus:border-cyan-accent text-on-surface p-3 outline-none transition-colors font-mono"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00ffff] text-black font-bold py-3 rounded shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-on-surface-variant text-sm">
            Demo Accounts:<br/>
            Citizen: priya@example.com / password123<br/>
            Authority: admin@roadwatch.com / password123
          </p>
        </div>
      </motion.div>
    </div>
  );
}

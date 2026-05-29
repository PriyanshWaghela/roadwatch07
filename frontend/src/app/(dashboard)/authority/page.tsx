'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { complaintsAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { AlertOctagon, Wrench, CheckCircle, Clock, Map as MapIcon, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AuthorityDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ 
    total: 1245, 
    critical: 18, 
    pending: 452, 
    completed: 793,
    avgTime: 4.2,
    healthIndex: 68
  });
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await complaintsAPI.list();
        setComplaints(response.complaints || []);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    
    if (user) fetchData();
  }, [user]);

  const trendData = [
    { month: 'Jan', complaints: 65, resolved: 40 },
    { month: 'Feb', complaints: 85, resolved: 55 },
    { month: 'Mar', complaints: 73, resolved: 60 },
    { month: 'Apr', complaints: 120, resolved: 90 },
    { month: 'May', complaints: 95, resolved: 85 },
    { month: 'Jun', complaints: 140, resolved: 110 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-on-surface tracking-tight">Authority Command Center</h1>
          <p className="text-on-surface-variant font-mono text-sm mt-1">Welcome back, {user?.name} — City Region 4</p>
        </div>
        <button className="hidden sm:flex bg-surface-bright text-on-surface border border-white/10 px-4 py-2 rounded-lg font-mono text-sm items-center gap-2 hover:bg-surface-container transition-colors">
          <TrendingUp size={16} className="text-cyan-accent" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm font-mono text-on-surface-variant mb-1">Total Reports</div>
            <div className="text-3xl font-data-metric text-on-surface font-bold">{stats.total}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"><TrendingUp size={24} /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-xl flex items-center justify-between border border-error/20 shadow-bloom-error relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-error/10 blur-[30px] rounded-full"></div>
          <div>
            <div className="text-sm font-mono text-error mb-1">Critical Issues</div>
            <div className="text-3xl font-data-metric text-error font-bold">{stats.critical}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center text-error animate-pulse"><AlertOctagon size={24} /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm font-mono text-on-surface-variant mb-1">Pending Repairs</div>
            <div className="text-3xl font-data-metric text-tertiary font-bold">{stats.pending}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary"><Wrench size={24} /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm font-mono text-on-surface-variant mb-1">Completed</div>
            <div className="text-3xl font-data-metric text-secondary font-bold">{stats.completed}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary"><CheckCircle size={24} /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm font-mono text-on-surface-variant mb-1">Avg Resolution (Days)</div>
            <div className="text-3xl font-data-metric text-[#00ffff] font-bold">{stats.avgTime}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-cyan-accent/10 flex items-center justify-center text-[#00ffff]"><Clock size={24} /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm font-mono text-on-surface-variant mb-1">Road Health Index</div>
            <div className="text-3xl font-data-metric text-on-surface font-bold">{stats.healthIndex}/100</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center text-on-surface"><MapIcon size={24} /></div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6 rounded-xl">
          <h2 className="text-lg font-display font-semibold text-on-surface mb-6">Complaint Volume vs Resolution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ffff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#40e56c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#40e56c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#292a2c" vertical={false} />
                <XAxis dataKey="month" stroke="#8e9198" tick={{ fill: '#8e9198', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                <YAxis stroke="#8e9198" tick={{ fill: '#8e9198', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1f2022', borderColor: '#38393b', borderRadius: '8px', color: '#e3e2e5', fontFamily: 'var(--font-mono)' }}
                />
                <Area type="monotone" dataKey="complaints" stroke="#00ffff" strokeWidth={2} fillOpacity={1} fill="url(#colorComplaints)" />
                <Area type="monotone" dataKey="resolved" stroke="#40e56c" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Live Heatmap Preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-6 rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-display font-semibold text-on-surface">Live Heatmap Preview</h2>
            <span className="flex items-center gap-2 text-xs font-mono text-error">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
              LIVE UPDATES
            </span>
          </div>
          <div className="flex-1 rounded-lg border border-white/5 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b')] bg-cover bg-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-surface/80 group-hover:bg-surface/60 transition-colors duration-500"></div>
            
            {/* Fake heatmap spots */}
            <div className="absolute top-[30%] left-[40%] w-32 h-32 bg-error/40 blur-[20px] rounded-full"></div>
            <div className="absolute top-[60%] left-[70%] w-24 h-24 bg-tertiary/40 blur-[20px] rounded-full"></div>
            <div className="absolute top-[20%] left-[80%] w-16 h-16 bg-error/30 blur-[15px] rounded-full"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-surface/90 backdrop-blur-md text-cyan-accent border border-cyan-accent/30 px-6 py-3 rounded-xl font-mono text-sm tracking-widest uppercase hover:bg-cyan-accent hover:text-black transition-colors shadow-bloom-cyan">
                Open Full GIS Map
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

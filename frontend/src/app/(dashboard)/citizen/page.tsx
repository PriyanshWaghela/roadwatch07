'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { complaintsAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { AlertTriangle, FileText, CheckCircle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await complaintsAPI.my();
        setComplaints(response.complaints || []);
        
        // Calculate mock stats from data
        const total = (response.complaints || []).length;
        const resolved = (response.complaints || []).filter((c: any) => c.status === 'resolved').length;
        const pending = total - resolved;
        setStats({ total, pending, resolved });
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) fetchData();
  }, [user]);

  const pieData = [
    { name: 'Pending', value: stats.pending, color: '#eebd90' },
    { name: 'Resolved', value: stats.resolved, color: '#40e56c' },
  ];

  if (isLoading) return <div className="p-8 text-on-surface-variant font-mono">Loading telemetry...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-on-surface tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-on-surface-variant font-mono text-sm mt-1">Here is your civic intelligence overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-surface-bright rounded-lg text-primary"><FileText size={24} /></div>
            <div>
              <div className="text-sm font-mono text-on-surface-variant">Total Submissions</div>
              <div className="text-3xl font-data-metric text-on-surface font-bold">{stats.total}</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-tertiary/10 rounded-lg text-tertiary"><Clock size={24} /></div>
            <div>
              <div className="text-sm font-mono text-on-surface-variant">Pending Repairs</div>
              <div className="text-3xl font-data-metric text-tertiary font-bold">{stats.pending}</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-xl border border-secondary/20 shadow-bloom-emerald">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-lg text-secondary"><CheckCircle size={24} /></div>
            <div>
              <div className="text-sm font-mono text-on-surface-variant">Resolved Issues</div>
              <div className="text-3xl font-data-metric text-secondary font-bold">{stats.resolved}</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-xl lg:col-span-2">
          <h2 className="text-lg font-display font-semibold text-on-surface mb-4">Recent Submissions</h2>
          <div className="space-y-4">
            {complaints.length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant border border-dashed border-white/10 rounded-lg">
                No complaints submitted yet.
              </div>
            ) : (
              complaints.slice(0, 5).map((c: any) => (
                <div key={c._id} className="p-4 bg-surface-container rounded-lg flex items-center justify-between hover:bg-surface-bright transition-colors border border-white/5 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-surface-bright overflow-hidden">
                      {c.images && c.images.length > 0 ? (
                        <img src={c.images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant"><AlertTriangle size={20} /></div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">{c.title}</div>
                      <div className="text-xs font-mono text-on-surface-variant mt-1">{new Date(c.createdAt).toLocaleDateString()} • {c.location.address}</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                    c.status === 'resolved' ? 'bg-secondary/20 text-secondary' : 
                    c.status === 'in_progress' ? 'bg-tertiary/20 text-tertiary' : 
                    'bg-cyan-accent/20 text-[#00ffff]'
                  }`}>
                    {c.status.replace('_', ' ')}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-xl">
          <h2 className="text-lg font-display font-semibold text-on-surface mb-4">Status Distribution</h2>
          <div className="h-64">
            {stats.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2022', borderColor: '#38393b', borderRadius: '8px' }}
                    itemStyle={{ color: '#e3e2e5', fontFamily: 'var(--font-mono)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-on-surface-variant text-sm font-mono">Not enough data</div>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button className="w-full bg-[#00ffff] text-black font-bold py-2 rounded uppercase text-sm tracking-widest shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] transition-all">
              Submit New Report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

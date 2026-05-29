'use client';

import { useEffect, useState } from 'react';
import { analyticsAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<any[]>([]);
  const [severityDist, setSeverityDist] = useState<any>({});
  const [healthData, setHealthData] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendsData, severityData, health] = await Promise.all([
          analyticsAPI.trends(),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/analytics/severity-distribution`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('roadwatch_token')}` }
          }).then(res => res.json()),
          analyticsAPI.roadHealth()
        ]);
        
        setTrends(trendsData?.data || []);
        setSeverityDist(severityData?.data || { critical: 10, high: 20, medium: 40, low: 30 }); // Fallback
        setHealthData(health?.data || []);
      } catch (err) {
        console.error('Analytics fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const severityPieData = [
    { name: 'Critical', value: severityDist.critical || 10, color: '#ffb4ab' },
    { name: 'High', value: severityDist.high || 25, color: '#eebd90' },
    { name: 'Medium', value: severityDist.medium || 45, color: '#40e56c' },
    { name: 'Low', value: severityDist.low || 20, color: '#00ffff' },
  ];

  if (loading) return <div className="p-12 text-center text-on-surface-variant font-mono animate-pulse">Loading analytics engine...</div>;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-on-surface tracking-tight">Advanced Analytics</h1>
        <p className="text-on-surface-variant font-mono text-sm mt-1">AI-driven insights on city infrastructure health.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-xl">
          <h2 className="text-lg font-display font-semibold text-on-surface mb-6">Monthly Complaint Volume</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292a2c" vertical={false} />
                <XAxis dataKey="date" stroke="#8e9198" tick={{ fill: '#8e9198', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                <YAxis stroke="#8e9198" tick={{ fill: '#8e9198', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1f2022', borderColor: '#38393b', color: '#e3e2e5' }} />
                <Legend />
                <Line type="monotone" dataKey="complaints" stroke="#ffb4ab" strokeWidth={3} dot={{ fill: '#ffb4ab' }} />
                <Line type="monotone" dataKey="resolved" stroke="#40e56c" strokeWidth={3} dot={{ fill: '#40e56c' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Severity Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-xl">
          <h2 className="text-lg font-display font-semibold text-on-surface mb-6">Severity Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {severityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1f2022', borderColor: '#38393b', color: '#e3e2e5' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Area Health Scores */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-xl lg:col-span-2">
          <h2 className="text-lg font-display font-semibold text-on-surface mb-6">Road Health Index by Area</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292a2c" vertical={false} />
                <XAxis dataKey="area" stroke="#8e9198" tick={{ fill: '#8e9198', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                <YAxis domain={[0, 100]} stroke="#8e9198" tick={{ fill: '#8e9198', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1f2022', borderColor: '#38393b', color: '#e3e2e5' }} />
                <Bar dataKey="roadHealthScore" name="Health Score (0-100)" fill="#00ffff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

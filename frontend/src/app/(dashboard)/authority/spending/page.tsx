'use client';

import { useEffect, useState } from 'react';
import { spendingAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { IndianRupee, PieChart as PieChartIcon, Target, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function SpendingPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [spendingList, setSpendingList] = useState<any[]>([]);

  useEffect(() => {
    const fetchSpending = async () => {
      try {
        const [sum, listRes] = await Promise.all([
          spendingAPI.summary(),
          spendingAPI.list()
        ]);
        setSummary(sum);
        setSpendingList(listRes.spending || []);
      } catch (err) {
        console.error('Spending fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpending();
  }, []);

  if (loading) return <div className="p-12 text-center text-on-surface-variant font-mono animate-pulse">Loading financial transparency data...</div>;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-on-surface tracking-tight">Public Spending Transparency</h1>
        <p className="text-on-surface-variant font-mono text-sm mt-1">Track allocated budgets vs actual repairs.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm font-mono text-on-surface-variant mb-1">Total Allocated</div>
            <div className="text-2xl font-data-metric text-[#00ffff] font-bold">₹{(summary?.totalAllocated / 10000000).toFixed(2)}Cr</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-cyan-accent/10 flex items-center justify-center text-[#00ffff]"><Target size={24} /></div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm font-mono text-on-surface-variant mb-1">Total Released</div>
            <div className="text-2xl font-data-metric text-secondary font-bold">₹{(summary?.totalReleased / 10000000).toFixed(2)}Cr</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary"><PieChartIcon size={24} /></div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm font-mono text-on-surface-variant mb-1">Actual Spent</div>
            <div className="text-2xl font-data-metric text-tertiary font-bold">₹{(summary?.totalSpent / 10000000).toFixed(2)}Cr</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary"><IndianRupee size={24} /></div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-xl flex items-center justify-between border border-[#00ffff]/20 shadow-bloom-cyan">
          <div>
            <div className="text-sm font-mono text-[#00ffff] mb-1">Transparency Score</div>
            <div className="text-2xl font-data-metric text-[#00ffff] font-bold">{summary?.averageTransparencyScore?.toFixed(1) || 92}/100</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#00ffff]/20 flex items-center justify-center text-[#00ffff] animate-pulse"><TrendingUp size={24} /></div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-xl lg:col-span-2">
          <h2 className="text-lg font-display font-semibold text-on-surface mb-6">Budget Allocation vs Spent by Area</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingList.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292a2c" vertical={false} />
                <XAxis dataKey="area" stroke="#8e9198" tick={{ fill: '#8e9198', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                <YAxis stroke="#8e9198" tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} tick={{ fill: '#8e9198', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                  contentStyle={{ backgroundColor: '#1f2022', borderColor: '#38393b', color: '#e3e2e5' }}
                  formatter={(value: number) => [`₹${(value/100000).toFixed(2)} Lakhs`, '']}
                />
                <Legend />
                <Bar dataKey="allocatedBudget" name="Allocated" fill="#00ffff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spentBudget" name="Actual Spent" fill="#40e56c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Projects List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 rounded-xl lg:col-span-2">
          <h2 className="text-lg font-display font-semibold text-on-surface mb-6">Active Repair Contracts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container border-b border-white/10 text-xs font-mono text-on-surface-variant uppercase tracking-wider">
                  <th className="p-4">Area</th>
                  <th className="p-4">Fiscal Year</th>
                  <th className="p-4">Transparency</th>
                  <th className="p-4 text-right">Allocated</th>
                  <th className="p-4 text-right">Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {spendingList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-bright/50 transition-colors">
                    <td className="p-4 font-bold text-on-surface">{item.area}</td>
                    <td className="p-4 font-mono text-sm text-on-surface-variant">{item.fiscalYear}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-surface-container rounded-full h-2 max-w-[100px]">
                          <div className="bg-[#00ffff] h-2 rounded-full" style={{ width: `${item.transparencyScore}%` }}></div>
                        </div>
                        <span className="font-mono text-xs">{item.transparencyScore}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-cyan-accent">₹{(item.allocatedBudget/100000).toFixed(1)}L</td>
                    <td className="p-4 text-right font-mono text-secondary">₹{(item.spentBudget/100000).toFixed(1)}L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

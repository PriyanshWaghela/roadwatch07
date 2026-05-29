'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { IndianRupee, TrendingUp, Shield, PieChart } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const budgetCards = [
  {
    label: 'Allocated',
    value: 50,
    suffix: 'Cr',
    prefix: '₹',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    barColor: 'bg-primary',
    percent: 100,
  },
  {
    label: 'Released',
    value: 42,
    suffix: 'Cr',
    prefix: '₹',
    color: 'text-cyan-accent',
    bgColor: 'bg-cyan-accent/10',
    barColor: 'bg-cyan-accent',
    percent: 84,
  },
  {
    label: 'Spent',
    value: 38,
    suffix: 'Cr',
    prefix: '₹',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    barColor: 'bg-secondary',
    percent: 76,
  },
  {
    label: 'Remaining',
    value: 12,
    suffix: 'Cr',
    prefix: '₹',
    color: 'text-tertiary',
    bgColor: 'bg-tertiary/10',
    barColor: 'bg-tertiary',
    percent: 24,
  },
];

const areaSpendingData = [
  { area: 'Zone A', allocated: 12, spent: 9.5 },
  { area: 'Zone B', allocated: 10, spent: 8.2 },
  { area: 'Zone C', allocated: 8, spent: 7.1 },
  { area: 'Zone D', allocated: 7, spent: 5.4 },
  { area: 'Zone E', allocated: 6.5, spent: 4.8 },
  { area: 'Zone F', allocated: 6.5, spent: 3.0 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 !rounded-lg text-xs font-mono">
      <p className="text-on-surface font-semibold mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: ₹{entry.value}Cr
        </p>
      ))}
    </div>
  );
};

export default function SpendingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="spending"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-tertiary/3 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-tertiary/10 border border-tertiary/20 rounded-full mb-6">
            <IndianRupee className="w-3.5 h-3.5 text-tertiary" />
            <span className="text-xs font-mono text-tertiary tracking-wider uppercase">
              Financial Transparency
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-on-surface tracking-tight">
            Public Spending
            <br />
            <span className="text-gradient-warm">Tracker</span>
          </h2>
          <p className="mt-6 text-on-surface-variant font-mono text-sm sm:text-base max-w-2xl mx-auto">
            Every rupee tracked. Every project visible. Complete transparency in
            how public road infrastructure budgets are allocated and utilized.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Budget Cards — Left 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Budget Overview */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {budgetCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                >
                  <GlassCard padding="p-4" className="h-full">
                    <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest block mb-2">
                      {card.label}
                    </span>
                    <div className={`text-2xl font-display font-bold ${card.color}`}>
                      <AnimatedCounter
                        target={card.value}
                        prefix={card.prefix}
                        suffix={card.suffix}
                      />
                    </div>
                    <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${card.barColor}`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${card.percent}%` } : {}}
                        transition={{
                          delay: 0.5 + i * 0.1,
                          duration: 1,
                          ease: 'easeOut',
                        }}
                      />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Area-wise Spending Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <GlassCard padding="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-on-surface-variant" />
                    <span className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">
                      Area-wise Spending Breakdown
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Allocated
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      Spent
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={areaSpendingData} barGap={4}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(67,71,77,0.3)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="area"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: '#8e9198',
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: '#8e9198',
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                      }}
                      tickFormatter={(v: number) => `₹${v}Cr`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="allocated"
                      name="Allocated"
                      fill="#b0c8eb"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                    <Bar
                      dataKey="spent"
                      name="Spent"
                      fill="#40e56c"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>
          </div>

          {/* Right Column — Transparency Score + Stats */}
          <div className="space-y-6">
            {/* Transparency Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <GlassCard padding="p-6" className="text-center">
                <div className="flex items-center gap-2 justify-center mb-6">
                  <Shield className="w-4 h-4 text-secondary" />
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                    Transparency Score
                  </span>
                </div>
                {/* Circular Gauge */}
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="url(#transparencyGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                      animate={
                        isInView
                          ? {
                              strokeDashoffset:
                                2 * Math.PI * 50 * (1 - 85 / 100),
                            }
                          : {}
                      }
                      transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient
                        id="transparencyGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#40e56c" />
                        <stop offset="100%" stopColor="#00ffff" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-display font-bold text-on-surface">
                      <AnimatedCounter target={85} />
                    </span>
                    <span className="text-[10px] font-mono text-on-surface-variant">
                      / 100
                    </span>
                  </div>
                </div>
                <p className="text-xs font-mono text-on-surface-variant">
                  Based on budget utilization, project completion rate, and audit
                  compliance
                </p>
              </GlassCard>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <GlassCard padding="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                    Key Metrics
                  </span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Projects On Track', value: '87%', color: 'text-secondary' },
                    { label: 'Avg. Completion Time', value: '34 days', color: 'text-cyan-accent' },
                    { label: 'Cost Overrun', value: '8.2%', color: 'text-tertiary' },
                    { label: 'Audit Compliance', value: '92%', color: 'text-primary' },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs font-mono text-on-surface-variant">
                        {metric.label}
                      </span>
                      <span
                        className={`text-sm font-display font-semibold ${metric.color}`}
                      >
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

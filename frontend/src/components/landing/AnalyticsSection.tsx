'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import GlassCard from '@/components/ui/GlassCard';

const trendData = [
  { month: 'Jan', complaints: 120, resolved: 90 },
  { month: 'Feb', complaints: 145, resolved: 110 },
  { month: 'Mar', complaints: 132, resolved: 125 },
  { month: 'Apr', complaints: 168, resolved: 140 },
  { month: 'May', complaints: 155, resolved: 148 },
  { month: 'Jun', complaints: 180, resolved: 160 },
  { month: 'Jul', complaints: 195, resolved: 175 },
  { month: 'Aug', complaints: 172, resolved: 168 },
  { month: 'Sep', complaints: 160, resolved: 155 },
  { month: 'Oct', complaints: 148, resolved: 145 },
  { month: 'Nov', complaints: 135, resolved: 130 },
  { month: 'Dec', complaints: 125, resolved: 122 },
];

const roadHealthData = [
  { area: 'Andheri', score: 87 },
  { area: 'Bandra', score: 72 },
  { area: 'Dadar', score: 65 },
  { area: 'Kurla', score: 58 },
  { area: 'Thane', score: 81 },
  { area: 'Navi Mumbai', score: 90 },
  { area: 'Powai', score: 76 },
];

const severityData = [
  { name: 'Low', value: 35, color: '#40e56c' },
  { name: 'Medium', value: 30, color: '#00ffff' },
  { name: 'High', value: 25, color: '#eebd90' },
  { name: 'Critical', value: 10, color: '#ffb4ab' },
];

const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 !rounded-lg text-xs font-mono">
      <p className="text-on-surface font-semibold mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="analytics"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[350px] h-[350px] bg-secondary/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <BarChart3 className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-primary tracking-wider uppercase">
              Transparency Analytics
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-on-surface tracking-tight">
            Data-Driven
            <br />
            <span className="text-gradient-cyan">Infrastructure Insights</span>
          </h2>
          <p className="mt-6 text-on-surface-variant font-mono text-sm sm:text-base max-w-2xl mx-auto">
            Real-time analytics dashboards providing complete visibility into
            complaint trends, road health metrics, and resolution performance
            across all monitored areas.
          </p>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Complaint Trends — Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <GlassCard padding="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-accent" />
                  <span className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">
                    Complaint Trends — 2025
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-accent" />
                    Reported
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    Resolved
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ffff" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#40e56c" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#40e56c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(67,71,77,0.3)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
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
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="complaints"
                    name="Reported"
                    stroke="#00ffff"
                    strokeWidth={2}
                    fill="url(#cyanGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    name="Resolved"
                    stroke="#40e56c"
                    strokeWidth={2}
                    fill="url(#greenGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Road Health by Area — Horizontal Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <GlassCard padding="p-6" className="h-full">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-4 h-4 text-secondary" />
                <span className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">
                  Road Health by Area
                </span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={roadHealthData} layout="vertical" barSize={14}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(67,71,77,0.2)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#8e9198',
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <YAxis
                    type="category"
                    dataKey="area"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#c4c6ce',
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                    }}
                    width={90}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="score" name="Health Score" radius={[0, 6, 6, 0]}>
                    {roadHealthData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.score >= 80
                            ? '#40e56c'
                            : entry.score >= 60
                            ? '#00ffff'
                            : entry.score >= 40
                            ? '#eebd90'
                            : '#ffb4ab'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Severity Distribution — Donut Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            <GlassCard padding="p-6" className="h-full">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-4 h-4 text-tertiary" />
                <span className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">
                  Severity Distribution
                </span>
              </div>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload[0]) return null;
                        const data = payload[0].payload as { name: string; value: number; color: string };
                        return (
                          <div className="glass-card p-3 !rounded-lg text-xs font-mono">
                            <p style={{ color: data.color }}>
                              {data.name}: {data.value}%
                            </p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {severityData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-mono text-on-surface-variant">
                      {item.name}
                    </span>
                    <span
                      className="text-xs font-mono font-semibold ml-auto"
                      style={{ color: item.color }}
                    >
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

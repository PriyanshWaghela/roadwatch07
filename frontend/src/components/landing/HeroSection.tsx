'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';
import ParticleCanvas from './ParticleCanvas';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 grid-bg" />
      <ParticleCanvas />

      {/* Ambient Glow Circles */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-breathe pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-accent/5 rounded-full blur-[100px] animate-breathe pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-accent/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column — Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-8"
          >
            {/* Live Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 border border-secondary/20 rounded-full"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
              </span>
              <Satellite className="w-3.5 h-3.5 text-secondary" />
              <span className="text-xs font-mono text-secondary tracking-wider uppercase">
                Live Satellite Feed Active
              </span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight">
                <span className="text-on-surface">Infrastructure</span>
                <br />
                <span className="text-gradient-cyan">Intelligence</span>
                <br />
                <span className="text-on-surface">Platform</span>
              </h1>
              <p className="text-on-surface-variant text-base sm:text-lg font-mono leading-relaxed max-w-xl">
                Neural-powered road damage detection, real-time civic analytics,
                and public spending transparency — engineered for the cities of
                tomorrow.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-cyan-accent/15 to-secondary/10 border border-cyan-accent/30 rounded-xl text-cyan-accent font-mono text-sm font-medium hover:from-cyan-accent/25 hover:to-secondary/15 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)] transition-all duration-300"
              >
                <Activity className="w-4 h-4" />
                Launch Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => {
                  const el = document.querySelector('#solutions');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 border border-outline-variant rounded-xl text-on-surface-variant font-mono text-sm font-medium hover:border-outline hover:text-on-surface hover:bg-white/[0.02] transition-all duration-300"
              >
                Explore Platform
              </button>
            </motion.div>

            {/* Micro Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex gap-8 pt-4"
            >
              <div>
                <div className="text-2xl font-display font-bold text-on-surface">
                  <AnimatedCounter target={99.2} suffix="%" decimals={1} />
                </div>
                <div className="text-xs font-mono text-on-surface-variant mt-1">
                  Detection Accuracy
                </div>
              </div>
              <div className="w-px bg-outline-variant" />
              <div>
                <div className="text-2xl font-display font-bold text-on-surface">
                  <AnimatedCounter target={50} suffix="ms" />
                </div>
                <div className="text-xs font-mono text-on-surface-variant mt-1">
                  Analysis Speed
                </div>
              </div>
              <div className="w-px bg-outline-variant" />
              <div>
                <div className="text-2xl font-display font-bold text-on-surface">
                  <AnimatedCounter target={12} suffix="+" />
                </div>
                <div className="text-xs font-mono text-on-surface-variant mt-1">
                  Cities Live
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column — Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="relative hidden lg:block"
          >
            {/* Main Visual Container */}
            <div className="relative">
              {/* City Image Placeholder */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.06]">
                <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-container-lowest" />
                {/* Grid overlay */}
                <div className="absolute inset-0 grid-bg opacity-50" />
                {/* Scan line animation */}
                <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-accent/50 to-transparent animate-[scan-line_4s_linear_infinite]" />

                {/* Road network visualization */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 400 300"
                  fill="none"
                >
                  {/* Road lines */}
                  <path
                    d="M 50 150 Q 150 100 200 150 T 350 150"
                    stroke="rgba(0,255,255,0.15)"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    className="animate-[dash-flow_2s_linear_infinite]"
                  />
                  <path
                    d="M 200 30 Q 200 100 200 150 T 200 280"
                    stroke="rgba(64,229,108,0.12)"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    className="animate-[dash-flow_3s_linear_infinite]"
                  />
                  <path
                    d="M 80 50 Q 150 120 250 80 T 370 100"
                    stroke="rgba(147,51,234,0.1)"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    className="animate-[dash-flow_2.5s_linear_infinite]"
                  />
                  {/* AI nodes */}
                  {[
                    { cx: 120, cy: 130 },
                    { cx: 200, cy: 150 },
                    { cx: 280, cy: 120 },
                    { cx: 160, cy: 80 },
                    { cx: 300, cy: 200 },
                  ].map((node, i) => (
                    <g key={i}>
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="4"
                        fill="#00ffff"
                        opacity="0.8"
                        className="animate-flicker"
                        style={{ animationDelay: `${i * 0.5}s` }}
                      />
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="12"
                        fill="none"
                        stroke="#00ffff"
                        strokeWidth="0.5"
                        opacity="0.3"
                        className="animate-breathe"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                    </g>
                  ))}
                </svg>
              </div>

              {/* Floating Glass Card — City Health Score */}
              <motion.div
                className="absolute -top-4 -right-4 glass-card p-4 w-52"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                    City Health Score
                  </span>
                </div>
                <div className="text-3xl font-display font-bold text-secondary">
                  <AnimatedCounter target={92.4} decimals={1} suffix="%" />
                </div>
                <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-secondary to-cyan-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '92.4%' }}
                    transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>

              {/* Floating Glass Card — Budget Utilization */}
              <motion.div
                className="absolute -bottom-6 -left-6 glass-card p-4 w-56"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-tertiary rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                    Budget Utilization
                  </span>
                </div>
                <div className="text-2xl font-display font-bold text-tertiary">
                  <AnimatedCounter target={42.8} decimals={1} prefix="₹" suffix="Cr" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-tertiary to-error rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-xs font-mono text-on-surface-variant">78%</span>
                </div>
              </motion.div>

              {/* AI Processing Badge */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-card px-3 py-2"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-accent rounded-full" />
                  <span className="text-[10px] font-mono text-cyan-accent tracking-wider">
                    AI PROCESSING
                  </span>
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 bg-cyan-accent rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

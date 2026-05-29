'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Clock, EyeOff, AlertTriangle, Banknote } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const problems = [
  {
    icon: Clock,
    title: 'Delayed Repairs',
    description:
      'Average road repair takes 67 days from complaint to resolution. Citizens are left navigating dangerous infrastructure while bureaucratic processes stall.',
    stat: '67',
    statLabel: 'avg. days to repair',
    color: 'text-error',
    glowColor: 'rgba(255, 180, 171, 0.15)',
  },
  {
    icon: EyeOff,
    title: 'Lack of Transparency',
    description:
      'Zero visibility into how allocated road budgets are actually spent. Citizens have no way to track if their tax money reaches the intended projects.',
    stat: '0%',
    statLabel: 'public visibility',
    color: 'text-tertiary',
    glowColor: 'rgba(238, 189, 144, 0.15)',
  },
  {
    icon: AlertTriangle,
    title: 'Reactive Maintenance',
    description:
      'Infrastructure failures are only addressed after catastrophic damage. No predictive systems exist to prevent accidents before they happen.',
    stat: '94%',
    statLabel: 'complaints post-damage',
    color: 'text-cyan-accent',
    glowColor: 'rgba(0, 255, 255, 0.15)',
  },
  {
    icon: Banknote,
    title: 'Budget Leakage',
    description:
      'Estimated 30-40% of road maintenance budgets are lost to inefficiency, corruption, and misallocation without any accountability framework.',
    stat: '₹12K Cr',
    statLabel: 'lost annually',
    color: 'text-lavender-accent',
    glowColor: 'rgba(192, 132, 252, 0.15)',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="problem" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-error/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full px-4 sm:px-8 lg:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-error/10 border border-error/20 rounded-full mb-6">
            <AlertTriangle className="w-3.5 h-3.5 text-error" />
            <span className="text-xs font-mono text-error tracking-wider uppercase">
              The Problem
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-on-surface tracking-tight">
            The Infrastructure
            <br />
            <span className="text-gradient-warm">Accountability Gap</span>
          </h2>
          <p className="mt-6 text-on-surface-variant font-mono text-sm sm:text-base max-w-2xl mx-auto">
            India&apos;s road infrastructure crisis costs lives, wastes public funds,
            and erodes citizen trust. The gap between complaints and action is
            widening every day.
          </p>
        </motion.div>

        {/* Problem Cards */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {problems.map((problem) => (
            <motion.div key={problem.title} variants={cardVariants}>
              <GlassCard className="h-full flex flex-col">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: problem.glowColor }}
                >
                  <problem.icon className={`w-6 h-6 ${problem.color}`} />
                </div>

                {/* Stat */}
                <div className={`text-3xl font-display font-bold ${problem.color} mb-1`}>
                  {problem.stat}
                </div>
                <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest mb-4">
                  {problem.statLabel}
                </div>

                {/* Content */}
                <h3 className="font-display font-semibold text-lg text-on-surface mb-3">
                  {problem.title}
                </h3>
                <p className="text-sm font-mono text-on-surface-variant leading-relaxed flex-1">
                  {problem.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

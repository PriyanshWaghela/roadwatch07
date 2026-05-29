'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Camera,
  MapPin,
  Zap,
  Brain,
  Shield,
  BarChart3,
  Users,
  Wrench,
  Eye,
  ArrowRight,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const columns = [
  {
    badge: '01',
    title: 'CITIZEN INPUT',
    subtitle: 'Report & Capture',
    color: 'text-cyan-accent',
    borderColor: 'border-cyan-accent/20',
    bgColor: 'bg-cyan-accent/5',
    glowColor: 'rgba(0, 255, 255, 0.08)',
    steps: [
      {
        icon: Camera,
        title: 'Upload Damage',
        desc: 'Photo & video capture of road infrastructure issues with automatic metadata',
      },
      {
        icon: MapPin,
        title: 'GPS Capture',
        desc: 'Precise geolocation tagging with street-level address resolution',
      },
      {
        icon: Zap,
        title: 'Instant Reporting',
        desc: 'One-tap complaint submission with smart category detection',
      },
    ],
  },
  {
    badge: '02',
    title: 'AI PROCESSING',
    subtitle: 'Analyze & Classify',
    color: 'text-secondary',
    borderColor: 'border-secondary/20',
    bgColor: 'bg-secondary/5',
    glowColor: 'rgba(64, 229, 108, 0.08)',
    steps: [
      {
        icon: Brain,
        title: 'Neural Analysis',
        desc: 'Deep learning models trained on 500K+ road damage samples for instant recognition',
      },
      {
        icon: Shield,
        title: 'Damage Classification',
        desc: 'Automatic categorization: potholes, cracks, waterlogging, surface degradation',
      },
      {
        icon: BarChart3,
        title: 'Severity Scoring',
        desc: 'AI-generated severity index with estimated repair cost and timeline',
      },
    ],
  },
  {
    badge: '03',
    title: 'AUTHORITY ACTION',
    subtitle: 'Resolve & Track',
    color: 'text-tertiary',
    borderColor: 'border-tertiary/20',
    bgColor: 'bg-tertiary/5',
    glowColor: 'rgba(238, 189, 144, 0.08)',
    steps: [
      {
        icon: Users,
        title: 'Priority Assignment',
        desc: 'Smart routing to relevant municipal departments based on damage profile',
      },
      {
        icon: Wrench,
        title: 'Repair Tracking',
        desc: 'End-to-end workflow from assignment to completion with live status updates',
      },
      {
        icon: Eye,
        title: 'Transparency',
        desc: 'Public dashboards tracking every rupee spent and every road repaired',
      },
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const columnVariants = {
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

export default function SolutionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="solutions"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-cyan-accent/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[350px] h-[350px] bg-secondary/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 border border-secondary/20 rounded-full mb-6">
            <Brain className="w-3.5 h-3.5 text-secondary" />
            <span className="text-xs font-mono text-secondary tracking-wider uppercase">
              How It Works
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-on-surface tracking-tight leading-tight">
            The RoadWatch
            <br />
            <span className="text-gradient-cyan">Intelligence Stack</span>
          </h2>
          <p className="mt-6 text-on-surface-variant font-mono text-sm sm:text-base max-w-2xl mx-auto">
            A three-stage pipeline transforming citizen reports into actionable
            intelligence for urban infrastructure management.
          </p>
        </motion.div>

        {/* Pipeline Columns */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-3 gap-6 lg:gap-4 relative"
        >
          {/* Connecting Arrows (Desktop only) */}
          <div className="hidden lg:flex absolute top-[120px] left-[33.3%] -translate-x-1/2 z-20">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex items-center"
            >
              <div className="w-12 h-[2px] bg-gradient-to-r from-cyan-accent/40 to-secondary/40" />
              <ArrowRight className="w-5 h-5 text-secondary/60 -ml-1" />
            </motion.div>
          </div>
          <div className="hidden lg:flex absolute top-[120px] left-[66.6%] -translate-x-1/2 z-20">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="flex items-center"
            >
              <div className="w-12 h-[2px] bg-gradient-to-r from-secondary/40 to-tertiary/40" />
              <ArrowRight className="w-5 h-5 text-tertiary/60 -ml-1" />
            </motion.div>
          </div>

          {columns.map((column) => (
            <motion.div key={column.badge} variants={columnVariants}>
              <GlassCard className="h-full" padding="p-0">
                {/* Column Header */}
                <div
                  className={`p-6 pb-4 border-b border-white/[0.04]`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-mono font-bold ${column.bgColor} ${column.color}`}
                    >
                      {column.badge}
                    </span>
                    <div>
                      <h3
                        className={`font-display font-bold text-sm tracking-widest ${column.color}`}
                      >
                        {column.title}
                      </h3>
                      <p className="text-[11px] font-mono text-on-surface-variant">
                        {column.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="p-6 space-y-5">
                  {column.steps.map((step, i) => (
                    <div key={step.title} className="flex gap-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${column.bgColor}`}
                      >
                        <step.icon className={`w-5 h-5 ${column.color}`} />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-sm text-on-surface mb-1">
                          {step.title}
                        </h4>
                        <p className="text-xs font-mono text-on-surface-variant leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                      {i < column.steps.length - 1 && (
                        <div className="hidden" />
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

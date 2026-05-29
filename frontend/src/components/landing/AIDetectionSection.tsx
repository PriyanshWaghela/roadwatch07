'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Scan,
  AlertTriangle,
  Shield,
  TrendingUp,
  Crosshair,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface BBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  confidence: number;
  color: string;
}

const mockBBoxes: BBox[] = [
  { x: 15, y: 25, w: 28, h: 22, label: 'Pothole', confidence: 94.7, color: '#ffb4ab' },
  { x: 55, y: 40, w: 20, h: 18, label: 'Crack', confidence: 89.2, color: '#eebd90' },
  { x: 35, y: 65, w: 25, h: 20, label: 'Surface Damage', confidence: 91.5, color: '#00ffff' },
];

const mockAnalysis = {
  damageType: 'Multiple Defects Detected',
  severity: 'High',
  confidence: 91.8,
  roadHealthScore: 34,
  recommendations: [
    'Immediate pothole filling required',
    'Crack sealing within 48 hours',
    'Full surface re-laying recommended for section',
    'Install drainage to prevent further waterlogging',
  ],
  estimatedCost: '₹4.2L',
  estimatedDays: 5,
};

export default function AIDetectionSection() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showBoxes, setShowBoxes] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const runAnalysis = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setIsComplete(false);
    setShowBoxes(false);

    setTimeout(() => {
      setShowBoxes(true);
    }, 1200);

    setTimeout(() => {
      setIsAnalyzing(false);
      setIsComplete(true);
    }, 2500);
  };

  const severityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-error';
      case 'high':
        return 'text-tertiary';
      case 'medium':
        return 'text-cyan-accent';
      default:
        return 'text-secondary';
    }
  };

  return (
    <section
      id="ai-detection"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-accent/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-accent/10 border border-cyan-accent/20 rounded-full mb-6">
            <Scan className="w-3.5 h-3.5 text-cyan-accent" />
            <span className="text-xs font-mono text-cyan-accent tracking-wider uppercase">
              Neural Detection Engine
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-on-surface tracking-tight">
            AI That Sees What
            <br />
            <span className="text-gradient-cyan">Humans Miss</span>
          </h2>
          <p className="mt-6 text-on-surface-variant font-mono text-sm sm:text-base max-w-2xl mx-auto">
            Our neural detection engine analyzes road images in under 50ms,
            identifying damage types, severity levels, and repair requirements
            with 99.2% accuracy.
          </p>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="grid lg:grid-cols-2 gap-6 lg:gap-8"
        >
          {/* Left — Image with Bounding Boxes */}
          <GlassCard padding="p-0" hover={false}>
            <div className="relative aspect-[4/3] bg-surface-container-highest rounded-t-2xl overflow-hidden">
              {/* Simulated road image background */}
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest" />
              <div className="absolute inset-0 grid-bg opacity-30" />

              {/* Road visualization */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 300"
                fill="none"
              >
                {/* Road surface */}
                <rect
                  x="0"
                  y="80"
                  width="400"
                  height="180"
                  fill="rgba(52,53,55,0.8)"
                />
                {/* Road lines */}
                <line
                  x1="0"
                  y1="170"
                  x2="400"
                  y2="170"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                  strokeDasharray="20 15"
                />
                {/* Damage marks */}
                <ellipse
                  cx="95"
                  cy="115"
                  rx="40"
                  ry="25"
                  fill="rgba(30,25,20,0.6)"
                  stroke="rgba(100,80,60,0.3)"
                />
                <path
                  d="M 230 145 Q 260 130 275 148 Q 285 155 290 145"
                  stroke="rgba(80,70,60,0.5)"
                  strokeWidth="3"
                  fill="none"
                />
                <ellipse
                  cx="175"
                  cy="220"
                  rx="35"
                  ry="22"
                  fill="rgba(25,20,15,0.5)"
                  stroke="rgba(90,75,55,0.3)"
                />
              </svg>

              {/* Scan Line */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{ top: '-2px' }}
                    animate={{ top: '100%' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: 'linear' }}
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-accent to-transparent shadow-[0_0_15px_rgba(0,255,255,0.5)] z-10"
                  />
                )}
              </AnimatePresence>

              {/* Bounding Boxes */}
              <AnimatePresence>
                {showBoxes &&
                  mockBBoxes.map((box, i) => (
                    <motion.div
                      key={box.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: i * 0.15, duration: 0.3 }}
                      className="absolute"
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.w}%`,
                        height: `${box.h}%`,
                      }}
                    >
                      <div
                        className="w-full h-full border-2 rounded-md relative"
                        style={{ borderColor: box.color }}
                      >
                        {/* Corner markers */}
                        <div
                          className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 rounded-tl-sm"
                          style={{ borderColor: box.color }}
                        />
                        <div
                          className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 rounded-tr-sm"
                          style={{ borderColor: box.color }}
                        />
                        <div
                          className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 rounded-bl-sm"
                          style={{ borderColor: box.color }}
                        />
                        <div
                          className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 rounded-br-sm"
                          style={{ borderColor: box.color }}
                        />

                        {/* Label */}
                        <div
                          className="absolute -top-7 left-0 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold whitespace-nowrap"
                          style={{
                            backgroundColor: `${box.color}20`,
                            color: box.color,
                            border: `1px solid ${box.color}40`,
                          }}
                        >
                          {box.label} — {box.confidence}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>

              {/* Crosshair overlay when analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Crosshair className="w-16 h-16 text-cyan-accent/20 animate-pulse" />
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="p-4 flex items-center justify-between border-t border-white/[0.04]">
              <div className="flex items-center gap-2">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 text-cyan-accent animate-spin" />
                    <span className="text-xs font-mono text-cyan-accent">
                      Analyzing...
                    </span>
                  </>
                ) : isComplete ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-mono text-secondary">
                      3 defects detected
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-mono text-on-surface-variant">
                    Upload an image or run demo analysis
                  </span>
                )}
              </div>
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="px-4 py-2 text-xs font-mono font-medium text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/25 rounded-lg hover:bg-cyan-accent/20 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? 'Processing...' : 'Run AI Analysis'}
              </button>
            </div>
          </GlassCard>

          {/* Right — Analysis Results */}
          <div className="space-y-4">
            {/* Damage Type */}
            <GlassCard padding="p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-tertiary" />
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                  Damage Assessment
                </span>
              </div>
              <motion.h3
                className="font-display font-bold text-xl text-on-surface"
                animate={isComplete ? { opacity: 1 } : { opacity: 0.4 }}
              >
                {mockAnalysis.damageType}
              </motion.h3>
              <div className="flex items-center gap-4 mt-3">
                <div>
                  <span className="text-[10px] font-mono text-on-surface-variant block">
                    SEVERITY
                  </span>
                  <span
                    className={`font-display font-bold text-lg ${severityColor(
                      mockAnalysis.severity
                    )}`}
                  >
                    {mockAnalysis.severity}
                  </span>
                </div>
                <div className="w-px h-8 bg-outline-variant" />
                <div>
                  <span className="text-[10px] font-mono text-on-surface-variant block">
                    CONFIDENCE
                  </span>
                  <span className="font-display font-bold text-lg text-cyan-accent">
                    {mockAnalysis.confidence}%
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Road Health Score */}
            <GlassCard padding="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-error" />
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                    Road Health Score
                  </span>
                </div>
                <motion.span
                  className="font-display font-bold text-2xl text-error"
                  animate={isComplete ? { opacity: 1 } : { opacity: 0.3 }}
                >
                  {mockAnalysis.roadHealthScore}/100
                </motion.span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-error via-tertiary to-secondary"
                  initial={{ width: 0 }}
                  animate={isComplete ? { width: `${mockAnalysis.roadHealthScore}%` } : { width: 0 }}
                  transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-mono text-error">Critical</span>
                <span className="text-[10px] font-mono text-secondary">Healthy</span>
              </div>
            </GlassCard>

            {/* Repair Estimates */}
            <div className="grid grid-cols-2 gap-4">
              <GlassCard padding="p-4">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest block mb-1">
                  Est. Cost
                </span>
                <motion.span
                  className="font-display font-bold text-xl text-tertiary"
                  animate={isComplete ? { opacity: 1 } : { opacity: 0.3 }}
                >
                  {mockAnalysis.estimatedCost}
                </motion.span>
              </GlassCard>
              <GlassCard padding="p-4">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest block mb-1">
                  Est. Timeline
                </span>
                <motion.span
                  className="font-display font-bold text-xl text-cyan-accent"
                  animate={isComplete ? { opacity: 1 } : { opacity: 0.3 }}
                >
                  {mockAnalysis.estimatedDays} days
                </motion.span>
              </GlassCard>
            </div>

            {/* Recommendations */}
            <GlassCard padding="p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                  AI Recommendations
                </span>
              </div>
              <ul className="space-y-2">
                {mockAnalysis.recommendations.map((rec, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isComplete ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 flex-shrink-0" />
                    <span className="text-xs font-mono text-on-surface-variant">
                      {rec}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

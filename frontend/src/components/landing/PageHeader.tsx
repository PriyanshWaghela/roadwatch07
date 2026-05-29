'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badgeText: string;
  badgeIcon: React.ReactNode;
  glowColor: 'cyan' | 'purple' | 'green' | 'orange';
}

export default function PageHeader({ title, subtitle, badgeText, badgeIcon, glowColor }: PageHeaderProps) {
  
  const getGlowStyles = () => {
    switch (glowColor) {
      case 'cyan':
        return 'bg-cyan-accent/20 border-cyan-accent/30 text-cyan-accent';
      case 'purple':
        return 'bg-purple-accent/20 border-purple-accent/30 text-purple-accent';
      case 'green':
        return 'bg-secondary/20 border-secondary/30 text-secondary';
      case 'orange':
        return 'bg-tertiary/20 border-tertiary/30 text-tertiary';
      default:
        return 'bg-cyan-accent/20 border-cyan-accent/30 text-cyan-accent';
    }
  };

  const glowBase = getGlowStyles();

  return (
    <div className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-white/[0.04]">
      {/* Background patterns */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* Dynamic ambient glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-20 ${
        glowColor === 'cyan' ? 'bg-cyan-accent' : 
        glowColor === 'purple' ? 'bg-purple-accent' : 
        glowColor === 'green' ? 'bg-secondary' : 'bg-tertiary'
      }`} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 border rounded-full mb-8 ${glowBase}`}>
            {badgeIcon}
            <span className="text-xs font-mono tracking-widest uppercase font-semibold">
              {badgeText}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight leading-tight mb-6 max-w-4xl">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-on-surface-variant font-mono text-base sm:text-lg max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

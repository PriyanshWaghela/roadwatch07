'use client';

import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: string;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  padding = 'p-6',
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      className={cn('glass-card', padding, className)}
      whileHover={
        hover
          ? {
              y: -4,
              transition: { duration: 0.3, ease: 'easeOut' },
            }
          : undefined
      }
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

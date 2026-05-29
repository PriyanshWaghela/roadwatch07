'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import map to avoid SSR issues with Leaflet
const LiveMap = dynamic(
  () => import('@/components/dashboard/LiveMap'),
  { ssr: false, loading: () => <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-surface-container rounded-xl font-mono text-on-surface-variant animate-pulse border border-white/5">Loading GIS Map Engine...</div> }
);

export default function CitizenMapPage() {
  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-display font-bold text-on-surface tracking-tight">Live Infrastructure Map</h1>
        <p className="text-on-surface-variant font-mono text-sm mt-1">Explore reported issues and road health in your area.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="glass-card rounded-xl border border-white/10 overflow-hidden flex-1 relative"
      >
        <LiveMap />
      </motion.div>
    </div>
  );
}

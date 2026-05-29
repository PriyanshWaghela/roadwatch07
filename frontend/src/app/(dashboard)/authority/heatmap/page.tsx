'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { analyticsAPI } from '@/lib/api';

// Dynamically import Leaflet map (SSR disabled)
const HeatmapComponent = dynamic(() => import('@/components/dashboard/HeatmapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-surface-container rounded-xl border border-white/5 animate-pulse flex items-center justify-center text-on-surface-variant font-mono">Initializing GIS Heatmap Layer...</div>
});

export default function AuthorityHeatmapPage() {
  const [heatmapData, setHeatmapData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const response = await analyticsAPI.heatmap();
        setHeatmapData(response?.data || []);
      } catch (err) {
        console.error('Heatmap fetch error', err);
      }
    };
    fetchHeatmap();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-display font-bold text-on-surface tracking-tight">Predictive GIS Heatmap</h1>
          <p className="text-on-surface-variant font-mono text-sm mt-1">Live visualization of structural road damage density.</p>
        </div>
      </div>
      
      <div className="glass-card p-1 rounded-xl border border-white/10 shadow-bloom-cyan">
        <HeatmapComponent data={heatmapData} />
      </div>
    </div>
  );
}

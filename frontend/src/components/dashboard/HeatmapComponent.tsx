'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat'; // We will install this dynamically or mock it if missing

interface HeatmapComponentProps {
  data: Array<{ lat: number; lng: number; weight?: number; intensity?: number }>;
}

export default function HeatmapComponent({ data }: HeatmapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    if (!mapRef.current) {
      // Initialize map (Centered on India broadly, will zoom later)
      mapRef.current = L.map(mapContainerRef.current).setView([22.5937, 78.9629], 5);

      // Dark mode map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapRef.current);
    }

    // Add Heatmap Layer
    // Note: leaflet.heat requires global L.heatLayer. We'll simulate it using standard circle markers if heatlayer isn't available
    if (data.length > 0 && mapRef.current) {
      // Clear existing layers except the tile layer
      mapRef.current.eachLayer((layer) => {
        if (!(layer instanceof L.TileLayer)) {
          mapRef.current?.removeLayer(layer);
        }
      });

      // Try to use leaflet.heat if available, otherwise fallback to colored circles
      try {
        // @ts-ignore
        if (typeof L.heatLayer !== 'undefined') {
          const heatData = data.map(d => [d.lat, d.lng, d.weight || d.intensity || 1]);
          // @ts-ignore
          L.heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 10,
            gradient: { 0.4: '#00ffff', 0.6: '#40e56c', 0.8: '#eebd90', 1.0: '#ffb4ab' }
          }).addTo(mapRef.current);
        } else {
          throw new Error('leaflet.heat not loaded');
        }
      } catch {
        // Fallback: draw circles based on intensity
        data.forEach(point => {
          const val = point.weight || point.intensity || 1;
          const color = val >= 4 ? '#ffb4ab' : 
                        val >= 3 ? '#eebd90' : 
                        val >= 2 ? '#40e56c' : '#00ffff';
          
          L.circle([point.lat, point.lng], {
            color: 'transparent',
            fillColor: color,
            fillOpacity: 0.6,
            radius: 5000 // 5km radius for visibility at country level
          }).addTo(mapRef.current!);
        });
      }

      // Auto zoom to fit data
      if (data.length > 0) {
        const bounds = L.latLngBounds(data.map(d => [d.lat, d.lng]));
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      // Cleanup happens only on full unmount, Leaflet handles its own re-renders mostly
    };
  }, [data]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-[600px] rounded-lg bg-surface-container"
      style={{ zIndex: 0 }}
    />
  );
}

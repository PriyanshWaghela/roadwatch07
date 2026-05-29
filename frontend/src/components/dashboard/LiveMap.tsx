'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { complaintsAPI } from '@/lib/api';

// Fix Leaflet default icon path issues in Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const criticalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function LiveMap() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintsAPI.my();
        setComplaints(response.complaints || []);
      } catch (err) {
        console.error('Failed to fetch for map', err);
      }
    };
    fetchComplaints();
  }, []);

  // Default center (New Delhi / Noida)
  const center: [number, number] = [28.6276, 77.3639];

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: '100%', width: '100%', minHeight: '500px', backgroundColor: '#121315' }}
      className="z-0"
    >
      {/* Dark theme map tiles (CartoDB Dark Matter) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {complaints.map((c: any) => {
        if (!c.location || !c.location.coordinates) return null;
        const [lng, lat] = c.location.coordinates;
        const icon = c.severity === 'high' || c.severity === 'critical' ? criticalIcon : customIcon;
        
        return (
          <Marker key={c._id} position={[lat, lng]} icon={icon}>
            <Popup className="custom-popup">
              <div className="font-sans text-sm">
                <strong className="font-display block text-base mb-1">{c.title}</strong>
                <span className="font-mono text-xs text-gray-500 block mb-2">{c.location.address}</span>
                <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold uppercase">{c.severity}</span>
                <span className="inline-block ml-2 px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold uppercase">{c.status}</span>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

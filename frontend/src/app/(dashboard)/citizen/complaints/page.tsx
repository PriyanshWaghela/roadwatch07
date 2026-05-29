'use client';

import { useEffect, useState } from 'react';
import { complaintsAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintsAPI.my();
        setComplaints(response.complaints || []);
      } catch (err) {
        console.error('Failed to fetch complaints', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((c: any) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-on-surface tracking-tight">My Submissions</h1>
          <p className="text-on-surface-variant font-mono text-sm mt-1">Track the status of your reported road damage.</p>
        </div>
        <Link 
          href="/citizen/complaints/new"
          className="bg-cyan-accent text-black px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-shadow uppercase tracking-wider"
        >
          <AlertTriangle size={16} />
          Report Damage
        </Link>
      </div>

      <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Search complaints..." 
            className="w-full bg-surface-container border border-white/5 focus:border-cyan-accent/50 rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface outline-none transition-colors font-mono"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={18} className="text-on-surface-variant" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-surface-container border border-white/5 rounded-lg px-4 py-2 text-sm text-on-surface outline-none font-mono appearance-none min-w-[150px]"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-on-surface-variant font-mono">Loading your reports...</div>
      ) : filteredComplaints.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-xl border border-dashed border-white/10">
          <div className="w-16 h-16 bg-surface-bright rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-2">No complaints found</h3>
          <p className="text-on-surface-variant font-mono text-sm max-w-md mx-auto mb-6">
            You haven't reported any road damage yet, or no complaints match your filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint: any, i: number) => (
            <motion.div 
              key={complaint._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl overflow-hidden group border border-white/5 hover:border-cyan-accent/30 transition-colors"
            >
              <div className="h-48 bg-surface-bright relative overflow-hidden">
                {complaint.images && complaint.images.length > 0 ? (
                  <img 
                    src={complaint.images[0].url.startsWith('http') ? complaint.images[0].url : `http://localhost:5000${complaint.images[0].url}`} 
                    alt="Damage" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                    <AlertTriangle size={32} opacity={0.5} />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md ${
                    complaint.status === 'resolved' ? 'bg-secondary/80 text-black' : 
                    complaint.status === 'in_progress' ? 'bg-tertiary/80 text-black' : 
                    'bg-cyan-accent/80 text-black'
                  }`}>
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-on-surface line-clamp-1">{complaint.title}</h3>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                    complaint.severity === 'critical' ? 'border-error text-error bg-error/10' :
                    complaint.severity === 'high' ? 'border-tertiary text-tertiary bg-tertiary/10' :
                    'border-secondary text-secondary bg-secondary/10'
                  }`}>
                    {complaint.severity}
                  </span>
                </div>
                <p className="text-sm font-mono text-on-surface-variant line-clamp-2">{complaint.description}</p>
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-on-surface-variant">
                  <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  <span className="truncate max-w-[150px]">{complaint.location?.address}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

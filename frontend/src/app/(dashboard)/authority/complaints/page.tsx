'use client';

import { useEffect, useState } from 'react';
import { complaintsAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, AlertOctagon, CheckCircle, Wrench, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthorityComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await complaintsAPI.list();
      setComplaints(response.complaints || []);
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await complaintsAPI.updateStatus(id, { status: newStatus });
      toast.success('Status updated successfully');
      fetchComplaints();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredComplaints = complaints.filter((c: any) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return c.severity === 'critical';
    return c.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-on-surface tracking-tight">Complaint Management</h1>
          <p className="text-on-surface-variant font-mono text-sm mt-1">Review, prioritize, and update road damage reports.</p>
        </div>
      </div>

      <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between border border-white/5">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Search by ID, location, or title..." 
            className="w-full bg-surface-container border border-white/5 focus:border-[#00ffff]/50 rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface outline-none transition-colors font-mono"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={18} className="text-on-surface-variant" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-surface-container border border-white/5 rounded-lg px-4 py-2 text-sm text-on-surface outline-none font-mono appearance-none min-w-[150px]"
          >
            <option value="all">All Reports</option>
            <option value="critical">Critical Only</option>
            <option value="submitted">New (Submitted)</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-on-surface-variant font-mono animate-pulse">Loading command center data...</div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-white/10 text-xs font-mono text-on-surface-variant uppercase tracking-wider">
                  <th className="p-4 font-medium">ID / Date</th>
                  <th className="p-4 font-medium">Issue</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Severity</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-on-surface-variant font-mono">No complaints match your criteria.</td>
                  </tr>
                ) : (
                  filteredComplaints.map((c: any) => (
                    <tr key={c._id} className="hover:bg-surface-bright/50 transition-colors group">
                      <td className="p-4">
                        <div className="font-mono text-xs text-on-surface">{c._id.substring(c._id.length - 6).toUpperCase()}</div>
                        <div className="font-mono text-xs text-on-surface-variant mt-1">{new Date(c.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-on-surface text-sm max-w-[200px] truncate">{c.title}</div>
                        <div className="font-mono text-xs text-on-surface-variant mt-1 capitalize">{c.category.replace('_', ' ')}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-xs text-on-surface max-w-[200px] truncate">{c.location?.address}</div>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          c.severity === 'critical' ? 'bg-error/20 text-error border border-error/30' :
                          c.severity === 'high' ? 'bg-tertiary/20 text-tertiary border border-tertiary/30' :
                          'bg-secondary/20 text-secondary border border-secondary/30'
                        }`}>
                          {c.severity === 'critical' && <AlertOctagon size={12} />}
                          {c.severity}
                        </div>
                      </td>
                      <td className="p-4">
                        <select 
                          value={c.status}
                          onChange={(e) => handleUpdateStatus(c._id, e.target.value)}
                          className={`text-xs font-bold uppercase tracking-wider rounded px-2 py-1 outline-none appearance-none cursor-pointer ${
                            c.status === 'resolved' ? 'bg-secondary/10 text-secondary border border-secondary/20' : 
                            c.status === 'in_progress' ? 'bg-tertiary/10 text-tertiary border border-tertiary/20' : 
                            'bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/20'
                          }`}
                        >
                          <option value="submitted" className="bg-surface text-on-surface">Submitted</option>
                          <option value="verified" className="bg-surface text-on-surface">Verified</option>
                          <option value="in_progress" className="bg-surface text-on-surface">In Progress</option>
                          <option value="resolved" className="bg-surface text-on-surface">Resolved</option>
                          <option value="rejected" className="bg-surface text-on-surface">Rejected</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 text-on-surface-variant hover:text-[#00ffff] hover:bg-[#00ffff]/10 rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}

'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { complaintsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Camera, MapPin, Send, AlertTriangle, ArrowLeft, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function SubmitComplaintPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pothole',
    address: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit');
        return;
      }
      setSelectedFile(file);
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please upload at least one image of the damage.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('latitude', '28.5355'); // Mock GPS
      payload.append('longitude', '77.3910'); // Mock GPS
      payload.append('address', formData.address || 'GPS Location Tagged');
      
      // Append the actual file
      payload.append('images', selectedFile);

      await complaintsAPI.create(payload);
      
      toast.success('Damage report submitted successfully! AI analysis is running.');
      router.push('/citizen/complaints');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/citizen" className="p-2 hover:bg-surface-bright rounded-full transition-colors">
          <ArrowLeft size={20} className="text-on-surface-variant" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-on-surface tracking-tight">Report Road Damage</h1>
          <p className="text-on-surface-variant font-mono text-sm mt-1">Our AI will automatically analyze your upload.</p>
        </div>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        onSubmit={handleSubmit}
        className="glass-card p-6 sm:p-8 rounded-xl space-y-8"
      >
        {/* Upload Section */}
        <div className="space-y-3">
          <label className="block font-display font-semibold text-on-surface">1. Upload Media</label>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed transition-colors rounded-xl p-8 text-center cursor-pointer group ${
              previewUrl ? 'border-[#00ffff]/50 bg-[#00ffff]/5' : 'border-white/10 hover:border-[#00ffff]/50 bg-surface-container'
            }`}
          >
            {previewUrl ? (
              <div className="relative inline-block w-full max-w-sm mx-auto">
                <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-white/10 shadow-lg" />
                <button 
                  type="button" 
                  onClick={removeFile}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-bloom-error"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-surface-bright rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00ffff]/10 transition-colors">
                  <Camera size={32} className="text-on-surface-variant group-hover:text-[#00ffff] transition-colors" />
                </div>
                <p className="text-on-surface font-medium mb-1">Click to browse or take a photo</p>
                <p className="text-on-surface-variant text-sm font-mono">JPG, PNG, WebP (max. 10MB)</p>
              </>
            )}
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-3">
          <label className="block font-display font-semibold text-on-surface">2. Location Details</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Sector 62 Main Road, near Metro Station" 
              className="flex-1 bg-surface-container border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-[#00ffff] transition-colors font-mono"
              required
            />
            <button type="button" className="bg-surface-bright hover:bg-surface-container-highest px-4 rounded-lg border border-white/10 text-[#00ffff] flex items-center justify-center transition-colors">
              <MapPin size={20} />
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <label className="block font-display font-semibold text-on-surface">3. Damage Details</label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-2 uppercase tracking-wider">Damage Type</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-surface-container border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-[#00ffff] transition-colors font-mono appearance-none"
              >
                <option value="pothole">Pothole</option>
                <option value="crack">Road Crack</option>
                <option value="waterlogging">Waterlogging</option>
                <option value="road_damage">Structural Damage</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-2 uppercase tracking-wider">Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief description of issue" 
                className="w-full bg-surface-container border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-[#00ffff] transition-colors font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-on-surface-variant mb-2 uppercase tracking-wider">Additional Context</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide any additional details that might help the authorities..." 
              className="w-full bg-surface-container border border-white/10 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-[#00ffff] transition-colors font-mono resize-none"
              required
            ></textarea>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-mono">
            <AlertTriangle size={16} className="text-tertiary" />
            <span>AI will automatically analyze severity.</span>
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-[#00ffff] text-black px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Submit Report'}
            {!isSubmitting && <Send size={18} />}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

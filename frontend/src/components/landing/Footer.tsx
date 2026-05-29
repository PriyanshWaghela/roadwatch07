import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-container-lowest/50 py-8">
      <div className="w-full px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Minimal Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-accent/20 rounded-md blur-sm group-hover:bg-cyan-accent/30 transition-colors" />
              <div className="relative w-4 h-4 border border-cyan-accent rounded flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-cyan-accent rounded-full" />
              </div>
            </div>
            <span className="font-display font-bold text-base tracking-tight text-on-surface">
              ROAD<span className="text-cyan-accent">WATCH</span>
            </span>
          </Link>
          
          {/* Simple Links & Copyright */}
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs font-mono text-on-surface-variant hover:text-cyan-accent transition-colors">
              Authority Login
            </Link>
            <span className="w-1 h-1 bg-white/[0.1] rounded-full" />
            <p className="text-xs font-mono text-on-surface-variant">
              &copy; {new Date().getFullYear()} RoadWatch Technologies.
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}

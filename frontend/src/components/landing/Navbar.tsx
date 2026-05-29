'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { label: 'The Problem', href: '#problem' },
  { label: 'How It Works', href: '#solutions' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-surface/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-cyan-accent/20 rounded-lg blur-sm group-hover:bg-cyan-accent/30 transition-colors" />
                <div className="relative w-6 h-6 border-2 border-cyan-accent rounded-md flex items-center justify-center">
                  <div className="w-2 h-2 bg-cyan-accent rounded-full animate-pulse" />
                </div>
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-on-surface">
                ROAD<span className="text-cyan-accent">WATCH</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="relative px-4 py-2 text-sm font-mono text-on-surface-variant hover:text-on-surface transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-cyan-accent to-secondary group-hover:w-3/4 transition-all duration-300" />
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-mono text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Login
              </Link>
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-medium overflow-hidden rounded-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-accent/20 to-secondary/10 border border-cyan-accent/30 rounded-xl transition-all group-hover:from-cyan-accent/30 group-hover:to-secondary/20 group-hover:shadow-[0_0_25px_rgba(0,255,255,0.15)]" />
                <span className="relative text-cyan-accent">
                  Launch Dashboard
                </span>
                <ChevronRight className="relative w-4 h-4 text-cyan-accent group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-surface-container-low/95 backdrop-blur-xl border-l border-white/[0.06] lg:hidden"
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-10">
                  <span className="font-display font-bold text-lg text-on-surface">
                    ROAD<span className="text-cyan-accent">WATCH</span>
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-on-surface-variant hover:text-on-surface"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {navLinks.map((link, i) => (
                    <motion.button
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      onClick={() => handleNavClick(link.href)}
                      className="text-left px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/[0.03] rounded-xl transition-all font-mono text-sm"
                    >
                      {link.label}
                    </motion.button>
                  ))}
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-3 text-center text-sm font-mono text-on-surface-variant hover:text-on-surface border border-outline-variant rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-4 py-3 text-center text-sm font-mono text-cyan-accent bg-cyan-accent/10 border border-cyan-accent/30 rounded-xl hover:bg-cyan-accent/20 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Launch Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

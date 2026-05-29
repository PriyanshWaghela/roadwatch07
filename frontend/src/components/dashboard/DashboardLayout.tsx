'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  Menu,
  X,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/cn';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isAuthority = user?.role === 'authority';

  const citizenLinks = [
    { name: 'Dashboard', href: '/citizen', icon: LayoutDashboard },
    { name: 'My Complaints', href: '/citizen/complaints', icon: FileText },
    { name: 'Report Damage', href: '/citizen/complaints/new', icon: AlertTriangle },
    { name: 'Live Map', href: '/citizen/map', icon: MapPin },
  ];

  const authorityLinks = [
    { name: 'Command Center', href: '/authority', icon: LayoutDashboard },
    { name: 'All Complaints', href: '/authority/complaints', icon: FileText },
    { name: 'Analytics', href: '/authority/analytics', icon: BarChart3 },
    { name: 'Public Spending', href: '/authority/spending', icon: TrendingUp },
    { name: 'Heatmap', href: '/authority/heatmap', icon: MapIcon },
  ];

  const links = isAuthority ? authorityLinks : citizenLinks;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-surface-container-low border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <span className="font-display font-bold text-xl tracking-tight text-on-surface">ROADWATCH</span>
          <button className="md:hidden text-on-surface-variant" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono transition-colors",
                    isActive 
                      ? "bg-surface-bright text-[#00ffff] shadow-[inset_2px_0_0_0_#00ffff]" 
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  )}
                >
                  <Icon size={18} className={isActive ? "text-[#00ffff]" : "text-on-surface-variant"} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 bg-surface-container rounded-lg mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-bold truncate">{user?.name}</div>
              <div className="text-xs text-on-surface-variant uppercase tracking-wider">{user?.role}</div>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors font-mono"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-surface/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <button 
            className="md:hidden text-on-surface-variant hover:text-on-surface"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-4">
            <button className="relative text-on-surface-variant hover:text-on-surface transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-error shadow-[0_0_10px_rgba(255,180,171,0.5)]"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer'; // We will create this

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-on-surface font-body-md antialiased overflow-x-hidden selection:bg-secondary selection:text-on-secondary relative min-h-screen flex flex-col">
      <div className="w-full flex-grow flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

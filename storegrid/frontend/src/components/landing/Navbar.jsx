import React, { useState } from 'react';
import { Radio, Menu, X, ArrowUpRight } from 'lucide-react';
import Button from '../common/Button';

export default function Navbar({
  activeSection,
  onNavigate,
  reviewQueueCount = 0,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Live Dashboard' },
    { id: 'features', label: 'Features' },
    { id: 'workflow', label: 'How It Works' },
    { id: 'reviews', label: 'Review Queue', badge: reviewQueueCount > 0 ? reviewQueueCount : null },
    { id: 'settings', label: 'Settings & API' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Name */}
          <div
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 group-hover:border-[#3478F6]/50 flex items-center justify-center text-[#3478F6] shadow-2xs transition-all">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-[#172033]">
                  StoreGrid
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-blue-50 text-[#3478F6] border border-blue-200">
                  Voice-of-Store
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] font-medium hidden sm:block">
                Retail Intelligence Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#3478F6] bg-blue-50/80 border border-blue-100 font-semibold'
                      : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] border border-transparent'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== null && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Primary Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('dashboard')}
              icon={ArrowUpRight}
              iconPosition="right"
              className="cursor-pointer"
            >
              Open Console
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2E8F0] bg-white px-4 pt-2 pb-5 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] rounded-lg flex items-center justify-between"
            >
              <span>{link.label}</span>
              {link.badge !== null && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full justify-center"
            >
              Open Console
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

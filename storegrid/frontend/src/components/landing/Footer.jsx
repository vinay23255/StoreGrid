import React from 'react';
import { Radio } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] text-[#64748B] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 pb-10 border-b border-[#E2E8F0]">
          {/* Logo & Info */}
          <div className="max-w-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#3478F6]">
                <Radio className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-[#172033]">
                StoreGrid
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-[#3478F6] border border-blue-200">
                Retail Intelligence Platform
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Voice-of-Store retail intelligence and real-time operational feedback classification platform.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div>
              <span className="font-bold text-[#172033] uppercase tracking-wider text-[11px] block mb-3">
                Platform
              </span>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="hover:text-[#172033] transition-colors cursor-pointer"
                  >
                    Live Console
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('features')}
                    className="hover:text-[#172033] transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('workflow')}
                    className="hover:text-[#172033] transition-colors cursor-pointer"
                  >
                    How It Works
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-[#172033] uppercase tracking-wider text-[11px] block mb-3">
                Operations
              </span>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => onNavigate('reviews')}
                    className="hover:text-[#172033] transition-colors cursor-pointer"
                  >
                    Needs Review Queue
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('settings')}
                    className="hover:text-[#172033] transition-colors cursor-pointer"
                  >
                    Settings & API Contract
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="hover:text-[#172033] transition-colors cursor-pointer"
                  >
                    Store Switcher
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-[#172033] uppercase tracking-wider text-[11px] block mb-3">
                Stack
              </span>
              <ul className="space-y-2 text-[#64748B]">
                <li>React 19 + Vite</li>
                <li>Tailwind CSS v4</li>
                <li>FastAPI + Express Ready</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-[#64748B]">
            © 2026 StoreGrid Platform. Built for Retail Voice-of-Store Operations.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-[#64748B]">
              All demo metrics deterministic
            </span>
            <span className="text-[#E2E8F0]">•</span>
            <span className="text-[#3478F6] font-medium">Status: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

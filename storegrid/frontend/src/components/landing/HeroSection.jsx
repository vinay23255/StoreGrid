import React from 'react';
import {
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import Button from '../common/Button';

export default function HeroSection({ onExploreDashboard, onReviewQueue, reviewQueueCount = 0 }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 bg-[#F8FAFC]">
      {/* Subtle blue background ambient lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#3478F6]/5 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Eyebrow & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Small uppercase eyebrow label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-semibold text-[#64748B] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#3478F6] animate-pulse" />
              <span className="tracking-widest uppercase text-[10px] text-[#3478F6]">
                Voice-of-Store Intelligence Platform
              </span>
            </div>

            {/* Large bold modern headline with electric blue highlight */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#172033] tracking-tight leading-[1.12]">
              Transform raw store voices into{' '}
              <span className="text-[#3478F6] relative inline-block">
                real-time operational action
              </span>
              .
            </h1>

            {/* Short and clear description */}
            <p className="text-sm sm:text-base lg:text-lg text-[#64748B] max-w-xl leading-relaxed font-normal">
              StoreGrid captures multilingual customer feedback across QR counters, WhatsApp audio, and store kiosks. Our NLP engine classifies complaints into 6 operational pillars, automatically routing critical issues for immediate resolution.
            </p>

            {/* Buttons: One primary blue, one secondary outlined */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={onExploreDashboard}
                icon={ArrowRight}
                iconPosition="right"
                className="cursor-pointer"
              >
                Launch Store Dashboard
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onReviewQueue}
                className="cursor-pointer"
              >
                Review Triage Queue ({reviewQueueCount})
              </Button>
            </div>

            {/* Key capability highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#64748B] border-t border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#3478F6]" />
                <span>Multilingual NLP (Telugu / Hindi / English)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#3478F6]" />
                <span>6 Operational Category Pillars</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#3478F6]" />
                <span>Human-in-the-Loop Triage</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Preview of StoreGrid */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-white border border-[#E2E8F0] shadow-xl p-5 glow-accent-subtle overflow-hidden">
              {/* Fake Window Controls */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-[10px] text-[#64748B]">
                    storegrid.live/store-001
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                  Live Stream
                </span>
              </div>

              {/* Mini Preview KPI Cards */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-semibold text-[#64748B] block">
                    Total Processed
                  </span>
                  <span className="text-xl font-mono font-bold text-[#172033]">
                    19 entries
                  </span>
                  <span className="text-[10px] text-[#3478F6] block mt-0.5">
                    +14% vs avg
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-semibold text-[#64748B] block">
                    Critical Severity
                  </span>
                  <span className="text-xl font-mono font-bold text-red-600">
                    4 alerts
                  </span>
                  <span className="text-[10px] text-red-500 block mt-0.5">
                    Action required
                  </span>
                </div>
              </div>

              {/* Sample Live Transcripts */}
              <div className="mt-4 space-y-2.5">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3478F6]/40 transition-colors">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-[#64748B]">FB-1001 • POS 3</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#3478F6] border border-blue-100">
                      BILLING_DELAY
                    </span>
                  </div>
                  <p className="text-xs text-[#172033] font-medium italic">
                    "Billing chala slow ga undi"
                  </p>
                  <p className="text-[10px] text-[#64748B] mt-1">
                    Wait time &gt; 15m. Confidence: 96%
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-amber-300 transition-colors">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-[#64748B]">FB-1002 • Dairy</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      STOCK_SHORTAGE
                    </span>
                  </div>
                  <p className="text-xs text-[#172033] font-medium">
                    "The milk packets were out of stock."
                  </p>
                  <p className="text-[10px] text-[#64748B] mt-1">
                    Morning replenishment needed.
                  </p>
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">
                  Autonomous NLP Triage Engine
                </span>
                <button
                  onClick={onExploreDashboard}
                  className="text-xs text-[#3478F6] font-semibold hover:underline cursor-pointer"
                >
                  View Full Stream →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

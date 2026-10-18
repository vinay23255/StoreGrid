import React from 'react';
import { Mic, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export default function WorkflowSection() {
  const steps = [
    {
      step: '01',
      title: 'Customer Speaks or Submits',
      desc: 'Customers submit audio or text complaints via QR codes at checkout counters, exit tablets, or WhatsApp voice messages in their native language.',
      icon: Mic,
      label: 'Input Ingestion',
    },
    {
      step: '02',
      title: 'AI Classification & Confidence Check',
      desc: 'StoreGrid normalizes vernacular expressions and categorizes complaints into 6 pillars. Feedback with confidence < 65% is routed to manual triage.',
      icon: Cpu,
      label: 'NLP Processing',
    },
    {
      step: '03',
      title: 'Store Floor Action & Resolution',
      desc: 'Store managers view prioritized issue clusters, confirm low-certainty items with one click, and dispatch staff to resolve stock or counter bottlenecks.',
      icon: CheckCircle2,
      label: 'Operational Fix',
    },
  ];

  return (
    <section id="workflow" className="py-16 sm:py-24 border-t border-[#E2E8F0] bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left max-w-2xl mb-14">
          <span className="text-xs uppercase font-bold tracking-widest text-[#3478F6] block mb-2">
            End-to-End Workflow
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#172033] tracking-tight">
            How Voice-of-Store Works in 3 Steps
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-3">
            A seamless feedback-to-resolution pipeline built for real-world retail store operations.
          </p>
        </div>

        {/* 3 Step Cards with Subtle Connecting Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative p-6 sm:p-7 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#3478F6]/40 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-mono font-extrabold text-[#3478F6]/80">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#3478F6]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#64748B] block mb-1">
                    {item.label}
                  </span>

                  <h3 className="text-base sm:text-lg font-bold text-[#172033]">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#64748B] mt-2.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                  <span>Step {index + 1} of 3</span>
                  {index < 2 && (
                    <ArrowRight className="w-4 h-4 text-[#3478F6] hidden md:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

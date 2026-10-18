import React from 'react';
import {
  Languages,
  Layers,
  ClipboardCheck,
  Zap,
  Server,
  BarChart2,
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Languages,
      title: 'Multilingual Voice & Text Normalization',
      description:
        'Processes mixed-vernacular spoken feedback and transliterations (e.g., Telugu, Hindi, and English) into normalized operational insights.',
      tag: 'NLP Pipeline',
    },
    {
      icon: Layers,
      title: '6 Core Operational Pillars',
      description:
        'Categorizes every complaint into Stock Shortage, Billing Delay, Staff Behaviour, Product Quality, Equipment Failure, or Other.',
      tag: 'Standardized Schema',
    },
    {
      icon: ClipboardCheck,
      title: 'Human-in-the-Loop Triage',
      description:
        'Automatically flags ambiguous phrasing or low AI certainty (< 65% confidence) into a dedicated queue for one-click store manager review.',
      tag: 'Confidence Gating',
    },
    {
      icon: Zap,
      title: 'Critical Issue Escalation',
      description:
        'Identifies urgent operational anomalies — such as cold storage breakdowns or checkout bottlenecks — before they disrupt store revenue.',
      tag: 'Severity Level 1',
    },
    {
      icon: BarChart2,
      title: 'Deterministic Issue Clustering',
      description:
        'Groups recurring complaint spikes into clear department action plans with frequency benchmarks and root cause recommendations.',
      tag: 'Actionable Intelligence',
    },
    {
      icon: Server,
      title: 'Production-Ready Microservices',
      description:
        'Architected for Node.js / Express backend with Python FastAPI NLP service. Works standalone with zero latency via mock fallback.',
      tag: 'Enterprise Architecture',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 border-t border-[#E2E8F0] bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left max-w-2xl mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#3478F6] block mb-2">
            Built for Store Operations
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#172033] tracking-tight">
            Engineered to solve retail bottlenecks in seconds.
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-3 leading-relaxed">
            Every feature is designed to bridge the gap between noisy customer voices and immediate store-floor action.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#3478F6]/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 group-hover:border-[#3478F6]/30 flex items-center justify-center text-[#3478F6] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-[#64748B] px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#172033] group-hover:text-[#3478F6] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#64748B] mt-2.5 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import React from 'react';

export default function MetricCard({
  id,
  label,
  value,
  subtitle,
  icon: Icon,
  indicatorText,
  indicatorVariant = 'neutral',
  accentColor = 'blue',
  onClick,
  active = false,
}) {
  const accentBorderColors = {
    blue: 'hover:border-[#3478F6]/50',
    amber: 'hover:border-amber-300',
    red: 'hover:border-red-300',
    purple: 'hover:border-purple-300',
  };

  const iconBgColors = {
    blue: 'bg-blue-50 text-[#3478F6] border border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border border-amber-100',
    red: 'bg-red-50 text-red-600 border border-red-100',
    purple: 'bg-purple-50 text-purple-600 border border-purple-100',
  };

  const indicatorVariantStyles = {
    neutral: 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]',
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-[#3478F6] border-blue-200',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative p-5 rounded-2xl bg-white border transition-all duration-200 shadow-xs hover:shadow-md ${
        accentBorderColors[accentColor] || 'hover:border-[#3478F6]/40'
      } ${
        active
          ? 'ring-2 ring-[#3478F6]/20 border-[#3478F6] bg-blue-50/20'
          : 'border-[#E2E8F0]'
      } ${onClick ? 'cursor-pointer hover:bg-[#F8FAFC]' : ''}`}
    >
      {/* Top row: Label and Icon */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
          {label}
        </span>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
            iconBgColors[accentColor] || 'bg-[#F1F5F9] text-[#64748B]'
          }`}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-extrabold text-[#172033] tracking-tight font-mono">
          {value}
        </span>
        {indicatorText && (
          <span
            className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full border ${
              indicatorVariantStyles[indicatorVariant] ||
              indicatorVariantStyles.neutral
            }`}
          >
            {indicatorText}
          </span>
        )}
      </div>

      {/* Explanatory Subtitle */}
      {subtitle && (
        <p className="mt-2 text-xs text-[#64748B] leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}

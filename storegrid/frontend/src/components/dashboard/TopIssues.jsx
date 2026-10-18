import React from 'react';
import { AlertOctagon, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Badge from '../common/Badge';
import { CATEGORIES } from '../../constants/categories';

export default function TopIssues({ topIssues = [], onFilterByCategory }) {
  const severityBadges = {
    Critical: 'danger',
    High: 'warning',
    Medium: 'primary',
    Low: 'neutral',
  };

  const formatDepartment = (dept) => {
    if (!dept) return 'Store Operations';
    return dept
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs text-[#172033] h-full flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-[#172033] tracking-tight">
                Top Issues & Priority Highlights
              </h2>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Deterministic issue clusters based on complaint recurrence and operational impact.
            </p>
          </div>
          <span className="self-start sm:self-auto text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-1 rounded-md shrink-0">
            Rule-Based Frequency Engine
          </span>
        </div>

        {topIssues.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#172033]">
              No Priority Operational Issues
            </h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              All store metrics are performing within normal parameters. No unresolved critical or high-severity clusters detected.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-3.5">
            {topIssues.map((issue) => {
              const catConfig = CATEGORIES[issue.category];
              const departmentName = formatDepartment(issue.department);

              return (
                <div
                  key={issue.id}
                  className="group p-4 rounded-xl border border-[#E2E8F0] hover:border-[#3478F6]/40 bg-[#F8FAFC] hover:bg-white hover:shadow-2xs transition-all duration-150 flex flex-col justify-between"
                >
                  <div>
                    {/* Header row: Severity + Category + Feedback Count */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge
                          variant={severityBadges[issue.severity] || 'warning'}
                          size="xs"
                          dot
                          dotColor={
                            issue.severity === 'Critical'
                              ? 'bg-red-500'
                              : issue.severity === 'High'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }
                        >
                          {issue.severity} Severity
                        </Badge>
                        {catConfig && (
                          <span className="text-[10px] font-medium text-[#64748B] bg-white border border-[#E2E8F0] px-2 py-0.5 rounded-md">
                            {catConfig.label}
                          </span>
                        )}
                      </div>

                      <span className="shrink-0 text-xs font-mono font-bold text-[#172033] bg-white border border-[#E2E8F0] px-2.5 py-0.5 rounded-md shadow-2xs">
                        {issue.feedbackCount} {issue.feedbackCount === 1 ? 'complaint' : 'complaints'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#3478F6] transition-colors leading-snug break-words">
                      {issue.title}
                    </h3>

                    {/* Reason / Description */}
                    <p className="text-xs text-[#64748B] mt-2 line-clamp-2 leading-relaxed">
                      {issue.description || issue.summary || 'Operational issue cluster flagged for manager triage.'}
                    </p>
                  </div>

                  {/* Footer action / department */}
                  <div className="mt-3.5 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-[#64748B] truncate max-w-[200px] font-medium" title={departmentName}>
                      {departmentName}
                    </span>
                    {onFilterByCategory && issue.category && (
                      <button
                        type="button"
                        onClick={() => onFilterByCategory(issue.category)}
                        className="inline-flex items-center gap-1 font-semibold text-[#3478F6] hover:text-[#2563EB] cursor-pointer text-xs shrink-0"
                      >
                        View Entries
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

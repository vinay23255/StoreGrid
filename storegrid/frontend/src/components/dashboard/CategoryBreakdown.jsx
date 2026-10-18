import React from 'react';
import { CATEGORIES } from '../../constants/categories';
import { Filter, Layers } from 'lucide-react';

export default function CategoryBreakdown({
  categoryBreakdown = [],
  activeCategoryFilter = 'ALL',
  onSelectCategoryFilter,
  needsReviewCount = 0,
  onNavigateToReviews,
}) {
  const maxCount = Math.max(
    ...categoryBreakdown.map((item) => item.count),
    1
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs text-[#172033] h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#3478F6]" />
            <h2 className="text-base sm:text-lg font-bold text-[#172033] tracking-tight">
              Feedback by Category
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Distribution across the 6 core retail operational pillars. Click a category to filter.
          </p>
        </div>

        {activeCategoryFilter !== 'ALL' && (
          <button
            type="button"
            onClick={() => onSelectCategoryFilter('ALL')}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#3478F6] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            Clear Filter ({CATEGORIES[activeCategoryFilter]?.label || activeCategoryFilter})
          </button>
        )}
      </div>

      {/* Categories Horizontal Bar Chart */}
      <div className="mt-5 space-y-4">
        {categoryBreakdown.map((item) => {
          const config = CATEGORIES[item.categoryId] || {
            label: item.categoryId,
            barColor: 'bg-slate-500',
            color: '#64748b',
          };
          const isSelected = activeCategoryFilter === item.categoryId;
          const barWidthPercent =
            item.count > 0 ? Math.max((item.count / maxCount) * 100, 8) : 0;

          return (
            <div
              key={item.categoryId}
              onClick={() => {
                onSelectCategoryFilter(
                  isSelected ? 'ALL' : item.categoryId
                );
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCategoryFilter(
                    isSelected ? 'ALL' : item.categoryId
                  );
                }
              }}
              className={`group p-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/70 border border-blue-200 shadow-2xs'
                  : 'hover:bg-[#F8FAFC] border border-transparent'
              }`}
            >
              {/* Category label and statistics */}
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <span
                    className={`font-semibold ${
                      isSelected ? 'text-[#3478F6]' : 'text-[#172033]'
                    }`}
                  >
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-[#64748B]">{item.percentage}%</span>
                  <span className="font-bold text-[#172033] bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-0.5 rounded-md">
                    {item.count} {item.count === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
              </div>

              {/* Bar track and fill */}
              <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${config.barColor}`}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Separate Needs Review Note */}
      {needsReviewCount > 0 ? (
        <div className="mt-5 pt-3.5 border-t border-[#E2E8F0] flex items-center justify-between bg-amber-50/70 rounded-xl p-3 border border-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
            <span className="text-xs text-amber-900 font-medium">
              <strong>Needs Review:</strong> {needsReviewCount} {needsReviewCount === 1 ? 'item' : 'items'} requiring NLP triage (handled separately from operational categories).
            </span>
          </div>
          {onNavigateToReviews && (
            <button
              type="button"
              onClick={onNavigateToReviews}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-2 shrink-0 cursor-pointer ml-2"
            >
              Review Now →
            </button>
          )}
        </div>
      ) : (
        <div className="mt-5 pt-3.5 border-t border-[#E2E8F0] flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs text-[#475569] font-medium">
              <strong>Review Queue Clear:</strong> 0 items pending manual NLP verification. All incoming store feedback is categorized.
            </span>
          </div>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md shrink-0">
            All Verified
          </span>
        </div>
      )}
    </div>
  );
}

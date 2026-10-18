import React from 'react';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

export default function NeedsReviewAlert({
  needsReviewCount = 0,
  onReviewFeedback,
}) {
  if (needsReviewCount === 0) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-emerald-950">
              All feedback is classified
            </h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              The NLP model has successfully categorized all incoming store feedback.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="needs-review-banner"
      className="bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-amber-300 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5 shadow-2xs">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#172033]">
                Feedback Requiring Attention
              </h3>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-200 text-amber-900">
                {needsReviewCount} {needsReviewCount === 1 ? 'item' : 'items'} pending
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed max-w-2xl">
              Some feedback needs a quick manual check because its meaning is unclear or the system is not confident about the category.
            </p>
          </div>
        </div>

        <div className="sm:self-center shrink-0">
          <Button
            id="review-feedback-btn"
            variant="primary"
            size="md"
            onClick={onReviewFeedback}
            className="bg-amber-600 hover:bg-amber-700 text-white shadow-2xs font-medium cursor-pointer w-full sm:w-auto"
            icon={ArrowRight}
            iconPosition="right"
          >
            Review feedback
          </Button>
        </div>
      </div>
    </div>
  );
}

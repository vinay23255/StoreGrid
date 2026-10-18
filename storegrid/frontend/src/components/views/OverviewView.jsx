import React from 'react';
import MetricCard from '../dashboard/MetricCard';
import CategoryBreakdown from '../dashboard/CategoryBreakdown';
import NeedsReviewAlert from '../dashboard/NeedsReviewAlert';
import TopIssues from '../dashboard/TopIssues';
import FeedbackTable from '../dashboard/FeedbackTable';
import {
  MessageSquare,
  AlertTriangle,
  AlertOctagon,
  ClipboardCheck,
} from 'lucide-react';

export default function OverviewView({
  overviewData,
  feedbackList,
  isLoading,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  onSelectFeedback,
  onViewAllFeedback,
  onNavigateToReviews,
}) {
  const metrics = overviewData?.metrics || {
    totalFeedback: 0,
    needsAttention: 0,
    criticalIssues: 0,
    needsReview: 0,
  };

  const categoryBreakdown = overviewData?.categoryBreakdown || [];
  const topIssues = overviewData?.topIssues || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Key Metrics Cards */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">
          Store Feedback Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Feedback */}
          <MetricCard
            id="metric-total-feedback"
            label="Total Feedback"
            value={metrics.totalFeedback}
            subtitle="Customer responses logged across all touchpoints"
            icon={MessageSquare}
            accentColor="blue"
            indicatorText="+12% this period"
            indicatorVariant="info"
          />

          {/* Card 2: Needs Attention */}
          <MetricCard
            id="metric-needs-attention"
            label="Needs Attention"
            value={metrics.needsAttention}
            subtitle="Unresolved complaints requiring manager action"
            icon={AlertTriangle}
            accentColor="amber"
            indicatorText={
              metrics.needsAttention > 0
                ? `${metrics.needsAttention} open`
                : 'All clear'
            }
            indicatorVariant={
              metrics.needsAttention > 0 ? 'warning' : 'positive'
            }
            onClick={() => {
              onPriorityChange(selectedPriority === 'HIGH' ? 'ALL' : 'HIGH');
            }}
          />

          {/* Card 3: Critical Issues */}
          <MetricCard
            id="metric-critical-issues"
            label="Critical Issues"
            value={metrics.criticalIssues}
            subtitle="Immediate operational alerts (safety, refrigeration, etc.)"
            icon={AlertOctagon}
            accentColor="red"
            indicatorText={
              metrics.criticalIssues > 0 ? 'Urgent triage' : '0 active'
            }
            indicatorVariant={
              metrics.criticalIssues > 0 ? 'critical' : 'positive'
            }
            onClick={() => {
              onPriorityChange(
                selectedPriority === 'CRITICAL' ? 'ALL' : 'CRITICAL'
              );
            }}
          />

          {/* Card 4: Needs Review */}
          <MetricCard
            id="metric-needs-review"
            label="Needs Review"
            value={metrics.needsReview}
            subtitle="Ambiguous phrasing or low AI classification confidence"
            icon={ClipboardCheck}
            accentColor="purple"
            indicatorText={
              metrics.needsReview > 0
                ? `${metrics.needsReview} unverified`
                : 'Verified'
            }
            indicatorVariant={
              metrics.needsReview > 0 ? 'warning' : 'positive'
            }
            onClick={onNavigateToReviews}
          />
        </div>
      </section>

      {/* 2. Needs Review Alert Callout */}
      {metrics.needsReview > 0 && (
        <section aria-label="Manual review notification">
          <NeedsReviewAlert
            needsReviewCount={metrics.needsReview}
            onReviewFeedback={onNavigateToReviews}
          />
        </section>
      )}

      {/* 3. Operational Category Breakdown + Top Issues Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Category Breakdown Chart (6 cols on desktop) */}
        <div className="lg:col-span-6 flex flex-col">
          <CategoryBreakdown
            categoryBreakdown={categoryBreakdown}
            activeCategoryFilter={selectedCategory}
            onSelectCategoryFilter={onCategoryChange}
            needsReviewCount={metrics.needsReview}
            onNavigateToReviews={onNavigateToReviews}
          />
        </div>

        {/* Right Column: Top Issues / Priority Highlights (6 cols on desktop) */}
        <div className="lg:col-span-6 flex flex-col">
          <TopIssues
            topIssues={topIssues}
            onFilterByCategory={onCategoryChange}
          />
        </div>
      </div>

      {/* 4. Recent Feedback Table Section */}
      <section aria-labelledby="recent-feedback-heading">
        <FeedbackTable
          feedbackList={feedbackList}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          selectedPriority={selectedPriority}
          onPriorityChange={onPriorityChange}
          onSelectFeedback={onSelectFeedback}
          onViewAllFeedback={onViewAllFeedback}
          isLoading={isLoading}
          compact={true}
          maxItems={6}
        />
      </section>
    </div>
  );
}

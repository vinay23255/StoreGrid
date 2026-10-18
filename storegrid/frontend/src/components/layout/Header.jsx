import React, { useState } from 'react';
import {
  RotateCcw,
  Bell,
  Store,
  Calendar,
  Database,
  Menu,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { STORES, DATE_RANGES } from '../../data/mockFeedback';

export default function Header({
  pageTitle = 'Overview',
  pageSubtitle = 'Understand what customers are telling your store.',
  stores = [],
  selectedStore = 'ALL',
  onSelectStore,
  selectedDateRange = 'last7',
  onSelectDateRange,
  batches = [],
  selectedBatch = 'ALL',
  onSelectBatch,
  onRefresh,
  isRefreshing = false,
  reviewQueueCount = 0,
  onOpenMobileMenu,
  onNavigateToReviews,
}) {

  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Manual Review Needed',
      desc: `${reviewQueueCount} low-confidence items awaiting classification`,
      time: 'Just now',
      urgent: reviewQueueCount > 0,
      type: 'review',
    },
    {
      id: 2,
      title: 'Voice-to-Text Pipeline',
      desc: 'Multilingual audio transcription synced (Telugu & English)',
      time: '18m ago',
      urgent: false,
      type: 'info',
    },
    {
      id: 3,
      title: 'Critical Issue Flagged',
      desc: 'Freezer temperature anomaly in Aisle 3 reported twice',
      time: '1h ago',
      urgent: true,
      type: 'alert',
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-8 py-3.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Mobile Toggle + Title & Subtitle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] rounded-lg md:hidden cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight leading-tight">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-normal mt-0.5">
              {pageSubtitle}
            </p>
          </div>
        </div>

        {/* Right: Controls & Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Store Selector */}
          <div className="relative inline-flex items-center">
            <label htmlFor="store-select" className="sr-only">
              Select Store
            </label>
            <div className="absolute left-3 text-[#64748B] pointer-events-none">
              <Store className="w-4 h-4" />
            </div>
            <select
              id="store-select"
              value={selectedStore}
              onChange={(e) => onSelectStore(e.target.value)}
              className="pl-9 pr-8 py-2 text-xs sm:text-sm font-medium text-[#172033] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3478F6]/50 rounded-xl shadow-xs focus:ring-2 focus:ring-[#3478F6]/20 focus:border-[#3478F6] transition-all cursor-pointer appearance-none"
            >
              <option value="ALL" className="bg-white text-[#172033]">
                All Stores (Network Overview)
              </option>
              {(stores && stores.length > 0 ? stores : STORES).map((s) => (
                <option key={s.id || s.code} value={s.code || s.id} className="bg-white text-[#172033]">
                  {s.name} {s.code ? `(${s.code})` : ''}
                </option>
              ))}
            </select>
            <div className="absolute right-3 pointer-events-none text-[#64748B] text-xs">
              ▼
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="relative inline-flex items-center">
            <label htmlFor="date-range-select" className="sr-only">
              Date Range
            </label>
            <div className="absolute left-3 text-[#64748B] pointer-events-none">
              <Calendar className="w-4 h-4" />
            </div>
            <select
              id="date-range-select"
              value={selectedDateRange}
              onChange={(e) => onSelectDateRange(e.target.value)}
              className="pl-9 pr-8 py-2 text-xs sm:text-sm font-medium text-[#172033] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3478F6]/50 rounded-xl shadow-xs focus:ring-2 focus:ring-[#3478F6]/20 focus:border-[#3478F6] transition-all cursor-pointer appearance-none"
            >
              {DATE_RANGES.map((r) => (
                <option key={r.id} value={r.id} className="bg-white text-[#172033]">
                  {r.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 pointer-events-none text-[#64748B] text-xs">
              ▼
            </div>
          </div>

          {/* Dataset / Batch Selector */}
          <div className="relative inline-flex items-center">
            <label htmlFor="batch-select" className="sr-only">
              Dataset Source
            </label>
            <div className="absolute left-3 text-[#64748B] pointer-events-none">
              <Database className="w-4 h-4" />
            </div>
            <select
              id="batch-select"
              value={selectedBatch}
              onChange={(e) => onSelectBatch && onSelectBatch(e.target.value)}
              className="pl-9 pr-8 py-2 text-xs sm:text-sm font-medium text-[#172033] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3478F6]/50 rounded-xl shadow-xs focus:ring-2 focus:ring-[#3478F6]/20 focus:border-[#3478F6] transition-all cursor-pointer appearance-none"
            >
              <option value="ALL" className="bg-white text-[#172033]">
                All Sources (Demo + Uploads)
              </option>
              <option value="DEMO_ONLY" className="bg-white text-[#172033]">
                Demo Records Only
              </option>
              <option value="IMPORTED_ONLY" className="bg-white text-[#172033]">
                Imported Datasets Only
              </option>
              {batches && batches.map((b) => (
                <option key={b.id} value={b.id} className="bg-white text-[#172033]">
                  📁 {b.filename.length > 20 ? b.filename.slice(0, 18) + '...' : b.filename} ({b.importedRecords} rows)
                </option>
              ))}
            </select>
            <div className="absolute right-3 pointer-events-none text-[#64748B] text-xs">
              ▼
            </div>
          </div>


          {/* Refresh Button */}
          <button
            id="refresh-dashboard-btn"
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh dashboard data"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-[#172033] hover:text-[#172033] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            aria-label="Refresh dashboard metrics"
          >
            <RotateCcw
              className={`w-4 h-4 text-[#64748B] ${isRefreshing ? 'animate-spin text-[#3478F6]' : ''}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              id="notifications-btn"
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] shadow-xs transition-colors cursor-pointer"
              aria-label="View system notifications"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {reviewQueueCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#3478F6] rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E8F0]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Store Alerts
                  </span>
                  <span className="text-xs text-[#3478F6] font-medium">
                    Demo Mode Active
                  </span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (n.type === 'review' && onNavigateToReviews) {
                          onNavigateToReviews();
                        }
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer border border-transparent hover:border-[#E2E8F0]"
                    >
                      <div className="flex items-start gap-2.5">
                        {n.urgent ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        ) : (
                          <Info className="w-4 h-4 text-[#3478F6] mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-[#172033]">
                              {n.title}
                            </p>
                            <span className="text-[10px] text-[#64748B]">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                            {n.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 mt-2 border-t border-[#E2E8F0] text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-[#64748B] hover:text-[#172033] font-medium cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

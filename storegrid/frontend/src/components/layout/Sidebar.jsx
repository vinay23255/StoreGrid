import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  ClipboardCheck,
  Settings,
  UploadCloud,
  X,
  Radio,
} from 'lucide-react';

export default function Sidebar({
  activePage = 'overview',
  onSelectPage,
  reviewQueueCount = 0,
  isMobileOpen = false,
  onCloseMobile,
  embedded = false,
}) {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'dataset-upload',
      label: 'Dataset Upload',
      icon: UploadCloud,
      badge: null,
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: MessageSquare,
      badge: null,
    },
    {
      id: 'trends',
      label: 'Trends & Priorities',
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'needs-review',
      label: 'Needs Review',
      icon: ClipboardCheck,
      badge: reviewQueueCount > 0 ? reviewQueueCount : null,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];


  const content = (
    <div className="flex flex-col h-full bg-white text-[#172033] border-r border-[#E2E8F0] select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#3478F6] shadow-2xs">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-[#172033]">
                StoreGrid
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-medium">
              Retail Intelligence Platform
            </p>
          </div>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="p-1.5 text-[#64748B] hover:text-[#172033] rounded-lg hover:bg-[#F1F5F9] md:hidden cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#64748B]/80">
          Store Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              type="button"
              onClick={() => {
                onSelectPage(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-[#3478F6] border border-blue-100 font-semibold shadow-2xs'
                  : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#3478F6]'
                      : 'text-[#64748B] group-hover:text-[#172033]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                    isActive
                      ? 'bg-[#3478F6]/10 text-[#3478F6] border-[#3478F6]/20'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#64748B] font-medium">NLP Service Status</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Standby / Mock
          </span>
        </div>
        <p className="text-[11px] text-[#64748B] leading-relaxed">
          FastAPI & Node.js contract verified.
        </p>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <aside className="hidden lg:flex lg:w-64 flex-col shrink-0">
        {content}
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out lg:hidden shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  );
}

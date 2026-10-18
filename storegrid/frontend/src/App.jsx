import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/landing/Navbar';
import HeroSection from './components/landing/HeroSection';
import FeaturesSection from './components/landing/FeaturesSection';
import WorkflowSection from './components/landing/WorkflowSection';
import Footer from './components/landing/Footer';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Toast from './components/common/Toast';
import FeedbackDetailModal from './components/dashboard/FeedbackDetailModal';
import SubmitFeedbackModal from './components/dashboard/SubmitFeedbackModal';
import OverviewView from './components/views/OverviewView';
import FeedbackView from './components/views/FeedbackView';
import NeedsReviewView from './components/views/NeedsReviewView';
import TrendsView from './components/views/TrendsView';
import SettingsView from './components/views/SettingsView';
import DatasetUploadView from './components/views/DatasetUploadView';
import {
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  ClipboardCheck,
  Settings,
  UploadCloud,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  getStores,
  getDashboardOverview,
  getFeedbackList,
  listDatasetBatches,
  updateFeedbackReview,
  resetFeedbackData,
  ApiError,
} from './services/feedbackService';

function normalizeError(err) {
  if (err instanceof ApiError) return err;
  const isNet = !err?.status && (err?.name === 'TypeError' || String(err?.message || '').toLowerCase().includes('fetch'));
  return new ApiError(err?.message || 'Unknown error occurred', err?.status || null, isNet);
}

export default function App() {
  // Navigation & Page State
  const [activeDashboardTab, setActiveDashboardTab] = useState('overview');
  const [activeNavSection, setActiveNavSection] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // References for scrolling
  const dashboardRef = useRef(null);
  const featuresRef = useRef(null);
  const workflowRef = useRef(null);

  // Global Scope Filters
  const [selectedStore, setSelectedStore] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('last7');
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  const [stores, setStores] = useState([]);
  const [batches, setBatches] = useState([]);

  // Table Search and Category/Priority Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // Data States
  const [overviewData, setOverviewData] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [apiError, setApiError] = useState(null);

  // Modal & Toast State
  const [activeFeedbackModal, setActiveFeedbackModal] = useState(null);
  const [isSubmitFeedbackOpen, setIsSubmitFeedbackOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Show Toast Helper
  const showToast = useCallback(({ type = 'info', title, message }) => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Fetch dashboard data reactively with cleanup
  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const [storeData, batchData, overview, list, reviews] = await Promise.all([
          stores.length === 0 ? getStores() : Promise.resolve(stores),
          listDatasetBatches().catch(() => []),
          getDashboardOverview({
            storeId: selectedStore,
            dateRange: selectedDateRange,
            batchId: selectedBatch,
          }),
          getFeedbackList({
            storeId: selectedStore,
            dateRange: selectedDateRange,
            category: selectedCategory,
            priority: selectedPriority,
            batchId: selectedBatch,
            search: searchQuery,
          }),
          getFeedbackList({
            storeId: selectedStore,
            dateRange: selectedDateRange,
            batchId: selectedBatch,
            needsReviewOnly: true,
          }),
        ]);

        if (isCurrent) {
          if (storeData && Array.isArray(storeData) && storeData.length > 0) {
            setStores(storeData);
          }
          if (batchData && Array.isArray(batchData)) {
            setBatches(batchData);
          }
          setOverviewData(overview);
          setFeedbackList(Array.isArray(list) ? list : []);
          setReviewList(Array.isArray(reviews) ? reviews : []);
          setApiError(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (isCurrent) {
          console.error('Failed to load dashboard data:', err);
          setApiError(normalizeError(err));
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isCurrent = false;
    };
  }, [
    selectedStore,
    selectedDateRange,
    selectedBatch,
    selectedCategory,
    selectedPriority,
    searchQuery,
    refreshToken,
  ]);

  // Explicit user-triggered refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [storeData, batchData, overview, list, reviews] = await Promise.all([
        getStores(),
        listDatasetBatches().catch(() => []),
        getDashboardOverview({
          storeId: selectedStore,
          dateRange: selectedDateRange,
          batchId: selectedBatch,
        }),
        getFeedbackList({
          storeId: selectedStore,
          dateRange: selectedDateRange,
          category: selectedCategory,
          priority: selectedPriority,
          batchId: selectedBatch,
          search: searchQuery,
        }),
        getFeedbackList({
          storeId: selectedStore,
          dateRange: selectedDateRange,
          batchId: selectedBatch,
          needsReviewOnly: true,
        }),
      ]);

      if (storeData && Array.isArray(storeData) && storeData.length > 0) {
        setStores(storeData);
      }
      if (batchData && Array.isArray(batchData)) {
        setBatches(batchData);
      }
      setOverviewData(overview);
      setFeedbackList(Array.isArray(list) ? list : []);
      setReviewList(Array.isArray(reviews) ? reviews : []);
      setApiError(null);

      const storeObj = stores.find((s) => s.id === selectedStore || s.code === selectedStore);
      showToast({
        type: 'success',
        title: 'Data Refreshed',
        message: `Live metrics updated for ${selectedStore === 'ALL' ? 'all stores' : storeObj?.name || selectedStore}.`,
      });
    } catch (err) {
      console.error('Refresh error:', err);
      const normErr = normalizeError(err);
      setApiError(normErr);
      showToast({
        type: 'error',
        title: normErr.isNetwork ? 'Connection Error' : `API Error (${normErr.status || 400})`,
        message: normErr.message || 'Could not refresh feedback records from backend.',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle Manual Classification Update
  const handleUpdateClassification = async (feedbackId, updates) => {
    try {
      await updateFeedbackReview(feedbackId, updates);
      showToast({
        type: 'success',
        title: 'Review Saved',
        message: `Feedback ${feedbackId} classification updated.`,
      });
      // Trigger state reload
      setRefreshToken((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to update classification:', err);
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not save feedback review.',
      });
    }
  };

  // Handle Mock Data Reset
  const handleResetData = () => {
    resetFeedbackData();
    setSelectedCategory('ALL');
    setSelectedPriority('ALL');
    setSearchQuery('');
    setRefreshToken((prev) => prev + 1);
  };

  // Smooth scroll and section navigation
  const scrollToSection = (sectionId) => {
    setActiveNavSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'dashboard') {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'features') {
      featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'workflow') {
      workflowRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'reviews') {
      setActiveDashboardTab('needs-review');
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'settings') {
      setActiveDashboardTab('settings');
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Tabs for the Dashboard Console
  const dashboardTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'dataset-upload', label: 'Dataset Upload', icon: UploadCloud },
    { id: 'feedback', label: 'Feedback Records', icon: MessageSquare },
    { id: 'trends', label: 'Trends & Priorities', icon: TrendingUp },
    {
      id: 'needs-review',
      label: 'Needs Review',
      icon: ClipboardCheck,
      badge: reviewList.length > 0 ? reviewList.length : null,
    },
    { id: 'settings', label: 'Settings & Architecture', icon: Settings },
  ];

  const pageTitles = {
    overview: {
      title: 'Store Operations Overview',
      subtitle: 'Understand what customers are telling your store in real-time.',
    },
    'dataset-upload': {
      title: 'Dataset Ingestion & Batch Triage',
      subtitle: 'Upload CSV, XLSX, or JSON feedback files with interactive column mapping.',
    },
    feedback: {
      title: 'Customer Feedback Explorer',
      subtitle: 'Complete database of Voice-of-Store feedback and NLP metadata.',
    },
    trends: {
      title: 'Trends & Priorities',
      subtitle: 'Identify recurring operational issues, timeline spikes, and volume surges.',
    },
    'needs-review': {
      title: 'Needs Review Queue',
      subtitle: 'Triage customer comments flagged with low AI classification confidence.',
    },
    settings: {
      title: 'Settings & Architecture',
      subtitle: 'Configure store parameters, NLP sensitivity, and API endpoints.',
    },
  };

  const currentTitleInfo =
    pageTitles[activeDashboardTab] || pageTitles.overview;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] font-sans antialiased selection:bg-[#3478F6]/20 selection:text-[#3478F6]">
      {/* 1. Global Minimal Light Navbar */}
      <Navbar
        activeSection={activeNavSection}
        onNavigate={scrollToSection}
        reviewQueueCount={reviewList.length}
      />

      {/* 2. Hero Section */}
      <HeroSection
        onExploreDashboard={() => scrollToSection('dashboard')}
        onReviewQueue={() => scrollToSection('reviews')}
        reviewQueueCount={reviewList.length}
      />

      {/* 3. Features Section */}
      <div ref={featuresRef}>
        <FeaturesSection />
      </div>

      {/* 4. Interactive Product Showcase / Live Dashboard Section */}
      <section
        id="dashboard"
        ref={dashboardRef}
        className="py-16 sm:py-24 border-t border-[#E2E8F0] relative bg-[#F8FAFC]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Showcase Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#3478F6] block mb-2">
                Voice-of-Store Console
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#172033] tracking-tight">
                Live StoreGrid Management Console
              </h2>
              <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-xl">
                Connected to StoreGrid Node.js backend (`http://localhost:5000`) and SQLite database.
              </p>
            </div>

            {/* Live API Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs text-[#64748B] shadow-2xs self-start sm:self-auto">
              <span className={`w-2 h-2 rounded-full ${apiError ? (apiError.isNetwork ? 'bg-red-500' : 'bg-amber-500') : 'bg-emerald-500 animate-pulse'}`} />
              <span className="font-medium text-[#172033]">
                {apiError
                  ? (apiError.isNetwork ? 'Backend Disconnected' : `API Error (${apiError.status || 400})`)
                  : 'Live Backend API Connected'}
              </span>
            </div>
          </div>

          {/* Console Container Frame */}
          <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-xl overflow-hidden">
            {/* Top Bar of the Console */}
            <Header
              pageTitle={currentTitleInfo.title}
              pageSubtitle={currentTitleInfo.subtitle}
              stores={stores}
              selectedStore={selectedStore}
              onSelectStore={(storeId) => {
                setSelectedStore(storeId);
                const found = stores.find((s) => s.id === storeId || s.code === storeId);
                showToast({
                  type: 'info',
                  title: 'Store Filter Switched',
                  message: storeId === 'ALL' ? 'Now viewing All Stores' : `Now viewing ${found?.name || storeId}`,
                });
              }}
              selectedDateRange={selectedDateRange}
              onSelectDateRange={(rangeId) => {
                setSelectedDateRange(rangeId);
              }}
              batches={batches}
              selectedBatch={selectedBatch}
              onSelectBatch={(batchId) => {
                setSelectedBatch(batchId);
                const found = batches.find((b) => b.id === batchId);
                showToast({
                  type: 'info',
                  title: 'Dataset Source Switched',
                  message: batchId === 'ALL' ? 'Viewing All Sources (Demo + Uploads)' : batchId === 'DEMO_ONLY' ? 'Viewing Synthetic Demo Records' : batchId === 'IMPORTED_ONLY' ? 'Viewing Imported Datasets' : `Viewing Batch: ${found?.filename || batchId}`,
                });
              }}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              reviewQueueCount={reviewList.length}
              onNavigateToReviews={() => setActiveDashboardTab('needs-review')}
              onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            />

            {/* Clear Error Banner distinguishing API Validation/Request Errors from Offline Connection Errors */}
            {apiError && (
              <div
                className={`mx-4 sm:mx-8 my-4 p-4 rounded-2xl ${
                  apiError.isNetwork
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                } border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${
                      apiError.isNetwork
                        ? 'bg-red-100 border-red-200 text-red-700'
                        : 'bg-amber-100 border-amber-200 text-amber-700'
                    } border flex items-center justify-center shrink-0`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${apiError.isNetwork ? 'text-red-900' : 'text-amber-900'}`}>
                      {apiError.isNetwork
                        ? 'Backend API Offline or Unreachable'
                        : `API Request Error (${apiError.status ? `HTTP ${apiError.status}` : 'Validation Failure'})`}
                    </p>
                    <p className={`text-xs ${apiError.isNetwork ? 'text-red-700' : 'text-amber-800'} mt-0.5 leading-relaxed`}>
                      {apiError.isNetwork
                        ? `${apiError.message || 'Unable to connect to backend'}. Please ensure the Node.js Express backend is running on http://localhost:5000.`
                        : apiError.message || 'The backend returned an error.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold ${
                    apiError.isNetwork
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  } text-white rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {apiError.isNetwork ? 'Retry Connection' : 'Retry Request'}
                </button>
              </div>
            )}

            {/* Dashboard Sub-navigation Tabs (Mobile / Tablet) */}
            <div className="lg:hidden px-4 sm:px-8 border-b border-[#E2E8F0] bg-white overflow-x-auto">
              <div className="flex items-center gap-2 py-2.5 min-w-max">
                {dashboardTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeDashboardTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDashboardTab(tab.id)}
                      className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                        isActive
                          ? 'bg-blue-50 text-[#3478F6] border border-blue-200 shadow-2xs'
                          : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.badge !== null && (
                        <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Console Body: Embedded Sidebar on Desktop + Active View Container */}
            <div className="flex">
              <Sidebar
                embedded={true}
                activePage={activeDashboardTab}
                onSelectPage={(pageId) => setActiveDashboardTab(pageId)}
                reviewQueueCount={reviewList.length}
              />

              {/* Active View Container */}
              <div className="flex-1 p-4 sm:p-8 bg-[#F8FAFC] min-w-0">
                {activeDashboardTab === 'overview' && (
                  <OverviewView
                    overviewData={overviewData}
                    feedbackList={feedbackList}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedPriority={selectedPriority}
                    onPriorityChange={setSelectedPriority}
                    onSelectFeedback={(item) => setActiveFeedbackModal(item)}
                    onViewAllFeedback={() => setActiveDashboardTab('feedback')}
                    onNavigateToReviews={() => setActiveDashboardTab('needs-review')}
                  />
                )}

                {activeDashboardTab === 'dataset-upload' && (
                  <DatasetUploadView
                    onSelectBatch={(batchId) => {
                      setSelectedBatch(batchId);
                      setRefreshToken((prev) => prev + 1);
                    }}
                    onNavigateToDashboard={(tab) => {
                      setActiveDashboardTab(tab || 'overview');
                    }}
                    onBatchImported={async () => {
                      const freshBatches = await listDatasetBatches().catch(() => []);
                      setBatches(freshBatches);
                    }}
                    onShowToast={showToast}
                  />
                )}


                {activeDashboardTab === 'feedback' && (
                  <FeedbackView
                    feedbackList={feedbackList}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedPriority={selectedPriority}
                    onPriorityChange={setSelectedPriority}
                    onSelectFeedback={(item) => setActiveFeedbackModal(item)}
                    isLoading={isLoading}
                    onShowToast={showToast}
                    onOpenSubmitModal={() => setIsSubmitFeedbackOpen(true)}
                  />
                )}

                {activeDashboardTab === 'trends' && (
                  <TrendsView
                    selectedStore={selectedStore}
                    selectedBatch={selectedBatch}
                  />
                )}

                {activeDashboardTab === 'needs-review' && (
                  <NeedsReviewView
                    reviewFeedbackList={reviewList}
                    onUpdateClassification={handleUpdateClassification}
                    onShowToast={showToast}
                  />
                )}

                {activeDashboardTab === 'settings' && (
                  <SettingsView
                    onResetData={handleResetData}
                    onShowToast={showToast}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Workflow Section */}
      <div ref={workflowRef}>
        <WorkflowSection />
      </div>

      {/* 6. Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* 7. Feedback Detail Modal */}
      <FeedbackDetailModal
        key={activeFeedbackModal?.feedbackId || activeFeedbackModal?.id || 'none'}
        feedback={activeFeedbackModal}
        isOpen={Boolean(activeFeedbackModal)}
        onClose={() => setActiveFeedbackModal(null)}
        onUpdateClassification={handleUpdateClassification}
      />

      {/* 7b. Submit Feedback Modal */}
      <SubmitFeedbackModal
        isOpen={isSubmitFeedbackOpen}
        onClose={() => setIsSubmitFeedbackOpen(false)}
        stores={stores}
        onSuccess={() => setRefreshToken((t) => t + 1)}
        onShowToast={showToast}
      />

      {/* 8. Toast Feedback Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* 9. Mobile Drawer Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activePage={activeDashboardTab}
        onSelectPage={(pageId) => setActiveDashboardTab(pageId)}
        reviewQueueCount={reviewList.length}
      />
    </div>
  );
}

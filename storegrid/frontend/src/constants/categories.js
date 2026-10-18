/**
 * StoreGrid Category Definitions - Premium Light Theme
 * Matching Python FastAPI NLP service and Node.js/Express backend identifiers.
 */

export const CATEGORIES = {
  STOCK_SHORTAGE: {
    id: 'STOCK_SHORTAGE',
    label: 'Stock Shortage',
    description: 'Empty shelves, missing items, out-of-stock dairy/produce/grocery',
    color: '#D97706', // amber-600
    bgLight: '#FEF3C7',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    barColor: 'bg-amber-500',
  },
  BILLING_DELAY: {
    id: 'BILLING_DELAY',
    label: 'Billing Delay',
    description: 'Long checkout queues, slow POS barcode scanner, cashier delays',
    color: '#3478F6', // professional blue
    bgLight: '#EFF6FF',
    badgeClass: 'bg-blue-50 text-[#3478F6] border-blue-200',
    barColor: 'bg-[#3478F6]',
  },
  STAFF_BEHAVIOUR: {
    id: 'STAFF_BEHAVIOUR',
    label: 'Staff Behaviour',
    description: 'Customer service, staff responsiveness, billing counter assistance',
    color: '#7C3AED', // violet-600
    bgLight: '#F5F3FF',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    barColor: 'bg-purple-600',
  },
  PRODUCT_QUALITY: {
    id: 'PRODUCT_QUALITY',
    label: 'Product Quality',
    description: 'Expired items, damaged packaging, rotten produce, stale bakery',
    color: '#E11D48', // rose-600
    bgLight: '#FFF1F2',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    barColor: 'bg-rose-500',
  },
  EQUIPMENT_FAILURE: {
    id: 'EQUIPMENT_FAILURE',
    label: 'Equipment Failure',
    description: 'Chiller/refrigerator breakdown, weighing scales, AC, cart wheels',
    color: '#0284C7', // sky-600
    bgLight: '#F0F9FF',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    barColor: 'bg-sky-600',
  },
  OTHER: {
    id: 'OTHER',
    label: 'Other',
    description: 'Store cleanliness, parking, general queries and uncategorized',
    color: '#64748B', // slate-500
    bgLight: '#F8FAFC',
    badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
    barColor: 'bg-slate-500',
  },
  NEEDS_REVIEW: {
    id: 'NEEDS_REVIEW',
    label: 'Needs Review',
    description: 'NLP confidence < 0.65 or multi-intent ambiguous feedback',
    color: '#EA580C', // orange-600
    bgLight: '#FFF7ED',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    barColor: 'bg-orange-500',
  },
};

export const OPERATIONAL_CATEGORIES = [
  'STOCK_SHORTAGE',
  'BILLING_DELAY',
  'STAFF_BEHAVIOUR',
  'PRODUCT_QUALITY',
  'EQUIPMENT_FAILURE',
  'OTHER',
];

export const PRIORITY_CONFIG = {
  CRITICAL: {
    label: 'Critical',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    dotColor: 'bg-red-500',
  },
  HIGH: {
    label: 'High',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
  },
  MEDIUM: {
    label: 'Medium',
    badgeClass: 'bg-blue-50 text-[#3478F6] border-blue-200',
    dotColor: 'bg-[#3478F6]',
  },
  LOW: {
    label: 'Low',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
};

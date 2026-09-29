export type NavigationTab = 
  | 'branch-overview'
  | 'preferred-flavors'
  | 'menu-studio'
  | 'staff-payroll'
  | 'inventory-supply'
  | 'settings-integrations';

export type LocationId = 'all' | 'tokyo' | 'nyc' | 'london' | 'dubai' | 'paris';

export interface LocationInfo {
  id: LocationId;
  name: string;
  code: string;
  region: string;
  currency: string;
  currencySymbol: string;
  taxLabel: string;
  tables: {
    occupied: number;
    total: number;
  };
  revenueToday: number;
  ordersPerHour: number;
  kitchenLatency: number;
  status: 'Peak Rush' | 'Surge Delivery' | 'Optimal' | 'Evening Prep' | 'Staged';
  channelSplit: {
    dineIn: number;
    delivery: number;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  japaneseTitle?: string;
  category: 'starters' | 'robata' | 'omakase' | 'cellar' | 'delivery';
  description: string;
  cogs: number;
  price: number;
  marginPercent: number;
  imageUrl: string;
  tags: string[];
  allergens: string[];
  pairing?: {
    name: string;
    vintage: string;
    addPrice: number;
  };
  has3DScan?: boolean;
}

export interface StaffMember {
  id: string;
  staffCode: string;
  name: string;
  avatar: string;
  outpost: string;
  department: 'kitchen' | 'service' | 'housekeeping' | 'bar';
  roleTitle: string;
  baseRetainer: number;
  extraLabel: string;
  extraAmount: number;
  netPayable: number;
  status: 'approved' | 'paid' | 'pending' | 'settled';
  statusText: string;
}

export interface JobRequisition {
  id: string;
  title: string;
  outpost: string;
  description: string;
  salaryBand: string;
  stage: string;
  badge: string;
  badgeColor: string;
  applicantsCount: number;
  subMetric: string;
  progressStep: number;
  leadEvaluator: string;
}

export interface LiveOrder {
  id: string;
  orderNumber: string;
  type: 'dine-in' | 'delivery';
  channel: string;
  tableOrAddress: string;
  outpost: string;
  itemsSummary: string;
  totalAmount: number;
  status: string;
  statusColor: 'primary' | 'secondary' | 'tertiary' | 'outline';
  timestamp: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: 'success' | 'info' | 'warning';
}

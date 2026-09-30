export type NavigationTab = 
  | 'branch-overview'
  | 'preferred-flavors'
  | 'menu-studio'
  | 'staff-payroll'
  | 'inventory-supply'
  | 'settings-integrations'
  | 'user-profile';

export type LocationId = 'all' | 'mumbai' | 'delhi' | 'bengaluru' | 'hyderabad' | 'kolkata' | 'chennai';

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
  hindiTitle?: string;
  category: 'starters' | 'tandoor' | 'omakase' | 'cellar' | 'delivery';
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

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Spices & Saffron' | 'Luxury Proteins' | 'Cellar & Spirits' | 'Tandoor & Fuel' | 'Dairy & Ghee';
  origin: string;
  stockOnHand: number;
  unit: string;
  parLevel: number;
  threshold?: number;
  unitCost: number;
  status: 'Low Stock Alert' | 'Restock Triggered' | 'Adequate Reserve' | 'Order Recommended' | 'Critical Stock Depletion' | 'Par Buffer Warning' | 'Optimal Par';
  burnRate: string;
  urgency: 'critical' | 'warning' | 'optimal';
  supplier: string;
  reorderLeadTime: string;
  lastRestocked?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: 'success' | 'info' | 'warning';
}

export interface InwardStockRecord {
  id: string;
  itemId: string;
  itemName: string;
  quantityAdded: number;
  unit: string;
  outpost: string;
  requirementReason: string;
  supplier: string;
  totalCost: number;
  timestamp: string;
}

export interface UserProfileData {
  employeeId: string;
  name: string;
  phone: string;
  email: string;
  roleTitle: string;
  outpost: string;
  avatarUrl: string;
  emergencyContact: string;
  dateOfJoining: string;
  clearanceLevel: string;
  payrollStatus: {
    cycle: string;
    baseRetainer: number;
    extraBonus: number;
    netPayable: number;
    paymentStatus: 'Dispatched (NEFT)' | 'Processing' | 'Held';
    utrNumber: string;
    bankAccountMasked: string;
    lastDisbursedDate: string;
  };
  overtimeStatus: {
    hoursLogged: number;
    hourlyMultiplier: string;
    overtimePay: number;
    festivalBonus: number;
    totalExtra: number;
    approvalOfficer: string;
    verificationStatus: 'Audited & Approved' | 'Pending Audit';
  };
}

export interface TeamMember {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  roleTitle: string;
  department: 'kitchen' | 'service' | 'housekeeping' | 'bar' | 'security';
  outpost: string;
  baseSalary: number;
  status: 'active' | 'banned' | 'on_leave';
  banReason?: string;
  bannedAt?: string;
  joinedDate: string;
}


export type NavigationTab = 
  | 'branch-overview'
  | 'kitchen-display'
  | 'preferred-flavors'
  | 'menu-studio'
  | 'staff-payroll'
  | 'inventory-supply'
  | 'gst-compliance'
  | 'vip-crm'
  | 'audit-security'
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

// ==========================================
// 1. Kitchen Display System (KDS) Types
// ==========================================
export type KDSStation = 'all' | 'tandoor' | 'awadhi_handi' | 'halwai_dessert' | 'sommelier_bar';
export type CourseStage = 'appetizer' | 'main' | 'dessert' | 'beverage';

export interface KDSTicketItem {
  id: string;
  name: string;
  hindiName?: string;
  quantity: number;
  station: KDSStation;
  course: CourseStage;
  customization?: string;
  isReady: boolean;
  allergenAlert?: string;
}

export interface KDSTicket {
  id: string;
  orderNumber: string;
  tableNumber: string;
  channel: 'Dine-In VIP' | 'Durbar Suite' | 'Swiggy Gourmet' | 'Zomato Gold';
  outpost: string;
  serverName: string;
  coversCount: number;
  items: KDSTicketItem[];
  createdAt: number; // timestamp in ms
  elapsedMinutes: number;
  status: 'cooking' | 'ready_for_pickup' | 'bumped';
  priority: 'normal' | 'rush' | 'vip';
  notes?: string;
}

// ==========================================
// 2. Financial GST & Reconciliation Types
// ==========================================
export interface GSTInvoice {
  id: string;
  invoiceNumber: string;
  irnNumber: string; // 64-char NIC Indian E-Invoice IRN
  date: string;
  customerName: string;
  customerGSTIN?: string;
  outpost: string;
  posTerminal: string;
  subtotal: number;
  taxType: 'intrastate' | 'interstate';
  cgstAmount: number; // 2.5%
  sgstAmount: number; // 2.5%
  igstAmount: number; // 5%
  totalAmount: number;
  paymentMethod: 'UPI' | 'Pine Labs POS' | 'Razorpay Direct' | 'Corporate Wire';
  transactionRef: string;
  reconciliationStatus: 'reconciled' | 'pending_match' | 'flagged';
  qrCodePayload: string;
}

export interface TDSRecord {
  id: string;
  beneficiaryName: string;
  panMasked: string;
  section: '192 (Salaries)' | '194C (Culinary Contractor)' | '194J (Sommelier Advisory)';
  grossDisbursement: number;
  tdsRatePercent: number;
  tdsDeducted: number;
  netPaid: number;
  challanBSR: string;
  depositStatus: 'Deposited (NSDL)' | 'Challan Staged';
  quarter: string;
}

// ==========================================
// 3. VIP Guest CRM & Allergen Shield Types
// ==========================================
export interface VIPGuestRecord {
  id: string;
  salutation: string;
  name: string;
  vipTier: 'Kohinoor Patron' | 'Maharaja Guild' | 'Durbar Member' | 'Heritage Reserve';
  phone: string;
  email: string;
  primaryOutpost: string;
  lifetimeSpend: number;
  visitsCount: number;
  preferredTable: string;
  dietaryPreference: 'Strict Jain' | 'Non-Vegetarian Halal' | 'Pescatarian' | 'Gluten-Free Pure';
  allergenFlags: string[];
  favoriteDishes: string[];
  preferredVintage: string;
  specialOccasion: string;
  conciergeNotes: string;
  lastVisitDate: string;
}

export interface AllergenHazard {
  id: string;
  allergenName: string;
  icon: string;
  severity: 'high' | 'medium';
  commonInDishes: string[];
  fssaiRegulationNote: string;
}

// ==========================================
// 4. Role-Based Access Control (RBAC) & Audit Types
// ==========================================
export type UserRole = 
  | 'super_admin'
  | 'general_manager'
  | 'corporate_chef'
  | 'procurement_lead'
  | 'floor_cashier';

export interface RolePermission {
  key: string;
  title: string;
  description: string;
  allowedRoles: UserRole[];
}

export interface SecurityAuditEntry {
  id: string;
  action: string;
  details: string;
  actorName: string;
  actorRole: UserRole;
  outpost: string;
  timestamp: string;
  ipAddress: string;
  hashSignature: string; // Cryptographic audit trail
  severity: 'critical' | 'warning' | 'info';
}

// ==========================================
// 5. Predictive Supply Chain & Automated PO Types
// ==========================================
export interface PredictiveParItem {
  id: string;
  ingredientName: string;
  category: string;
  currentStock: number;
  unit: string;
  weekendSurgeMultiplier: number;
  weatherFactor: string; // e.g. "Monsoon Rain Warning: +22% delivery surge"
  festivalFactor: string; // e.g. "Diwali Awadhi Gala: +35% lamb consumption"
  forecasted72hNeed: number;
  recommendedPOQty: number;
  primarySupplier: string;
  supplierPhone: string;
  urgency: 'critical' | 'advisory' | 'optimal';
}

export interface PurchaseOrderRecord {
  id: string;
  poNumber: string;
  supplierName: string;
  outpost: string;
  totalItems: number;
  estimatedCost: number;
  status: 'Dispatched to Vendor' | 'Acknowledged' | 'In Transit' | 'Fulfilled';
  dispatchChannel: 'WhatsApp Direct' | 'Email Purveyor Portal';
  dispatchedAt: string;
}


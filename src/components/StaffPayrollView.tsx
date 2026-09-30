import React, { useState } from 'react';
import { StaffMember, JobRequisition } from '../types';
import { INITIAL_STAFF, INITIAL_REQUISITIONS } from '../data/mockData';

interface StaffPayrollViewProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const StaffPayrollView: React.FC<StaffPayrollViewProps> = ({ onShowToast }) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF);
  const [requisitions, setRequisitions] = useState<JobRequisition[]>(INITIAL_REQUISITIONS);
  const [activeDepartment, setActiveDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Requisition form state
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Executive & Kitchen');
  const [newOutpost, setNewOutpost] = useState('Mumbai BKC Flagship');
  const [newShift, setNewShift] = useState('Dinner Service Split Shift');
  const [newSalary, setNewSalary] = useState('₹9,00,000 - ₹14,00,000 / yr');

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesDept =
      activeDepartment === 'all' ||
      (activeDepartment === 'kitchen' && (staff.roleTitle.toLowerCase().includes('chef') || staff.roleTitle.toLowerCase().includes('culinary'))) ||
      (activeDepartment === 'service' && (staff.roleTitle.toLowerCase().includes('captain') || staff.roleTitle.toLowerCase().includes('sommelier') || staff.roleTitle.toLowerCase().includes('director'))) ||
      (activeDepartment === 'housekeeping' && staff.roleTitle.toLowerCase().includes('hygiene')) ||
      (activeDepartment === 'bar' && staff.roleTitle.toLowerCase().includes('sommelier'));

    const matchesQuery =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.staffCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.outpost.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesQuery;
  });

  const handleSettleSingle = (id: string, name: string) => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'settled', statusText: 'Cleared via RTGS' } : s))
    );
    onShowToast('Salary Wire Dispatched', `Direct RTGS wire of remuneration initiated for ${name}.`);
  };

  const handleVerifySingle = (id: string, name: string) => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved', statusText: 'Approved (Pending Wire)' } : s))
    );
    onShowToast('Attendance & Overtime Verified', `Biometric log verified for ${name}. Status marked approved.`);
  };

  const handleSettleAllApproved = () => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.status === 'approved' ? { ...s, status: 'settled', statusText: 'Cleared via RTGS' } : s))
    );
    onShowToast('Batch Payout Authorized', 'Cleared all approved staff compensations across Indian metro nodes via corporate NEFT batch.');
  };

  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReq: JobRequisition = {
      id: `${Date.now()}`,
      title: newTitle,
      outpost: newOutpost,
      stage: 'Initial Screening',
      badge: 'Immediate Opening',
      badgeColor: 'bg-[#fef3c7] text-[#92400e]',
      description: `Lead station specialist required for high-velocity service. Responsible for recipe adherence, luxury presentation, and Indian metro hospitality standards.`,
      salaryBand: newSalary,
      applicantsCount: 0,
      subMetric: 'Just posted',
      progressStep: 1,
      leadEvaluator: 'Chef Ranveer / Adarsa P.',
    };

    setRequisitions([newReq, ...requisitions]);
    setIsModalOpen(false);
    setNewTitle('');
    onShowToast('Requisition Published', `Posted "${newReq.title}" for ${newReq.outpost}.`);
  };

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Top Banner & Department Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-[#92400e] uppercase tracking-widest bg-[#fef3c7] px-3 py-1 rounded-full border border-[#fde68a] font-bold shadow-xs">
              National Human Capital
            </span>
            <span className="text-[#78716c] text-xs">/</span>
            <span className="text-[10px] text-[#047857] uppercase tracking-wider font-bold bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-0.5 rounded-full">
              Settlement Cycle 04-B (INR)
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
            Staff Ecosystem, Payroll Settlement & Talent Acquisition
          </h1>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-3xl leading-relaxed">
            Unified treasury, tip-pooling matrix, and real-time culinary guild recruitment across Mumbai, Delhi, Bengaluru, and Hyderabad outposts.
          </p>
        </div>

        {/* Domain Navigation Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white border border-[#e8decb] p-1.5 rounded-2xl shadow-xs shrink-0">
          {[
            { id: 'all', label: 'All Departments' },
            { id: 'kitchen', label: 'Executive & Kitchen' },
            { id: 'service', label: 'Service & Floor' },
            { id: 'housekeeping', label: 'Sanitation & Housekeeping' },
            { id: 'bar', label: 'Bar & Sommelier' },
          ].map((dept) => (
            <button
              key={dept.id}
              onClick={() => setActiveDepartment(dept.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDepartment === dept.id
                  ? 'bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] text-[#92400e] border border-[#fde68a] shadow-xs'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f5]'
              }`}
              type="button"
            >
              {dept.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Headcount */}
        <div className="bg-white p-6 rounded-2xl border border-[#e8decb] shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-md hover:border-[#f59e0b]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#78716c] uppercase font-bold tracking-wider">
              Total Group Headcount
            </span>
            <span className="material-symbols-outlined text-[#b45309] text-xl">badge</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline font-bold text-3xl text-[#1c1917] leading-none font-mono">
              248
            </span>
            <span className="text-xs text-[#047857] font-bold flex items-center font-mono">
              <span className="material-symbols-outlined text-sm">arrow_upward</span>+8 net
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#57534e] pt-2 border-t border-[#f0ece1]">
            <span>Active in 6 Metros</span>
            <span className="text-[10px] text-[#78716c] font-bold uppercase tracking-wider">
              Mumbai • Delhi • BLR • HYD
            </span>
          </div>
        </div>

        {/* Card 2: Payroll Obligation */}
        <div className="bg-white p-6 rounded-2xl border border-[#e8decb] shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-md hover:border-[#f59e0b]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#78716c] uppercase font-bold tracking-wider">
              Monthly Payroll Obligation
            </span>
            <span className="material-symbols-outlined text-[#047857] text-xl">account_balance_wallet</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-headline font-bold text-3xl text-[#b45309] leading-none font-mono">
              ₹41,82,000
            </span>
            <span className="text-xs text-[#78716c] font-bold">INR</span>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="w-full bg-[#f0ece1] rounded-full h-2 overflow-hidden flex shadow-inner">
              <div className="bg-[#047857] h-full rounded-full transition-all duration-700" style={{ width: '77.4%' }} />
              <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: '22.6%' }} />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#047857] font-bold">Settled: ₹32,40,000</span>
              <span className="text-[#b45309] font-bold">Pending: ₹9,42,000</span>
            </div>
          </div>
        </div>

        {/* Card 3: Tips & Service Pool */}
        <div className="bg-white p-6 rounded-2xl border border-[#e8decb] shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-md hover:border-[#f59e0b]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#78716c] uppercase font-bold tracking-wider">
              Avg Floor Tip Pool / Mo
            </span>
            <span className="material-symbols-outlined text-[#ea580c] text-xl">local_bar</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline font-bold text-3xl text-[#1c1917] leading-none font-mono">
              ₹14,200
            </span>
            <span className="text-xs text-[#047857] font-bold flex items-center font-mono">
              <span className="material-symbols-outlined text-sm">trending_up</span>+12% vs L/M
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-1 border-t border-[#f0ece1] text-xs">
            <span className="text-[#57534e]">Guild Pool Retained</span>
            <svg className="h-5 w-20 text-[#b45309]" fill="none" stroke="currentColor" viewBox="0 0 100 24">
              <path d="M0 18 L20 16 L40 19 L60 9 L80 12 L100 3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Open Requisitions */}
        <div className="bg-white p-6 rounded-2xl border border-[#e8decb] shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-md hover:border-[#f59e0b]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#78716c] uppercase font-bold tracking-wider">
              Talent Acquisition Portal
            </span>
            <span className="material-symbols-outlined text-[#b91c1c] text-xl">person_search</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline font-bold text-3xl text-[#1c1917] leading-none font-mono">
              {requisitions.length + 14}
            </span>
            <span className="text-xs text-[#b91c1c] font-bold">Active Openings</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#57534e] pt-2 border-t border-[#f0ece1]">
            <span>57 Stage-1 Interviews</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fef2f2] text-[#991b1b] font-bold border border-[#fecaca]">
              4 Fast-Track
            </span>
          </div>
        </div>
      </div>

      {/* Staff Ledger & Settlement Clearance */}
      <div className="bg-white rounded-2xl border border-[#e8decb] shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] overflow-hidden flex flex-col">
        {/* Header of Table Container with Bulk Actions */}
        <div className="p-6 bg-[#faf8f5] border-b border-[#e8decb] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-8 bg-[#f59e0b] rounded-full" />
            <div>
              <h2 className="font-headline font-bold text-base sm:text-lg text-[#1c1917]">
                Staff Ledger & Settlement Clearance
              </h2>
              <p className="text-xs text-[#57534e]">
                Live audit ledger of base compensations, service charges, festival bonuses, and dual-authorization payouts in Indian Rupees.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSettleAllApproved}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Settle All Approved (142 Staff)</span>
            </button>
            <button
              onClick={() => onShowToast('Bank Batch Wire Generated', 'Formatted RTGS / NEFT corporate payment file generated for banking transmission.')}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#faf8f5] text-[#1c1917] text-xs font-bold border border-[#e8decb] hover:border-[#b45309]/30 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#78716c]">file_download</span>
              <span>Export NEFT Batch File</span>
            </button>
            <button
              onClick={() => onShowToast('Digital Salary Slips Dispatched', '248 Form 16 compliant digital paystubs dispatched to employee WhatsApp/email.')}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#faf8f5] text-[#1c1917] text-xs font-bold border border-[#e8decb] hover:border-[#b45309]/30 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#78716c]">receipt_long</span>
              <span>Generate Paystubs (Form 16)</span>
            </button>
          </div>
        </div>

        {/* Real-time Filter & Search Sub-bar */}
        <div className="px-6 py-3 bg-white border-b border-[#f0ece1] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
            <span className="material-symbols-outlined text-[#78716c] text-lg">search</span>
            <input
              type="text"
              placeholder="Search by staff name, role, or staff ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#faf8f5] text-[#1c1917] placeholder:text-[#78716c] text-xs px-3.5 py-2 rounded-xl border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
            />
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#78716c] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#047857]" /> Direct NEFT Ready
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Pending Sign-off
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#78716c]" /> Dispatched
            </span>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#faf8f5] text-[#78716c] text-[10px] uppercase tracking-wider border-b border-[#e8decb]">
                <th className="py-3 px-6">Employee & Outpost</th>
                <th className="py-3 px-4">Department Role</th>
                <th className="py-3 px-4">Base Retainer</th>
                <th className="py-3 px-4">Overtime / Gratuity</th>
                <th className="py-3 px-4">Net Payable</th>
                <th className="py-3 px-4">Settlement Status</th>
                <th className="py-3 px-6 text-right">Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece1] text-xs text-[#1c1917]">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-[#faf8f5] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-[#e8decb]"
                        alt={staff.name}
                        src={staff.avatar}
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col">
                        <span className="font-headline font-bold text-sm text-[#1c1917] group-hover:text-[#b45309] transition-colors">
                          {staff.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#78716c]">
                          <span className="font-mono font-bold text-[#b45309]">{staff.staffCode}</span>
                          <span>•</span>
                          <span className="text-[#57534e]">{staff.outpost}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-[#faf8f5] text-[#1c1917] text-[11px] font-bold border border-[#e8decb] shadow-2xs">
                      {staff.roleTitle}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-[#1c1917] font-bold text-sm">
                    ₹{staff.baseRetainer.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col font-mono">
                      <span className="text-[#047857] font-bold">
                        +₹{staff.extraAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-[#78716c] font-sans">{staff.extraLabel}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-sm text-[#b45309]">
                    ₹{staff.netPayable.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                        staff.status === 'settled' || staff.status === 'paid'
                          ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                          : staff.status === 'approved'
                          ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                          : 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          staff.status === 'approved'
                            ? 'bg-[#f59e0b] animate-pulse'
                            : staff.status === 'pending'
                            ? 'bg-[#dc2626]'
                            : 'bg-[#047857]'
                        }`}
                      />
                      {staff.statusText}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {staff.status === 'approved' ? (
                      <button
                        type="button"
                        onClick={() => handleSettleSingle(staff.id, staff.name)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white font-bold text-xs shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                      >
                        Settle Now
                      </button>
                    ) : staff.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => handleVerifySingle(staff.id, staff.name)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#b45309] font-bold text-xs border border-[#e8decb] hover:border-[#b45309]/30 transition-all cursor-pointer"
                      >
                        Audit & Verify
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onShowToast('UTR Number #IN882', `Retrieved RTGS confirmation UTR for ${staff.name}.`)}
                        className="px-3 py-1.5 rounded-xl bg-[#faf8f5] text-[#78716c] hover:text-[#1c1917] text-xs font-mono border border-[#e8decb] transition-colors cursor-pointer"
                      >
                        UTR #{Math.floor(100000 + Math.random() * 899999)}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-[#faf8f5] border-t border-[#e8decb] flex flex-wrap items-center justify-between text-xs text-[#78716c]">
          <div className="flex items-center gap-2">
            <span>Showing {filteredStaff.length} of 248 staff entries across Indian outposts</span>
            <span>•</span>
            <span className="text-[#047857] font-bold">Auto-synced with RBI RTGS & Corporate Treasury</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 rounded-lg bg-white border border-[#e8decb] text-[#1c1917] hover:bg-[#f5efe4]" type="button">
              Previous
            </button>
            <span className="px-3 py-1 rounded-lg font-bold text-[#92400e] bg-[#fef3c7] border border-[#fde68a]">1</span>
            <button className="px-3 py-1 rounded-lg bg-white border border-[#e8decb] text-[#1c1917] hover:bg-[#f5efe4]" type="button">
              2
            </button>
            <button className="px-3 py-1 rounded-lg bg-white border border-[#e8decb] text-[#1c1917] hover:bg-[#f5efe4]" type="button">
              3
            </button>
            <button className="px-3 py-1 rounded-lg bg-white border border-[#e8decb] text-[#1c1917] hover:bg-[#f5efe4]" type="button">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Global Talent Hiring & Department Recruitment Pipeline */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#f0ece1]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#78716c]">
                National Talent Pipeline
              </span>
            </div>
            <h2 className="font-headline font-bold text-base sm:text-lg text-[#1c1917]">
              Department Requisitions & Candidate Funnel
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>+ Post New Job Requisition</span>
          </button>
        </div>

        {/* Active Requisitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {requisitions.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-[#e8decb] p-5 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] flex flex-col justify-between hover:border-[#f59e0b]/50 hover:-translate-y-1 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                    req.badgeColor.includes('fef3c7')
                      ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                      : req.badgeColor.includes('ecfdf5')
                      ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                      : 'bg-[#faf8f5] text-[#78716c] border-[#e8decb]'
                  }`}>
                    {req.badge}
                  </span>
                  <span className="text-[11px] text-[#78716c] font-bold">{req.outpost}</span>
                </div>
                <h3 className="font-headline font-bold text-sm sm:text-base text-[#1c1917] group-hover:text-[#b45309] transition-colors">
                  {req.title}
                </h3>
                <p className="text-xs text-[#57534e] mt-1 leading-relaxed">{req.description}</p>
                <div className="mt-3 font-mono text-xs font-bold text-[#b45309]">{req.salaryBand}</div>
              </div>

              <div className="mt-4 space-y-2 border-t border-[#f0ece1] pt-3">
                <div className="flex items-center justify-between text-[11px] text-[#78716c]">
                  <span className="font-bold text-[#1c1917]">{req.applicantsCount} Applicants</span>
                  <span className="text-[#047857] font-bold">{req.subMetric}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`rounded-full ${
                        step <= req.progressStep ? 'bg-[#047857]' : 'bg-[#e8ded0]'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-[#78716c]">Lead: {req.leadEvaluator}</span>
                  <button
                    type="button"
                    onClick={() => onShowToast('Candidate Review Mode', `Reviewing ${req.applicantsCount} candidates for ${req.title}.`)}
                    className="text-[#b45309] text-xs font-bold hover:underline flex items-center cursor-pointer"
                  >
                    Review ({req.applicantsCount}) →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post New Job Requisition Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-[#e8decb] max-w-xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-6 bg-[#f59e0b] rounded-full" />
                <h3 className="font-headline font-bold text-lg text-[#1c1917]">
                  Post New Staff Requisition
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#78716c] hover:text-[#1c1917] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-xs text-[#57534e]">
              Define role parameters, metro outpost allocation, CTC pay scale tier in INR, and operational shift cadence.
            </p>

            <form onSubmit={handleCreateRequisition} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#78716c] mb-1">
                  Role Position Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Tandoor Ustad / Royal Captain"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-xs border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#78716c] mb-1">
                    Department
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-xs border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                  >
                    <option value="Executive & Kitchen">Executive & Kitchen</option>
                    <option value="Service & Floor">Service & Floor Staff</option>
                    <option value="Bar & Sommelier">Bar & Sommelier Guild</option>
                    <option value="Sanitation & Housekeeping">Sanitation & Housekeeping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#78716c] mb-1">
                    Target Metro Outpost
                  </label>
                  <select
                    value={newOutpost}
                    onChange={(e) => setNewOutpost(e.target.value)}
                    className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-xs border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                  >
                    <option value="Mumbai BKC Flagship">Mumbai BKC Flagship</option>
                    <option value="New Delhi Lutyens">New Delhi Lutyens</option>
                    <option value="Bengaluru Indiranagar">Bengaluru Indiranagar</option>
                    <option value="Hyderabad Jubilee Hills">Hyderabad Jubilee Hills</option>
                    <option value="Kolkata Park Street">Kolkata Park Street</option>
                    <option value="Chennai Nungambakkam">Chennai Nungambakkam</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#78716c] mb-1">
                    Shift Schedule Type
                  </label>
                  <select
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-xs border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                  >
                    <option value="Dinner Service Split Shift">Dinner Split Shift (16:00 - Close)</option>
                    <option value="Day Halwai & Marination Turnaround">Day Halwai & Prep (06:00 - 15:00)</option>
                    <option value="Full Service Variable Rotation">Full Service Variable Rotation</option>
                    <option value="Night Closing Sanitation">Night Closing (22:00 - 05:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#78716c] mb-1">
                    Target CTC Band (INR)
                  </label>
                  <select
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-xs border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                  >
                    <option value="₹6,00,000 - ₹9,00,000 / yr">Tier 1 (₹6L - ₹9L + Gratuity)</option>
                    <option value="₹9,00,000 - ₹14,00,000 / yr">Tier 2 (₹9L - ₹14L + Pool)</option>
                    <option value="₹16,00,000 - ₹24,00,000 / yr">Executive Tier (₹16L - ₹24L)</option>
                    <option value="Hourly Guild Apprentice">Hotel School Stagiaire</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#f0ece1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#57534e] text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Publish Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

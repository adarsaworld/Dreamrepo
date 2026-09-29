import React, { useState } from 'react';
import { StaffMember, JobRequisition } from '../types';
import { INITIAL_STAFF, INITIAL_REQUISITIONS } from '../data/mockData';

interface StaffPayrollViewProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const StaffPayrollView: React.FC<StaffPayrollViewProps> = ({ onShowToast }) => {
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [requisitions, setRequisitions] = useState<JobRequisition[]>(INITIAL_REQUISITIONS);
  const [activeDepartment, setActiveDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Requisition Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Executive & Kitchen');
  const [newOutpost, setNewOutpost] = useState('Mumbai BKC Flagship');
  const [newShift, setNewShift] = useState('Dinner Service Split Shift');
  const [newSalary, setNewSalary] = useState('₹12,00,000 - ₹16,00,000 / yr');

  // Filter staff rows
  const filteredStaff = staffList.filter((s) => {
    const matchesDept = activeDepartment === 'all' || s.department === activeDepartment;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.staffCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.outpost.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleSettleSingle = (id: string, name: string) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'settled',
              statusText: 'Settled (NEFT Transfer)',
            }
          : s
      )
    );
    onShowToast('Payroll Settled', `Direct NEFT transfer authorization executed for ${name}.`);
  };

  const handleVerifySingle = (id: string, name: string) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'approved',
              statusText: 'Approved - Ready to Pay',
            }
          : s
      )
    );
    onShowToast('Manager Sign-Off Recorded', `Tip pool verification approved for ${name}.`, 'info');
  };

  const handleSettleAllApproved = () => {
    setStaffList((prev) =>
      prev.map((s) => (s.status === 'approved' ? { ...s, status: 'settled', statusText: 'Settled (NEFT Batch)' } : s))
    );
    onShowToast('Batch NEFT Wire Clearance Executed', 'Dispatched ₹32,40,000 across HDFC & ICICI Corporate Treasury nodes.');
  };

  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: JobRequisition = {
      id: `req-${Date.now()}`,
      title: newTitle,
      outpost: newOutpost,
      description: `${newDept} • ${newShift}. Competitive luxury hotel benefits and guild pooling.`,
      salaryBand: newSalary,
      stage: '0 in Review',
      badge: 'Screening Stage',
      badgeColor: 'bg-primary/20 text-primary',
      applicantsCount: 1,
      subMetric: 'Just Posted',
      progressStep: 1,
      leadEvaluator: 'Chef Sanjeev Mehra',
    };
    setRequisitions([newReq, ...requisitions]);
    setIsModalOpen(false);
    setNewTitle('');
    onShowToast('Job Requisition Published', `Routing "${newTitle}" across national culinary institutes and guilds.`);
  };

  return (
    <div className="flex flex-col w-full space-y-8 relative">
      <div className="absolute -top-10 left-1/4 w-96 h-96 bg-[#ffc174]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-12 right-10 w-80 h-80 bg-[#56e5a9]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Executive Title & Sub-action Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-[#ffc174] uppercase tracking-widest bg-[#f59e0b]/15 px-2.5 py-0.5 rounded-full border border-[#f59e0b]/30 font-bold">
              National Human Capital
            </span>
            <span className="text-[#a08e7a] text-xs">/</span>
            <span className="text-[10px] text-[#56e5a9] uppercase tracking-wider font-bold">
              Settlement Cycle 04-B (INR)
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#e3e2e3] tracking-tight">
            Staff Ecosystem, Payroll Settlement & Talent Acquisition
          </h1>
          <p className="text-xs sm:text-sm text-[#d8c3ad] max-w-3xl leading-relaxed">
            Unified treasury, tip-pooling matrix, and real-time culinary guild recruitment across Mumbai, Delhi, Bengaluru, and Hyderabad outposts.
          </p>
        </div>

        {/* Domain Navigation Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#1b1c1d] border border-[#292a2b] p-1.5 rounded-xl shadow-md shrink-0">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeDepartment === dept.id
                  ? 'bg-[#ffc174] text-[#472a00] shadow-sm'
                  : 'text-[#d8c3ad] hover:text-[#e3e2e3] hover:bg-[#292a2b]'
              }`}
              type="button"
            >
              {dept.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Headcount */}
        <div className="bg-[#1b1c1d]/90 backdrop-blur-md p-5 rounded-xl border border-[#292a2b] shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-[#ffc174]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold tracking-wider">
              Total Group Headcount
            </span>
            <span className="material-symbols-outlined text-[#ffc174] text-xl">badge</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline font-bold text-3xl text-[#e3e2e3] leading-none font-mono">
              248
            </span>
            <span className="text-xs text-[#56e5a9] font-semibold flex items-center font-mono">
              <span className="material-symbols-outlined text-sm">arrow_upward</span>+8 net
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#d8c3ad] pt-2 border-t border-[#292a2b]">
            <span>Active in 6 Metros</span>
            <span className="text-[10px] text-[#a08e7a] font-bold uppercase tracking-wider">
              Mumbai • Delhi • BLR • HYD
            </span>
          </div>
        </div>

        {/* Card 2: Payroll Obligation */}
        <div className="bg-[#1b1c1d]/90 backdrop-blur-md p-5 rounded-xl border border-[#292a2b] shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-[#ffc174]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold tracking-wider">
              Monthly Payroll Obligation
            </span>
            <span className="material-symbols-outlined text-[#56e5a9] text-xl">account_balance_wallet</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-headline font-bold text-3xl text-[#e3e2e3] leading-none font-mono">
              ₹41,82,000
            </span>
            <span className="text-xs text-[#a08e7a]">INR</span>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="w-full bg-[#343536] rounded-full h-2 overflow-hidden flex">
              <div className="bg-[#56e5a9] h-full rounded-full transition-all duration-700" style={{ width: '77.4%' }} />
              <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: '22.6%' }} />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#56e5a9]">Settled: ₹32,40,000</span>
              <span className="text-[#ffc174] font-semibold">Pending: ₹9,42,000</span>
            </div>
          </div>
        </div>

        {/* Card 3: Tips & Service Pool */}
        <div className="bg-[#1b1c1d]/90 backdrop-blur-md p-5 rounded-xl border border-[#292a2b] shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-[#ffc174]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold tracking-wider">
              Avg Floor Tip Pool / Mo
            </span>
            <span className="material-symbols-outlined text-[#f59e0b] text-xl">local_bar</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline font-bold text-3xl text-[#e3e2e3] leading-none font-mono">
              ₹14,200
            </span>
            <span className="text-xs text-[#56e5a9] font-semibold flex items-center font-mono">
              <span className="material-symbols-outlined text-sm">trending_up</span>+12% vs L/M
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-1 border-t border-[#292a2b] text-xs">
            <span className="text-[#d8c3ad]">Guild Pool Retained</span>
            <svg className="h-5 w-20 text-[#ffc174]" fill="none" stroke="currentColor" viewBox="0 0 100 24">
              <path d="M0 18 L20 16 L40 19 L60 9 L80 12 L100 3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Open Requisitions */}
        <div className="bg-[#1b1c1d]/90 backdrop-blur-md p-5 rounded-xl border border-[#292a2b] shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-[#ffc174]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold tracking-wider">
              Talent Acquisition Portal
            </span>
            <span className="material-symbols-outlined text-[#ffb3b6] text-xl">person_search</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline font-bold text-3xl text-[#e3e2e3] leading-none font-mono">
              {requisitions.length + 14}
            </span>
            <span className="text-xs text-[#ffb3b6] font-semibold">Active Openings</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#d8c3ad] pt-2 border-t border-[#292a2b]">
            <span>57 Stage-1 Interviews</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#cc003c]/20 text-[#ffb3b6] font-bold">
              4 Fast-Track
            </span>
          </div>
        </div>
      </div>

      {/* Staff Ledger & Settlement Clearance */}
      <div className="bg-[#1b1c1d]/80 backdrop-blur-xl rounded-xl border border-[#292a2b] shadow-xl overflow-hidden flex flex-col">
        {/* Header of Table Container with Bulk Actions */}
        <div className="p-6 bg-[#0d0e0f]/70 border-b border-[#292a2b] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-8 bg-[#ffc174] rounded-full" />
            <div>
              <h2 className="font-headline font-bold text-base sm:text-lg text-[#e3e2e3]">
                Staff Ledger & Settlement Clearance
              </h2>
              <p className="text-xs text-[#d8c3ad]">
                Live audit ledger of base compensations, service charges, festival bonuses, and dual-authorization payouts in Indian Rupees.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSettleAllApproved}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ffc174] text-[#472a00] text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Settle All Approved (142 Staff)</span>
            </button>
            <button
              onClick={() => onShowToast('Bank Batch Wire Generated', 'Formatted RTGS / NEFT corporate payment file generated for banking transmission.')}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold border border-[#343536] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#a08e7a]">file_download</span>
              <span>Export NEFT Batch File</span>
            </button>
            <button
              onClick={() => onShowToast('Digital Salary Slips Dispatched', '248 Form 16 compliant digital paystubs dispatched to employee WhatsApp/email.')}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold border border-[#343536] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#a08e7a]">receipt_long</span>
              <span>Generate Paystubs (Form 16)</span>
            </button>
          </div>
        </div>

        {/* Real-time Filter & Search Sub-bar */}
        <div className="px-6 py-2.5 bg-[#292a2b]/40 border-b border-[#343536] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
            <span className="material-symbols-outlined text-[#a08e7a] text-lg">search</span>
            <input
              type="text"
              placeholder="Search by staff name, role, or staff ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1f2021] text-[#e3e2e3] placeholder:text-[#a08e7a] text-xs px-3 py-1.5 rounded-lg border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
            />
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#a08e7a]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#56e5a9]" /> Direct NEFT Ready
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Pending Sign-off
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#39393a]" /> Dispatched
            </span>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0d0e0f]/80 text-[#a08e7a] text-[10px] uppercase tracking-wider border-b border-[#292a2b]">
                <th className="py-3 px-6">Employee & Outpost</th>
                <th className="py-3 px-4">Department Role</th>
                <th className="py-3 px-4">Base Retainer</th>
                <th className="py-3 px-4">Overtime / Gratuity</th>
                <th className="py-3 px-4">Net Payable</th>
                <th className="py-3 px-4">Settlement Status</th>
                <th className="py-3 px-6 text-right">Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292a2b] text-xs">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-[#292a2b]/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-10 h-10 rounded-full object-cover shadow-md ring-1 ring-[#343536]"
                        alt={staff.name}
                        src={staff.avatar}
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col">
                        <span className="font-headline font-bold text-sm text-[#e3e2e3] group-hover:text-[#ffc174] transition-colors">
                          {staff.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#a08e7a]">
                          <span>{staff.staffCode}</span>
                          <span>•</span>
                          <span className="text-[#d8c3ad]">{staff.outpost}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#292a2b] text-[#ffc174] text-[11px] font-semibold border border-[#343536]">
                      {staff.roleTitle}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-[#e3e2e3] font-semibold text-sm">
                    ₹{staff.baseRetainer.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col font-mono">
                      <span className="text-[#56e5a9] font-semibold">
                        +₹{staff.extraAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-[#a08e7a] font-sans">{staff.extraLabel}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-sm text-[#e3e2e3]">
                    ₹{staff.netPayable.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        staff.status === 'settled' || staff.status === 'paid'
                          ? 'bg-[#56e5a9]/15 text-[#56e5a9]'
                          : staff.status === 'approved'
                          ? 'bg-[#f59e0b]/20 text-[#ffc174]'
                          : 'bg-[#cc003c]/20 text-[#ffb3b6]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          staff.status === 'approved'
                            ? 'bg-[#f59e0b] animate-pulse'
                            : staff.status === 'pending'
                            ? 'bg-[#cc003c]'
                            : 'bg-[#56e5a9]'
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
                        className="px-3.5 py-1.5 rounded-lg bg-[#ffc174] text-[#472a00] font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                      >
                        Settle Now
                      </button>
                    ) : staff.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => handleVerifySingle(staff.id, staff.name)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#292a2b] hover:bg-[#ffc174] hover:text-[#472a00] text-[#ffc174] font-semibold text-xs border border-[#343536] transition-all cursor-pointer"
                      >
                        Audit & Verify
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onShowToast('UTR Number #IN882', `Retrieved RTGS confirmation UTR for ${staff.name}.`)}
                        className="px-3 py-1.5 rounded-lg bg-[#1f2021] text-[#a08e7a] hover:text-[#e3e2e3] text-xs font-mono border border-[#292a2b] transition-colors cursor-pointer"
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
        <div className="p-4 bg-[#0d0e0f]/90 border-t border-[#292a2b] flex flex-wrap items-center justify-between text-xs text-[#a08e7a]">
          <div className="flex items-center gap-2">
            <span>Showing {filteredStaff.length} of 248 staff entries across Indian outposts</span>
            <span>•</span>
            <span className="text-[#56e5a9] font-medium">Auto-synced with RBI RTGS & Corporate Treasury</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded bg-[#292a2b] text-[#e3e2e3] hover:bg-[#343536]" type="button">
              Previous
            </button>
            <span className="px-2.5 py-1 font-bold text-[#ffc174]">1</span>
            <button className="px-2.5 py-1 rounded bg-[#292a2b] text-[#e3e2e3] hover:bg-[#343536]" type="button">
              2
            </button>
            <button className="px-2.5 py-1 rounded bg-[#292a2b] text-[#e3e2e3] hover:bg-[#343536]" type="button">
              3
            </button>
            <button className="px-2.5 py-1 rounded bg-[#292a2b] text-[#e3e2e3] hover:bg-[#343536]" type="button">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Global Talent Hiring & Department Recruitment Pipeline */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#292a2b]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#cc003c]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a08e7a]">
                National Talent Pipeline
              </span>
            </div>
            <h2 className="font-headline font-bold text-base sm:text-lg text-[#e3e2e3]">
              Department Requisitions & Candidate Funnel
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ffc174] text-[#472a00] text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
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
              className="bg-[#1b1c1d]/90 backdrop-blur-md rounded-xl border border-[#292a2b] p-5 shadow-lg flex flex-col justify-between hover:border-[#ffc174]/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${req.badgeColor}`}>
                    {req.badge}
                  </span>
                  <span className="text-[11px] text-[#a08e7a] font-medium">{req.outpost}</span>
                </div>
                <h3 className="font-headline font-bold text-sm sm:text-base text-[#e3e2e3] group-hover:text-[#ffc174] transition-colors">
                  {req.title}
                </h3>
                <p className="text-xs text-[#d8c3ad] mt-1 leading-relaxed">{req.description}</p>
                <div className="mt-3 font-mono text-xs font-bold text-[#ffc174]">{req.salaryBand}</div>
              </div>

              <div className="mt-4 space-y-2 border-t border-[#292a2b] pt-3">
                <div className="flex items-center justify-between text-[11px] text-[#a08e7a]">
                  <span>{req.applicantsCount} Applicants</span>
                  <span className="text-[#56e5a9] font-semibold">{req.subMetric}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`rounded-full ${
                        step <= req.progressStep ? 'bg-[#56e5a9]' : 'bg-[#343536]'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-[#a08e7a]">Lead: {req.leadEvaluator}</span>
                  <button
                    type="button"
                    onClick={() => onShowToast('Candidate Review Mode', `Reviewing ${req.applicantsCount} candidates for ${req.title}.`)}
                    className="text-[#ffc174] text-xs font-semibold hover:underline flex items-center"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1b1c1d] border border-[#292a2b] max-w-xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#292a2b]">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-6 bg-[#ffc174] rounded-full" />
                <h3 className="font-headline font-bold text-lg text-[#e3e2e3]">
                  Post New Staff Requisition
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#a08e7a] hover:text-[#e3e2e3]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-xs text-[#d8c3ad]">
              Define role parameters, metro outpost allocation, CTC pay scale tier in INR, and operational shift cadence.
            </p>

            <form onSubmit={handleCreateRequisition} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a08e7a] mb-1">
                  Role Position Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Tandoor Ustad / Royal Captain"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-xs border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a08e7a] mb-1">
                    Department
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-xs border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                  >
                    <option value="Executive & Kitchen">Executive & Kitchen</option>
                    <option value="Service & Floor">Service & Floor Staff</option>
                    <option value="Bar & Sommelier">Bar & Sommelier Guild</option>
                    <option value="Sanitation & Housekeeping">Sanitation & Housekeeping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a08e7a] mb-1">
                    Target Metro Outpost
                  </label>
                  <select
                    value={newOutpost}
                    onChange={(e) => setNewOutpost(e.target.value)}
                    className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-xs border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a08e7a] mb-1">
                    Shift Schedule Type
                  </label>
                  <select
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-xs border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                  >
                    <option value="Dinner Service Split Shift">Dinner Split Shift (16:00 - Close)</option>
                    <option value="Day Halwai & Marination Turnaround">Day Halwai & Prep (06:00 - 15:00)</option>
                    <option value="Full Service Variable Rotation">Full Service Variable Rotation</option>
                    <option value="Night Closing Sanitation">Night Closing (22:00 - 05:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a08e7a] mb-1">
                    Target CTC Band (INR)
                  </label>
                  <select
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-xs border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                  >
                    <option value="₹6,00,000 - ₹9,00,000 / yr">Tier 1 (₹6L - ₹9L + Gratuity)</option>
                    <option value="₹9,00,000 - ₹14,00,000 / yr">Tier 2 (₹9L - ₹14L + Pool)</option>
                    <option value="₹16,00,000 - ₹24,00,000 / yr">Executive Tier (₹16L - ₹24L)</option>
                    <option value="Hourly Guild Apprentice">Hotel School Stagiaire</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#292a2b]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ffc174] text-[#472a00] text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
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

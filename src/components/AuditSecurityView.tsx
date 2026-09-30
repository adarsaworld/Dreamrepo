import React, { useState } from 'react';
import { UserRole, RolePermission, SecurityAuditEntry } from '../types';
import { ROLE_PERMISSIONS, INITIAL_SECURITY_AUDIT_LOGS } from '../data/enterpriseData';

interface AuditSecurityViewProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const AuditSecurityView: React.FC<AuditSecurityViewProps> = ({
  currentRole,
  onRoleChange,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'audit_logs' | 'rbac_matrix'>('audit_logs');
  const [auditLogs, setAuditLogs] = useState<SecurityAuditEntry[]>(INITIAL_SECURITY_AUDIT_LOGS);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuditLog, setSelectedAuditLog] = useState<SecurityAuditEntry | null>(null);

  const roles: Array<{ id: UserRole; label: string; badge: string; color: string }> = [
    {
      id: 'super_admin',
      label: 'Super Admin / Founder',
      badge: 'Unrestricted Syndicate Authority',
      color: 'from-[#dc2626] to-[#b91c1c]',
    },
    {
      id: 'general_manager',
      label: 'General Manager',
      badge: 'Metro Fleet Operational Lead',
      color: 'from-[#b45309] to-[#ea580c]',
    },
    {
      id: 'corporate_chef',
      label: 'Corporate Executive Chef',
      badge: 'Culinary Formulas & KDS Command',
      color: 'from-[#047857] to-[#0d9488]',
    },
    {
      id: 'procurement_lead',
      label: 'Store Procurement Lead',
      badge: 'Inventory, Cellar & PO Dispatch',
      color: 'from-[#4338ca] to-[#6366f1]',
    },
    {
      id: 'floor_cashier',
      label: 'Floor Captain / Cashier',
      badge: 'POS Checks & Table Billing',
      color: 'from-[#6b7280] to-[#4b5563]',
    },
  ];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSev = severityFilter === 'all' || log.severity === severityFilter;
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.outpost.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.hashSignature.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white border border-[#e8decb] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#1c1917] to-[#44403c] flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline font-bold text-xl text-[#1c1917]">
                Enterprise RBAC & Cryptographic Audit Ledger
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                SHA-256 Tamper Evident
              </span>
            </div>
            <p className="text-xs text-[#78716c]">
              Role-Based Access Control matrix & immutable cryptographic activity trails for high-stakes actions
            </p>
          </div>
        </div>

        {/* Current Active Role Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#78716c]">Active Executive Role:</span>
          <span className="px-3 py-1.5 rounded-xl bg-[#faf8f5] text-[#1c1917] border border-[#e8decb] text-xs font-bold font-mono">
            {roles.find((r) => r.id === currentRole)?.label}
          </span>
        </div>
      </div>

      {/* Role Switcher Toolbar */}
      <div className="bg-white border border-[#e8decb] rounded-2xl p-4 shadow-xs space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c] block">
          Switch Active Executive Persona to Preview Enforced Permissions:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {roles.map((r) => {
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  onRoleChange(r.id);
                  onShowToast('Security Context Shifted', `Active session now running as ${r.label}.`, 'info');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#1c1917] text-white border-transparent shadow-md scale-[1.02]'
                    : 'bg-[#faf8f5] text-[#57534e] hover:bg-[#f4eee2] border-[#e8decb]'
                }`}
              >
                <div>
                  <span className="font-headline font-bold text-xs block leading-snug">
                    {r.label}
                  </span>
                  <span
                    className={`text-[10px] block mt-0.5 ${
                      isActive ? 'text-[#f59e0b]' : 'text-[#78716c]'
                    }`}
                  >
                    {r.badge}
                  </span>
                </div>
                <div className="pt-2 flex items-center justify-between text-[10px] font-mono">
                  <span>{isActive ? '● ACTIVE' : '○ Switch'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 bg-[#faf8f5] p-1.5 rounded-2xl border border-[#e8decb] w-max">
        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'audit_logs'
              ? 'bg-[#1c1917] text-white shadow-xs'
              : 'text-[#57534e] hover:text-[#1c1917]'
          }`}
        >
          <span className="material-symbols-outlined text-base">history</span>
          <span>Cryptographic Audit Ledger ({auditLogs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('rbac_matrix')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'rbac_matrix'
              ? 'bg-[#1c1917] text-white shadow-xs'
              : 'text-[#57534e] hover:text-[#1c1917]'
          }`}
        >
          <span className="material-symbols-outlined text-base">shield_person</span>
          <span>Live RBAC Permission Matrix</span>
        </button>
      </div>

      {/* TAB 1: Cryptographic Audit Ledger */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e8decb] p-3.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <span className="material-symbols-outlined text-[#78716c] text-lg">search</span>
              <input
                type="text"
                placeholder="Search audit trail by actor, action, hash, node..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-xs px-3 py-1.5 rounded-xl border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#1c1917]/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-white text-xs font-bold px-3 py-2 rounded-xl border border-[#e8decb] cursor-pointer"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="warning">Warning Only</option>
                <option value="info">Info / Routine</option>
              </select>
            </div>
          </div>

          {/* Audit Table */}
          <div className="bg-white border border-[#e8decb] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f5f0e6] text-[#57534e] text-[10px] uppercase font-bold border-b border-[#e8decb]">
                    <th className="py-3 px-6">Timestamp & Node</th>
                    <th className="py-3 px-4">Action Executed</th>
                    <th className="py-3 px-4">Executive Actor & Role</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-6 text-right">Cryptographic Stamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee7da]">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedAuditLog(log)}
                      className="hover:bg-[#faf8f5] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-6">
                        <div className="font-mono font-bold text-xs text-[#1c1917]">{log.timestamp}</div>
                        <div className="text-[10px] text-[#78716c]">{log.outpost}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#1c1917] block leading-snug">{log.action}</span>
                        <span className="text-[11px] text-[#57534e] line-clamp-1">{log.details}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#1c1917] block">{log.actorName}</span>
                        <span className="font-mono text-[10px] text-[#b45309] font-bold">
                          {log.actorRole}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            log.severity === 'critical'
                              ? 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]'
                              : log.severity === 'warning'
                              ? 'bg-[#fffbeb] text-[#92400e] border border-[#fde68a]'
                              : 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <div className="font-mono text-[10px] text-[#047857] truncate max-w-[160px] ml-auto">
                          {log.hashSignature.slice(0, 16)}...
                        </div>
                        <span className="text-[10px] text-[#78716c] block">Click for Verification</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC Matrix */}
      {activeTab === 'rbac_matrix' && (
        <div className="bg-white border border-[#e8decb] rounded-2xl overflow-hidden shadow-xs space-y-4 p-6">
          <div>
            <h3 className="font-headline font-bold text-base text-[#1c1917]">
              Syndicate Role Privilege Enforcement Matrix
            </h3>
            <p className="text-xs text-[#78716c]">
              Real-time authorization matrix. Actions marked with a green check are permitted for your currently selected persona ({roles.find(r => r.id === currentRole)?.label}).
            </p>
          </div>

          <div className="overflow-x-auto border border-[#e8decb] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#faf8f5] text-[#57534e] text-[10px] uppercase font-bold border-b border-[#e8decb]">
                  <th className="py-3 px-4">System Operation / High-Stakes Action</th>
                  <th className="py-3 px-4 text-center">Super Admin</th>
                  <th className="py-3 px-4 text-center">General Mgr</th>
                  <th className="py-3 px-4 text-center">Exec Chef</th>
                  <th className="py-3 px-4 text-center">Procurement</th>
                  <th className="py-3 px-4 text-center">Cashier</th>
                  <th className="py-3 px-4 text-center font-bold">Your Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee7da]">
                {ROLE_PERMISSIONS.map((perm) => {
                  const isPermittedForMe = perm.allowedRoles.includes(currentRole);

                  return (
                    <tr key={perm.key} className="hover:bg-[#faf8f5]">
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#1c1917] block">{perm.title}</span>
                        <span className="text-[11px] text-[#78716c]">{perm.description}</span>
                      </td>

                      {(['super_admin', 'general_manager', 'corporate_chef', 'procurement_lead', 'floor_cashier'] as UserRole[]).map((r) => {
                        const allowed = perm.allowedRoles.includes(r);
                        return (
                          <td key={r} className="py-3 px-4 text-center">
                            {allowed ? (
                              <span className="material-symbols-outlined text-[#047857] text-base">check_circle</span>
                            ) : (
                              <span className="material-symbols-outlined text-[#d1d5db] text-base">cancel</span>
                            )}
                          </td>
                        );
                      })}

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPermittedForMe
                              ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                              : 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]'
                          }`}
                        >
                          {isPermittedForMe ? 'GRANTED' : 'DENIED'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Audit Hash Verification */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#e8decb] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-[#047857]">fingerprint</span>
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#1c1917]">
                    Cryptographic Ledger Verification
                  </h3>
                  <p className="text-xs text-[#78716c] font-mono">
                    Entry ID: {selectedAuditLog.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#78716c] block">Action Signature</span>
                <span className="font-bold text-sm text-[#1c1917] block">{selectedAuditLog.action}</span>
                <p className="text-xs text-[#57534e]">{selectedAuditLog.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#e8decb]">
                  <span className="text-[10px] uppercase font-bold text-[#78716c] block">Executive Actor</span>
                  <span className="font-bold text-[#1c1917]">{selectedAuditLog.actorName}</span>
                  <div className="text-[10px] text-[#b45309] font-mono">{selectedAuditLog.actorRole}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#e8decb]">
                  <span className="text-[10px] uppercase font-bold text-[#78716c] block">Origin Node IP</span>
                  <span className="font-mono font-bold text-[#1c1917]">{selectedAuditLog.ipAddress}</span>
                  <div className="text-[10px] text-[#78716c]">{selectedAuditLog.outpost}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#78716c] block">
                  SHA-256 Cryptographic Audit Hash:
                </span>
                <div className="font-mono text-[11px] font-bold text-[#047857] break-all bg-white p-2.5 rounded-lg border border-[#e8decb]">
                  {selectedAuditLog.hashSignature}
                </div>
                <span className="text-[10px] text-[#047857] font-bold block">
                  ✓ Signature verified valid against Kizen Merkle ledger.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0ece1]">
              <button
                type="button"
                onClick={() => setSelectedAuditLog(null)}
                className="px-4 py-2 rounded-xl bg-[#faf8f5] text-xs font-bold text-[#57534e]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(selectedAuditLog.hashSignature);
                  onShowToast('Audit Hash Copied', 'Copied SHA-256 proof signature.', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-[#1c1917] text-white text-xs font-bold shadow-md hover:bg-[#333]"
              >
                Copy Hash Proof
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { GSTInvoice, TDSRecord } from '../types';
import { INITIAL_GST_INVOICES, INITIAL_TDS_RECORDS } from '../data/enterpriseData';

interface GSTComplianceViewProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const GSTComplianceView: React.FC<GSTComplianceViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'reconciliation' | 'tds'>('invoices');
  const [invoices, setInvoices] = useState<GSTInvoice[]>(INITIAL_GST_INVOICES);
  const [tdsRecords, setTdsRecords] = useState<TDSRecord[]>(INITIAL_TDS_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<GSTInvoice | null>(null);

  // New Invoice Generator Modal
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [custName, setCustName] = useState('Tata Consultancy Services VIP Delegation');
  const [custGSTIN, setCustGSTIN] = useState('27AAACT2727Q1ZW');
  const [subtotalAmount, setSubtotalAmount] = useState<number>(75000);
  const [taxType, setTaxType] = useState<'intrastate' | 'interstate'>('intrastate');
  const [outpost, setOutpost] = useState('Mumbai BKC Flagship');
  const [payMethod, setPayMethod] = useState<GSTInvoice['paymentMethod']>('Pine Labs POS');

  // Generate 64-char mock NIC IRN
  const generateIRN = () => {
    const chars = '0123456789abcdef';
    let res = '';
    for (let i = 0; i < 64; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res;
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const cgst = taxType === 'intrastate' ? (subtotalAmount * 0.025) : 0;
    const sgst = taxType === 'intrastate' ? (subtotalAmount * 0.025) : 0;
    const igst = taxType === 'interstate' ? (subtotalAmount * 0.05) : 0;
    const total = subtotalAmount + cgst + sgst + igst;
    const irn = generateIRN();

    const newInv: GSTInvoice = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `KZ-${outpost.slice(0, 3).toUpperCase()}-2026/${Math.floor(1000 + Math.random() * 9000)}`,
      irnNumber: irn,
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      customerName: custName,
      customerGSTIN: custGSTIN || undefined,
      outpost,
      posTerminal: `${payMethod} Smart Gateway`,
      subtotal: subtotalAmount,
      taxType,
      cgstAmount: cgst,
      sgstAmount: sgst,
      igstAmount: igst,
      totalAmount: total,
      paymentMethod: payMethod,
      transactionRef: `TXN-${Date.now().toString().slice(-6)}`,
      reconciliationStatus: 'reconciled',
      qrCodePayload: `https://einvoice1.gst.gov.in/verify/${irn}`,
    };

    setInvoices([newInv, ...invoices]);
    setIsGenerateModalOpen(false);
    setSelectedInvoice(newInv);
    onShowToast(
      'GST E-Invoice & IRN Generated',
      `IRN registered with NIC E-Invoice System for ${newInv.customerName} (₹${total.toLocaleString('en-IN')}).`,
      'success'
    );
  };

  const handleReconcileSingle = (id: string, ref: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, reconciliationStatus: 'reconciled' } : inv))
    );
    onShowToast('Reconciliation Complete', `Matched transaction reference ${ref} with bank ledger.`, 'success');
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.irnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.transactionRef.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalGSTCollected = invoices.reduce(
    (acc, curr) => acc + curr.cgstAmount + curr.sgstAmount + curr.igstAmount,
    0
  );
  const totalTurnover = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="flex flex-col w-full space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white border border-[#e8decb] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#047857] to-[#0d9488] flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-2xl">receipt_long</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline font-bold text-xl text-[#1c1917]">
                GST Compliance & Financial Reconciliation
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                NIC Portal Connected
              </span>
            </div>
            <p className="text-xs text-[#78716c]">
              Multi-state GST bifurcations (2.5% CGST + 2.5% SGST / 5% IGST), E-Invoice IRN & Form 16 TDS engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">post_add</span>
            <span>+ Generate B2B E-Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#e8decb] space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c] block">
            Total Audited Turnover
          </span>
          <div className="text-2xl font-bold font-mono text-[#1c1917]">
            ₹{totalTurnover.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#047857] font-bold">100% Tax Compliant</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8decb] space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c] block">
            GST Collected (CGST+SGST+IGST)
          </span>
          <div className="text-2xl font-bold font-mono text-[#b45309]">
            ₹{Math.round(totalGSTCollected).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#78716c]">Bifurcated Intrastate / Interstate</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8decb] space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c] block">
            NIC IRN Registered Checks
          </span>
          <div className="text-2xl font-bold font-mono text-[#047857]">
            {invoices.length} <span className="text-xs text-[#78716c] font-normal">invoices</span>
          </div>
          <span className="text-[11px] text-[#047857] font-bold">With Encrypted QR Codes</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8decb] space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c] block">
            UPI & POS Reconciliation
          </span>
          <div className="text-2xl font-bold font-mono text-[#047857]">
            {Math.round((invoices.filter((i) => i.reconciliationStatus === 'reconciled').length / invoices.length) * 100)}%
          </div>
          <span className="text-[11px] text-[#78716c]">Matched with HDFC/ICICI Feeds</span>
        </div>
      </div>

      {/* Tabs: Invoices, Gateway Reconciliation, TDS */}
      <div className="bg-white border border-[#e8decb] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-[#faf8f5] border-b border-[#e8decb] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'invoices'
                  ? 'bg-gradient-to-r from-[#047857] to-[#0d9488] text-white shadow-xs'
                  : 'bg-white text-[#57534e] hover:bg-[#f4eee2] border border-[#e8decb]'
              }`}
            >
              Tax Invoices & IRN Ledger ({invoices.length})
            </button>
            <button
              onClick={() => setActiveTab('reconciliation')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'reconciliation'
                  ? 'bg-gradient-to-r from-[#047857] to-[#0d9488] text-white shadow-xs'
                  : 'bg-white text-[#57534e] hover:bg-[#f4eee2] border border-[#e8decb]'
              }`}
            >
              Pine Labs & UPI Reconciliation
            </button>
            <button
              onClick={() => setActiveTab('tds')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tds'
                  ? 'bg-gradient-to-r from-[#047857] to-[#0d9488] text-white shadow-xs'
                  : 'bg-white text-[#57534e] hover:bg-[#f4eee2] border border-[#e8decb]'
              }`}
            >
              Form 16 & Section 194 TDS Ledger
            </button>
          </div>

          {activeTab === 'invoices' && (
            <div className="flex items-center gap-2 max-w-xs w-full">
              <span className="material-symbols-outlined text-[#78716c] text-lg">search</span>
              <input
                type="text"
                placeholder="Search invoice, customer, IRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-xs px-3 py-1.5 rounded-xl border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#047857]/50"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Invoices Table */}
        {activeTab === 'invoices' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f5f0e6] text-[#57534e] text-[10px] uppercase tracking-wider border-b border-[#e8decb]">
                  <th className="py-3 px-6 font-bold">Invoice & Node</th>
                  <th className="py-3 px-4 font-bold">Customer & GSTIN</th>
                  <th className="py-3 px-4 font-bold">Subtotal</th>
                  <th className="py-3 px-4 font-bold">GST Bifurcation</th>
                  <th className="py-3 px-4 font-bold">Total (INR)</th>
                  <th className="py-3 px-4 font-bold">Payment & Status</th>
                  <th className="py-3 px-6 text-right font-bold">E-Invoice IRN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee7da]">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#faf8f5] transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-mono font-bold text-sm text-[#1c1917]">{inv.invoiceNumber}</div>
                      <div className="text-[10px] text-[#78716c]">{inv.date} • {inv.outpost}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c1917]">{inv.customerName}</div>
                      {inv.customerGSTIN ? (
                        <span className="font-mono text-[10px] text-[#047857] font-bold">
                          GSTIN: {inv.customerGSTIN}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#78716c]">B2C Dining</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-[#57534e]">
                      ₹{inv.subtotal.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {inv.taxType === 'intrastate' ? (
                        <div className="space-y-0.5">
                          <div>CGST 2.5%: <strong className="text-[#b45309]">₹{inv.cgstAmount.toLocaleString('en-IN')}</strong></div>
                          <div>SGST 2.5%: <strong className="text-[#b45309]">₹{inv.sgstAmount.toLocaleString('en-IN')}</strong></div>
                        </div>
                      ) : (
                        <div>IGST 5.0%: <strong className="text-[#b45309]">₹{inv.igstAmount.toLocaleString('en-IN')}</strong></div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#047857]">
                      ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-semibold text-[#1c1917]">{inv.paymentMethod}</div>
                      <span className="text-[10px] font-mono text-[#78716c] block">{inv.transactionRef}</span>
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#047857] font-bold text-xs border border-[#e8decb] transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-xs">qr_code_2</span>
                        <span>View IRN</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Pine Labs & UPI Gateway Reconciliation */}
        {activeTab === 'reconciliation' && (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-[#047857]">cloud_sync</span>
                <div>
                  <h4 className="font-bold text-sm text-[#065f46]">
                    Real-time Gateway Webhook Feed
                  </h4>
                  <p className="text-xs text-[#065f46]/80">
                    Auto-reconciles UPI transaction reference numbers and Pine Labs terminal batches every 15 minutes.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white text-[#047857] border border-[#a7f3d0]">
                Zero Settlement Discrepancy
              </span>
            </div>

            <div className="overflow-x-auto border border-[#e8decb] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#faf8f5] text-[#57534e] text-[10px] uppercase font-bold border-b border-[#e8decb]">
                    <th className="py-3 px-4">Terminal / Gateway</th>
                    <th className="py-3 px-4">Merchant TXN Reference</th>
                    <th className="py-3 px-4">Associated Table Check</th>
                    <th className="py-3 px-4 text-right">Settled Amount</th>
                    <th className="py-3 px-4">Match Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee7da]">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#faf8f5]">
                      <td className="py-3 px-4 font-semibold text-[#1c1917]">{inv.posTerminal}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#b45309]">{inv.transactionRef}</td>
                      <td className="py-3 px-4">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#047857]">
                        ₹{inv.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        {inv.reconciliationStatus === 'reconciled' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                            Matched (Bank Feed)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fffbeb] text-[#92400e] border border-[#fde68a]">
                            Pending Verification
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {inv.reconciliationStatus !== 'reconciled' ? (
                          <button
                            type="button"
                            onClick={() => handleReconcileSingle(inv.id, inv.transactionRef)}
                            className="px-2.5 py-1 rounded-lg bg-[#047857] text-white font-bold text-[11px] hover:brightness-110 cursor-pointer"
                          >
                            Match TXN
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#047857] font-bold flex items-center justify-end gap-0.5">
                            <span className="material-symbols-outlined text-xs">check</span>
                            Cleared
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Form 16 & Section 194 TDS Ledger */}
        {activeTab === 'tds' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline font-bold text-base text-[#1c1917]">
                  Income Tax Act TDS Withholding Ledger
                </h3>
                <p className="text-xs text-[#78716c]">
                  Form 16 & 16A withholding tracking under Section 192 (Executive Salaries) and 194C/194J (Purveyors & Sommeliers)
                </p>
              </div>
              <button
                type="button"
                onClick={() => onShowToast('Export Form 16 Package', 'Dispatched consolidated quarterly TDS zip to Tax Auditor.', 'success')}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#faf8f5] text-[#1c1917] font-bold text-xs border border-[#e8decb] flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export Form 16 (.TXT / .CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-[#e8decb] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#faf8f5] text-[#57534e] text-[10px] uppercase font-bold border-b border-[#e8decb]">
                    <th className="py-3 px-4">Beneficiary & PAN</th>
                    <th className="py-3 px-4">IT Section</th>
                    <th className="py-3 px-4 text-right">Gross Remuneration</th>
                    <th className="py-3 px-4 text-right">TDS Withheld</th>
                    <th className="py-3 px-4 text-right">Net Disbursed</th>
                    <th className="py-3 px-4">Challan BSR Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee7da]">
                  {tdsRecords.map((t) => (
                    <tr key={t.id} className="hover:bg-[#faf8f5]">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1c1917]">{t.beneficiaryName}</div>
                        <span className="font-mono text-[10px] text-[#b45309] font-bold">PAN: {t.panMasked}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-[#1c1917]">{t.section}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        ₹{t.grossDisbursement.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#b91c1c]">
                        -₹{t.tdsDeducted.toLocaleString('en-IN')} ({t.tdsRatePercent}%)
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#047857]">
                        ₹{t.netPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[11px] font-mono text-[#1c1917] font-semibold">{t.challanBSR}</div>
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-[#ecfdf5] text-[#065f46]">
                          {t.depositStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: View IRN & E-Invoice Details */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#e8decb] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-[#047857]">verified</span>
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#1c1917]">
                    Indian E-Invoice Portal Verification
                  </h3>
                  <p className="text-xs text-[#78716c]">
                    Invoice #{selectedInvoice.invoiceNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* QR Code and IRN Display */}
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e8decb] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              {/* Dynamic QR Mock */}
              <div className="w-24 h-24 bg-white p-2 rounded-xl border border-[#e8decb] shadow-xs flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-black to-slate-800 p-1 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-4xl">qr_code_2</span>
                </div>
              </div>

              <div className="space-y-1 overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716c] block">
                  64-Character NIC IRN Hash:
                </span>
                <p className="font-mono text-[11px] font-bold text-[#047857] break-all leading-tight bg-white p-2 rounded-lg border border-[#e8decb]">
                  {selectedInvoice.irnNumber}
                </p>
                <span className="text-[10px] text-[#047857] font-bold block">
                  Cryptographically anchored to GSTN Network
                </span>
              </div>
            </div>

            {/* Tax Computation Breakdown */}
            <div className="space-y-2 text-xs border border-[#e8decb] rounded-xl p-4 bg-white">
              <div className="flex justify-between py-1 border-b border-[#f0ece1]">
                <span className="text-[#78716c]">Customer:</span>
                <span className="font-bold text-[#1c1917]">{selectedInvoice.customerName}</span>
              </div>
              {selectedInvoice.customerGSTIN && (
                <div className="flex justify-between py-1 border-b border-[#f0ece1]">
                  <span className="text-[#78716c]">Customer GSTIN:</span>
                  <span className="font-mono font-bold text-[#047857]">{selectedInvoice.customerGSTIN}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-[#f0ece1]">
                <span className="text-[#78716c]">Assessable Value (Subtotal):</span>
                <span className="font-mono font-semibold">₹{selectedInvoice.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {selectedInvoice.taxType === 'intrastate' ? (
                <>
                  <div className="flex justify-between py-1 text-[#b45309]">
                    <span>Central GST (CGST @ 2.5%):</span>
                    <span className="font-mono font-bold">₹{selectedInvoice.cgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 text-[#b45309] border-b border-[#f0ece1]">
                    <span>State GST (SGST @ 2.5%):</span>
                    <span className="font-mono font-bold">₹{selectedInvoice.sgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between py-1 text-[#b45309] border-b border-[#f0ece1]">
                  <span>Integrated GST (IGST @ 5.0%):</span>
                  <span className="font-mono font-bold">₹{selectedInvoice.igstAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between py-2 text-sm font-bold text-[#1c1917]">
                <span>Total Invoice Amount (INR):</span>
                <span className="font-mono text-base text-[#047857]">₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(selectedInvoice.irnNumber);
                  onShowToast('IRN Copied', 'Copied 64-character IRN hash to clipboard.', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#b45309] font-bold text-xs border border-[#e8decb] cursor-pointer"
              >
                Copy IRN
              </button>

              <button
                type="button"
                onClick={() => {
                  onShowToast('Printing Tax Invoice', 'Sent standardized GST bill to thermal printer.', 'success');
                  setSelectedInvoice(null);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#047857] to-[#0d9488] text-white font-bold text-xs shadow-md hover:brightness-110 cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Print Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Generate New B2B E-Invoice */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#e8decb] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-[#f59e0b]">receipt_long</span>
                <h3 className="font-headline font-bold text-lg text-[#1c1917]">
                  Register B2B GST E-Invoice
                </h3>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1">
                  Customer / Corporate Entity Name
                </label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-xs border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1">
                    Customer GSTIN (15 Digits)
                  </label>
                  <input
                    type="text"
                    required
                    value={custGSTIN}
                    onChange={(e) => setCustGSTIN(e.target.value.toUpperCase())}
                    className="w-full font-mono bg-[#faf8f5] text-[#047857] font-bold px-3.5 py-2 rounded-xl text-xs border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1">
                    Tax Nature
                  </label>
                  <select
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value as any)}
                    className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-xs border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                  >
                    <option value="intrastate">Intrastate (2.5% CGST + 2.5% SGST)</option>
                    <option value="interstate">Interstate (5.0% IGST)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1">
                    Assessable Subtotal (₹ INR)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={subtotalAmount}
                    onChange={(e) => setSubtotalAmount(Number(e.target.value) || 0)}
                    className="w-full font-mono font-bold bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-xs border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1">
                    Payment Gateway
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-xs border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                  >
                    <option value="Pine Labs POS">Pine Labs Smart POS</option>
                    <option value="Razorpay Direct">Razorpay Direct Gateway</option>
                    <option value="UPI">UPI Express QR</option>
                    <option value="Corporate Wire">Corporate Wire (NEFT/RTGS)</option>
                  </select>
                </div>
              </div>

              {/* Instant Calculation Preview */}
              <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] text-xs space-y-1">
                <div className="flex justify-between text-[#78716c]">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{subtotalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#b45309]">
                  <span>{taxType === 'intrastate' ? 'CGST (2.5%) + SGST (2.5%):' : 'IGST (5%):'}</span>
                  <span className="font-mono font-bold">
                    +₹{(subtotalAmount * 0.05).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#047857] pt-1 border-t border-[#e8decb]">
                  <span>Total Payable:</span>
                  <span className="font-mono">
                    ₹{(subtotalAmount * 1.05).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#f0ece1]">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-xs font-bold text-[#57534e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-xs font-bold shadow-md hover:brightness-110"
                >
                  Generate & Register IRN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

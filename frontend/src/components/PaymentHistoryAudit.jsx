import React, { useState } from 'react';
import { Search, Printer, FileText, CheckCircle2, Clock, AlertCircle, X, Download, Undo2 } from 'lucide-react';

export default function PaymentHistoryAudit({ payments = [], onViewReceipt, onRevertPayment }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  const filteredPayments = payments.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      p.studentName?.toLowerCase().includes(term) ||
      p.studentRollNumber?.toLowerCase().includes(term) ||
      p.receiptNumber?.toLowerCase().includes(term) ||
      p.transactionId?.toLowerCase().includes(term) ||
      p.roomNumber?.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (methodFilter !== 'ALL' && p.paymentMethod !== methodFilter) return false;

    return true;
  });

  const totalAmount = filteredPayments
    .filter(p => p.paymentStatus === 'SUCCESS')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const handleExportCSV = () => {
    if (filteredPayments.length === 0) {
      alert('No payment records to export.');
      return;
    }

    const headers = ['Receipt No', 'Transaction ID', 'Student Name', 'Roll Number', 'Room', 'Date', 'Start Date', 'End Date', 'Months', 'Amount', 'Payment Mode', 'Status'];
    const rows = filteredPayments.map(p => [
      `"${p.receiptNumber || ''}"`,
      `"${p.transactionId || ''}"`,
      `"${p.studentName || ''}"`,
      `"${p.studentRollNumber || ''}"`,
      `"${p.roomNumber || ''}"`,
      `"${p.paymentDate || ''}"`,
      `"${p.periodStartDate || ''}"`,
      `"${p.periodEndDate || ''}"`,
      p.monthsExtended || 1,
      p.amount || 0,
      `"${p.paymentMethod || ''}"`,
      `"${p.paymentStatus || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hostel_Payment_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Fee Payment Audit Log & Invoices</div>
          <div className="card-subtitle">
            All historic hostel fee collections, stay extensions, and digital receipts
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
          <div style={{ background: '#ecfdf5', padding: '0.45rem 0.95rem', borderRadius: '10px', border: '1px solid #a7f3d0', fontSize: '0.85rem', fontWeight: 800, color: '#047857' }}>
            Total Filtered: ₹{totalAmount.toLocaleString('en-IN')}
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleExportCSV}
            title="Export payment records to CSV spreadsheet"
          >
            <Download size={14} />
            Export Audit CSV
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Search & Filter */}
        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search by student, roll number, receipt #, txn ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['ALL', 'UPI', 'CASH', 'CARD', 'NET_BANKING'].map((method) => (
              <button
                key={method}
                onClick={() => setMethodFilter(method)}
                style={{
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: methodFilter === method ? '1.5px solid #4f46e5' : '1px solid #e2e8f0',
                  background: methodFilter === method ? '#eef2ff' : '#ffffff',
                  color: methodFilter === method ? '#4338ca' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Receipt / Txn ID</th>
                <th>Student</th>
                <th>Room</th>
                <th>Date & Time</th>
                <th>Stay Period Covered</th>
                <th>Months</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    No payment records match this search.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.receiptNumber || 'REC-' + p.id}</div>
                      <code style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.transactionId}</code>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>{p.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.studentRollNumber}</div>
                    </td>

                    <td>Room {p.roomNumber}</td>

                    <td>
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : 'N/A'}
                    </td>

                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#166534' }}>
                        {p.periodStartDate || 'Start'} → {p.periodEndDate || 'End'}
                      </div>
                    </td>

                    <td>+{p.monthsExtended || 1} mo</td>

                    <td style={{ fontWeight: 800, color: p.paymentStatus === 'REVERTED' ? '#94a3b8' : '#059669', fontSize: '0.95rem' }}>
                      {p.paymentStatus === 'REVERTED' ? (
                        <del>₹{p.amount?.toLocaleString('en-IN')}</del>
                      ) : (
                        <span>₹{p.amount?.toLocaleString('en-IN')}</span>
                      )}
                    </td>

                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                        {p.paymentMethod}
                      </span>
                    </td>

                    <td>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '999px',
                        background: p.paymentStatus === 'SUCCESS' ? '#ecfdf5' : p.paymentStatus === 'REVERTED' ? '#fef2f2' : '#fef3c7',
                        color: p.paymentStatus === 'SUCCESS' ? '#059669' : p.paymentStatus === 'REVERTED' ? '#dc2626' : '#d97706',
                        border: p.paymentStatus === 'SUCCESS' ? '1px solid #a7f3d0' : p.paymentStatus === 'REVERTED' ? '1px solid #fecaca' : '1px solid #fde68a'
                      }}>
                        {p.paymentStatus === 'SUCCESS' ? 'PAID' : p.paymentStatus === 'REVERTED' ? 'UNPAID / REVERTED' : 'PENDING'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {p.paymentStatus === 'SUCCESS' && onRevertPayment && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#dc2626', borderColor: '#fecaca', background: '#ffffff', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            onClick={() => onRevertPayment(p)}
                            title="Mistaken extension? Revert stay validity and mark as Unpaid"
                          >
                            <Undo2 size={13} />
                            Mark Unpaid
                          </button>
                        )}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onViewReceipt(p)}
                          title="Print or view receipt"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          <Printer size={13} />
                          Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

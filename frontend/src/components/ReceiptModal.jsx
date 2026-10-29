import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ReceiptModal({ payment, onClose }) {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#4f46e5" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Hostel Fee Payment Receipt</h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ background: '#f8fafc', padding: '1.25rem' }}>
          <div className="receipt-paper" id="printable-receipt">
            <div className="receipt-header">
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e1b4b' }}>ROYAL HERITAGE HOSTEL</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Affiliated Student Residence | Campus Road, Block-B</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                {payment.paymentStatus === 'REVERTED' ? (
                  <span className="receipt-watermark" style={{ borderColor: '#fca5a5', color: '#dc2626', background: '#fef2f2' }}>
                    VOID - TRANSACTION REVERTED / UNPAID
                  </span>
                ) : (
                  <span className="receipt-watermark">FEE PAID & VERIFIED</span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>RECEIPT NO</span>
                <strong style={{ color: '#0f172a' }}>{payment.receiptNumber || 'REC-' + payment.id}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>PAYMENT DATE</span>
                <strong style={{ color: '#0f172a' }}>
                  {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : 'N/A'}
                </strong>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>Student Name:</span>
                <strong style={{ color: '#0f172a' }}>{payment.studentName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>Roll Number:</span>
                <strong>{payment.studentRollNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>Allocated Room:</span>
                <span style={{ fontWeight: 600 }}>{payment.roomNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Transaction ID:</span>
                <code style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
                  {payment.transactionId}
                </code>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '0.75rem' }}>
                  <th style={{ padding: '0.5rem 0' }}>DESCRIPTION</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'center' }}>DURATION</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 0' }}>
                    <div style={{ fontWeight: 600 }}>Monthly Hostel Stay & Mess Fee</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Stay validity: {payment.periodStartDate || 'Today'} to {payment.periodEndDate || '1 Month'}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'center' }}>
                    {payment.monthsExtended || 1} Month(s)
                  </td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 600 }}>
                    ₹{payment.amount?.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" style={{ padding: '0.75rem 0', fontWeight: 700, fontSize: '1rem' }}>
                    {payment.paymentStatus === 'REVERTED' ? 'Amount (Reverted / Void)' : 'Total Amount Paid'}
                  </td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 800, fontSize: '1.15rem', color: payment.paymentStatus === 'REVERTED' ? '#dc2626' : '#10b981' }}>
                    {payment.paymentStatus === 'REVERTED' ? (
                      <del>₹{payment.amount?.toLocaleString('en-IN')}</del>
                    ) : (
                      <span>₹{payment.amount?.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.8rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <div>
                <div>Payment Method: <strong>{payment.paymentMethod}</strong></div>
                <div>
                  Status:{' '}
                  {payment.paymentStatus === 'REVERTED' ? (
                    <span style={{ color: '#dc2626', fontWeight: 700 }}>REVERTED / UNPAID</span>
                  ) : payment.paymentStatus === 'SUCCESS' ? (
                    <span style={{ color: '#059669', fontWeight: 700 }}>SUCCESSFUL</span>
                  ) : (
                    <span style={{ color: '#d97706', fontWeight: 700 }}>PENDING</span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ borderTop: '1px solid #94a3b8', width: '130px', margin: '0 0 4px auto' }}></div>
                <span>Authorized Warden Signature</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

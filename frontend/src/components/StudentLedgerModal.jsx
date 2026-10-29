import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  CreditCard, 
  Printer, 
  Home, 
  Users, 
  Phone, 
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Undo2
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { api } from '../services/api';

export default function StudentLedgerModal({ 
  student, 
  allStudents = [], 
  rooms = [], 
  onClose, 
  onOpenPaymentModal, 
  onViewReceipt,
  onRevertPayment
}) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentPayments = async () => {
    if (student?.id) {
      setLoading(true);
      try {
        const data = await api.getPaymentsByStudentId(student.id);
        setPayments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchStudentPayments();
  }, [student?.id]);

  const handleRevert = async (p) => {
    if (onRevertPayment) {
      const success = await onRevertPayment(p);
      if (success) {
        await fetchStudentPayments();
      }
    }
  };

  if (!student) return null;

  const currentRoom = rooms.find(r => r.roomNumber === student.roomNumber);
  const roommates = allStudents.filter(s => s.roomNumber === student.roomNumber && s.id !== student.id && s.active);

  const daysRemaining = student.daysRemaining;
  const isOverdue = daysRemaining < 0;
  const isExpiringSoon = daysRemaining >= 0 && daysRemaining <= 7;

  let progressPercent = 0;
  if (daysRemaining > 0) {
    progressPercent = Math.min(100, Math.round((daysRemaining / 30) * 100));
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not Set';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '850px', maxHeight: '92vh' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              {student.name.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  {student.name}
                </h3>
                <StatusBadge status={student.paymentStatus} daysRemaining={student.daysRemaining} />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Roll ID: <strong style={{ color: '#334155' }}>{student.rollNumber}</strong> • Room: <strong style={{ color: '#334155' }}>{student.roomNumber} ({student.bedNumber})</strong>
              </p>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '1.5rem', background: '#f8fafc' }}>
          
          {/* Stay Validity Card */}
          <div className="stay-card" style={{ marginBottom: '1.25rem', padding: '1.5rem' }}>
            <div className="stay-header" style={{ marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a5b4fc', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Stay Validity & Countdown
                </div>
                
                <div style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {isOverdue ? (
                    <span style={{ color: '#fca5a5' }}>Expired {Math.abs(daysRemaining)} Days Ago</span>
                  ) : (
                    <span>{daysRemaining} Days Remaining</span>
                  )}
                </div>

                <div style={{ fontSize: '0.9rem', color: '#e0e7ff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <Calendar size={16} />
                  <span>Stay Valid Until: <strong>{formatDate(student.stayValidUntil)}</strong></span>
                </div>
              </div>

              <div>
                <button
                  className="btn btn-primary"
                  style={{
                    background: '#ffffff',
                    color: '#4f46e5',
                    fontWeight: 800,
                    padding: '0.65rem 1.25rem'
                  }}
                  onClick={() => {
                    onOpenPaymentModal(student);
                  }}
                >
                  <CreditCard size={16} />
                  Extend 1 Month Stay
                </button>
              </div>
            </div>

            <div className="progress-bar-bg" style={{ margin: '0.85rem 0' }}>
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${isOverdue ? 100 : progressPercent}%`,
                  background: isOverdue ? '#ef4444' : (isExpiringSoon ? '#f59e0b' : '#10b981')
                }}
              ></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#c7d2fe' }}>
              <span>Admission: {formatDate(student.admissionDate)}</span>
              <span>Status: <strong style={{ color: isOverdue ? '#fca5a5' : '#86efac' }}>{student.paymentStatus}</strong></span>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            {/* Fee Breakdown */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileText size={15} color="#4f46e5" />
                <span>Monthly Fee Breakdown</span>
              </div>
              <div className="fee-breakdown-box" style={{ margin: 0 }}>
                <div className="fee-row">
                  <span>Room Stay & Utilities</span>
                  <strong>₹{((student.monthlyFee || 6000) * 0.65).toLocaleString('en-IN')}</strong>
                </div>
                <div className="fee-row">
                  <span>Mess & Meal Plan</span>
                  <strong>₹{((student.monthlyFee || 6000) * 0.35).toLocaleString('en-IN')}</strong>
                </div>
                <div className="fee-row total">
                  <span>Total Monthly Fee</span>
                  <span style={{ color: '#4f46e5' }}>₹{(student.monthlyFee || 6000).toLocaleString('en-IN')}/mo</span>
                </div>
              </div>
            </div>

            {/* Room & Roommates */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Home size={15} color="#4f46e5" />
                <span>Room & Roommates</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                Allocated to <strong>Room {student.roomNumber} ({student.bedNumber})</strong>.
                {currentRoom?.amenities && (
                  <div style={{ marginTop: '2px' }}>{currentRoom.amenities}</div>
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Roommates:
                </div>
                {roommates.length === 0 ? (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No other roommates in this room.</span>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {roommates.map(rm => (
                      <div key={rm.id} style={{ fontSize: '0.75rem', padding: '3px 6px', background: '#f8fafc', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{rm.name} ({rm.bedNumber})</span>
                        <span style={{ color: '#64748b' }}>{rm.phone}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                Payment & Stay Extension History ({payments.length})
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onOpenPaymentModal(student)}
              >
                <CreditCard size={13} />
                Record Payment
              </button>
            </div>

            {loading ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                Loading payment records...
              </div>
            ) : payments.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                No payment transactions recorded for this student yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Receipt #</th>
                      <th>Date</th>
                      <th>Stay Validity Period</th>
                      <th>Amount</th>
                      <th>Mode</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.receiptNumber || 'REC-' + p.id}</strong>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{p.transactionId}</div>
                        </td>
                        <td>
                          {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          }) : 'N/A'}
                        </td>
                        <td>
                          <div style={{ color: p.paymentStatus === 'REVERTED' ? '#94a3b8' : '#166534', fontWeight: 600 }}>
                            {formatDate(p.periodStartDate)} → {formatDate(p.periodEndDate)}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            +{p.monthsExtended || 1} month(s)
                          </div>
                        </td>
                        <td style={{ fontWeight: 800, color: p.paymentStatus === 'REVERTED' ? '#94a3b8' : '#0f172a' }}>
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
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '3px 7px',
                            borderRadius: '999px',
                            background: p.paymentStatus === 'SUCCESS' ? '#ecfdf5' : p.paymentStatus === 'REVERTED' ? '#fef2f2' : '#fef3c7',
                            color: p.paymentStatus === 'SUCCESS' ? '#059669' : p.paymentStatus === 'REVERTED' ? '#dc2626' : '#d97706',
                            border: p.paymentStatus === 'SUCCESS' ? '1px solid #a7f3d0' : p.paymentStatus === 'REVERTED' ? '1px solid #fecaca' : '1px solid #fde68a'
                          }}>
                            {p.paymentStatus === 'SUCCESS' ? 'PAID' : p.paymentStatus === 'REVERTED' ? 'UNPAID / REVERTED' : 'PENDING'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {p.paymentStatus === 'SUCCESS' && onRevertPayment && (
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ color: '#dc2626', borderColor: '#fecaca', background: '#ffffff', padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                                onClick={() => handleRevert(p)}
                                title="Mistaken extension? Roll back stay validity and mark as Unpaid"
                              >
                                <Undo2 size={12} />
                                Mark Unpaid
                              </button>
                            )}
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => onViewReceipt(p)}
                              title="Print or view receipt"
                              style={{ padding: '0.25rem 0.5rem' }}
                            >
                              <Printer size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Ledger
          </button>
          <button className="btn btn-primary" onClick={() => onOpenPaymentModal(student)}>
            <CreditCard size={16} />
            Record 1-Month Extension
          </button>
        </div>
      </div>
    </div>
  );
}

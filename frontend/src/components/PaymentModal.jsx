import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export default function PaymentModal({ student, isWarden = true, onClose, onSuccess }) {
  const [months, setMonths] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionId, setTransactionId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!student) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const currentValidityStr = student.stayValidUntil || todayStr;
  
  // Check if current validity is in the past
  const isPastDue = currentValidityStr < todayStr;

  // Extension base mode: 'CONTINUE_PAST' (continue from past month date) or 'FROM_PRESENT' (start from present today)
  const [startMode, setStartMode] = useState(isPastDue ? 'CONTINUE_PAST' : 'FROM_VALIDITY');
  const [customStartDate, setCustomStartDate] = useState(isPastDue ? currentValidityStr : todayStr);

  const monthlyRate = student.monthlyFee || 6000;
  const totalAmount = monthlyRate * months;

  // Determine effective start date based on selected mode
  let effectiveStartDateStr = todayStr;
  if (startMode === 'CONTINUE_PAST') {
    effectiveStartDateStr = currentValidityStr;
  } else if (startMode === 'FROM_PRESENT') {
    effectiveStartDateStr = todayStr;
  } else if (startMode === 'FROM_VALIDITY') {
    effectiveStartDateStr = currentValidityStr;
  } else if (startMode === 'CUSTOM') {
    effectiveStartDateStr = customStartDate || todayStr;
  }

  // Calculate projected new valid until date
  const computeEndDate = (startStr, numMonths) => {
    if (!startStr) return '';
    const d = new Date(startStr);
    d.setMonth(d.getMonth() + Number(numMonths));
    return d.toISOString().split('T')[0];
  };

  const projectedEndDateStr = computeEndDate(effectiveStartDateStr, months);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not Set';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        studentId: student.id,
        months: Number(months),
        amount: totalAmount,
        paymentMethod: paymentMethod,
        startDate: effectiveStartDateStr,
        transactionId: transactionId || `TXN-${paymentMethod}-${Date.now().toString().slice(-6)}`,
        remarks: remarks || `${months} Month stay extension (${paymentMethod}) starting ${effectiveStartDateStr}`,
        recordedBy: isWarden ? 'WARDEN' : 'STUDENT',
        autoApprove: true
      };

      const record = await api.extendStayPayment(payload);
      onSuccess(record);
      onClose();
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Record Fee Payment & Extend Stay
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Resident: <strong style={{ color: '#1e293b' }}>{student.name}</strong> ({student.rollNumber}) • Room {student.roomNumber}
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {/* Stay Extension Mode Selector (Present vs Past Month Date) */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} color="#4f46e5" />
                <span>Select Extension Starting Point:</span>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {/* Option 1: Continue from Past Month Date */}
                {isPastDue && (
                  <button
                    type="button"
                    onClick={() => setStartMode('CONTINUE_PAST')}
                    style={{
                      padding: '0.65rem 0.75rem',
                      borderRadius: '10px',
                      border: startMode === 'CONTINUE_PAST' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                      background: startMode === 'CONTINUE_PAST' ? '#eef2ff' : '#ffffff',
                      color: startMode === 'CONTINUE_PAST' ? '#4338ca' : '#334155',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RotateCcw size={13} color="#4f46e5" />
                      <span>Continue Past Month Date</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      From previous expiry: <strong>{formatDate(currentValidityStr)}</strong>
                    </div>
                  </button>
                )}

                {/* If already active in future */}
                {!isPastDue && (
                  <button
                    type="button"
                    onClick={() => setStartMode('FROM_VALIDITY')}
                    style={{
                      padding: '0.65rem 0.75rem',
                      borderRadius: '10px',
                      border: startMode === 'FROM_VALIDITY' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                      background: startMode === 'FROM_VALIDITY' ? '#eef2ff' : '#ffffff',
                      color: startMode === 'FROM_VALIDITY' ? '#4338ca' : '#334155',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <div>Continue Current Validity</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      From: <strong>{formatDate(currentValidityStr)}</strong>
                    </div>
                  </button>
                )}

                {/* Option 2: Extend from Present Date (Today) */}
                <button
                  type="button"
                  onClick={() => setStartMode('FROM_PRESENT')}
                  style={{
                    padding: '0.65rem 0.75rem',
                    borderRadius: '10px',
                    border: startMode === 'FROM_PRESENT' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    background: startMode === 'FROM_PRESENT' ? '#eef2ff' : '#ffffff',
                    color: startMode === 'FROM_PRESENT' ? '#4338ca' : '#334155',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} color="#059669" />
                    <span>Extend from Present (Today)</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    From present: <strong>{formatDate(todayStr)}</strong>
                  </div>
                </button>
              </div>

              {/* Current vs Projected Validity Preview */}
              <div style={{ background: '#ffffff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', fontWeight: 600 }}>STARTING EXTENSION FROM</span>
                    <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>
                      {formatDate(effectiveStartDateStr)}
                    </strong>
                    {effectiveStartDateStr < todayStr && (
                      <span style={{ fontSize: '0.7rem', color: '#d97706', display: 'block' }}>(Past month continuation)</span>
                    )}
                    {effectiveStartDateStr === todayStr && (
                      <span style={{ fontSize: '0.7rem', color: '#059669', display: 'block' }}>(Present date)</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', color: '#4f46e5' }}>
                    <ArrowRight size={22} />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#059669', display: 'block', fontWeight: 700 }}>NEW EXTENDED UNTIL</span>
                    <strong style={{ color: '#059669', fontSize: '1.1rem', fontWeight: 800 }}>
                      {formatDate(projectedEndDateStr)}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: '#4f46e5', display: 'block', fontWeight: 600 }}>
                      (+{months} month{months > 1 ? 's' : ''})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="form-group">
              <label className="form-label">Extension Duration</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMonths(num)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: months === num ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                      background: months === num ? '#eef2ff' : '#ffffff',
                      color: months === num ? '#4338ca' : '#334155',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>{num} {num === 1 ? 'Month' : 'Months'}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 500, color: months === num ? '#4f46e5' : '#64748b', marginTop: '2px' }}>
                      ₹{(monthlyRate * num).toLocaleString('en-IN')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fee Breakdown Structure */}
            <div className="fee-breakdown-box">
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
                Fee Structure Breakdown ({months} month{months > 1 ? 's' : ''})
              </div>
              <div className="fee-row">
                <span>Room Rent & Utilities</span>
                <span>₹{((monthlyRate * 0.65) * months).toLocaleString('en-IN')}</span>
              </div>
              <div className="fee-row">
                <span>Mess & Dining Charges</span>
                <span>₹{((monthlyRate * 0.35) * months).toLocaleString('en-IN')}</span>
              </div>
              <div className="fee-row total">
                <span>Total Amount to Collect</span>
                <span style={{ color: '#4f46e5', fontSize: '1.15rem' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {[
                  { id: 'CASH', label: 'Cash (Warden)', icon: Banknote },
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { id: 'CARD', label: 'Debit/Card', icon: CreditCard },
                  { id: 'NET_BANKING', label: 'NetBanking', icon: ShieldCheck }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id)}
                      style={{
                        padding: '0.65rem 0.4rem',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                        background: isSelected ? '#f5f3ff' : '#ffffff',
                        color: isSelected ? '#4f46e5' : '#475569',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive UPI QR & Copy Box if UPI selected */}
            {paymentMethod === 'UPI' && (
              <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '46px', height: '46px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={30} color="#334155" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>Scan & Pay via any UPI App</div>
                    <code style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600 }}>hostelfee@royalheritage.upi</code>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText('hostelfee@royalheritage.upi');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  style={{ fontSize: '0.75rem' }}
                >
                  {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy UPI ID'}</span>
                </button>
              </div>
            )}

            {/* Transaction / Reference ID */}
            <div className="form-group">
              <label className="form-label">
                Transaction / Receipt Reference (Optional - Auto-generated if left blank)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CASH-RCP-104 or UPI-UTR-983274"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>

            {/* Remarks */}
            <div className="form-group">
              <label className="form-label">Warden Remarks / Notes</label>
              <input
                type="text"
                className="form-input"
                placeholder={`Monthly fee collected for Room ${student.roomNumber}`}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          {/* Footer - Pinned at bottom */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <CheckCircle2 size={16} />
              {isSubmitting ? 'Recording Extension...' : `Record ₹${totalAmount.toLocaleString('en-IN')} & Extend Stay`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

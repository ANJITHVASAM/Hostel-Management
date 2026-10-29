import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Home, 
  Users, 
  Phone, 
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { api } from '../services/api';

export default function StudentPortal({ 
  students = [], 
  rooms = [], 
  onOpenPaymentModal, 
  onViewReceipt 
}) {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || null);
  const [studentPayments, setStudentPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Set default student if not set
  useEffect(() => {
    if (!selectedStudentId && students.length > 0) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  const currentStudent = students.find(s => s.id === Number(selectedStudentId)) || students[0];

  // Fetch payments for selected student
  useEffect(() => {
    if (currentStudent?.id) {
      setLoadingPayments(true);
      api.getPaymentsByStudentId(currentStudent.id)
        .then(setStudentPayments)
        .catch(console.error)
        .finally(() => setLoadingPayments(false));
    }
  }, [currentStudent?.id]);

  if (!currentStudent) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
        No student profile found. Please register a student in the Warden portal first.
      </div>
    );
  }

  const currentRoom = rooms.find(r => r.roomNumber === currentStudent.roomNumber);
  const roommates = students.filter(s => s.roomNumber === currentStudent.roomNumber && s.id !== currentStudent.id && s.active);

  const daysRemaining = currentStudent.daysRemaining;
  const isOverdue = daysRemaining < 0;
  const isExpiringSoon = daysRemaining >= 0 && daysRemaining <= 7;
  const isPaid = daysRemaining > 7;

  // Calculate progress bar percentage (out of 30 days standard month)
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
    <div>
      {/* Student Profile Quick Switcher */}
      <div style={{ 
        background: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '16px', 
        padding: '1rem 1.25rem', 
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 800
          }}>
            {currentStudent.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {currentStudent.name}
              </h3>
              <StatusBadge status={currentStudent.paymentStatus} daysRemaining={currentStudent.daysRemaining} />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Roll No: <strong style={{ color: '#334155' }}>{currentStudent.rollNumber}</strong> • Room: <strong style={{ color: '#334155' }}>{currentStudent.roomNumber} ({currentStudent.bedNumber})</strong>
            </div>
          </div>
        </div>

        {/* Profile Switcher Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Switch Student:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 1.75rem 0.45rem 0.75rem', fontSize: '0.85rem', fontWeight: 600 }}
            value={selectedStudentId || ''}
            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNumber}) - {s.paymentStatus}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Stay Validity Tracker Banner */}
      <div className="stay-card">
        <div className="stay-header">
          <div>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a5b4fc', fontWeight: 700, marginBottom: '0.35rem' }}>
              Hostel Stay & Payment Status
            </div>
            
            <div className="stay-countdown">
              {isOverdue ? (
                <span style={{ color: '#fca5a5' }}>Expired {Math.abs(daysRemaining)} Days Ago</span>
              ) : (
                <span>{daysRemaining} Days Remaining</span>
              )}
            </div>

            <div style={{ fontSize: '0.95rem', color: '#e0e7ff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} />
              <span>Current Stay Valid Until: <strong>{formatDate(currentStudent.stayValidUntil)}</strong></span>
            </div>
          </div>

          <div>
            <button
              className="btn btn-primary"
              style={{
                background: '#ffffff',
                color: '#4f46e5',
                fontSize: '0.95rem',
                fontWeight: 800,
                padding: '0.75rem 1.4rem',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
              }}
              onClick={() => onOpenPaymentModal(currentStudent)}
            >
              <CreditCard size={18} />
              Pay 1 Month Fee & Extend Stay
            </button>
          </div>
        </div>

        {/* Stay Validity Progress Bar */}
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${isOverdue ? 100 : progressPercent}%`,
              background: isOverdue ? '#ef4444' : (isExpiringSoon ? '#f59e0b' : '#10b981')
            }}
          ></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#c7d2fe' }}>
          <span>Stay Started: {formatDate(currentStudent.admissionDate)}</span>
          <span>
            Status:{' '}
            <strong style={{ color: isOverdue ? '#fca5a5' : '#86efac' }}>
              {isOverdue ? 'Overdue - Renew immediately' : (isExpiringSoon ? 'Expiring in less than a week' : 'Active & Up to Date')}
            </strong>
          </span>
        </div>
      </div>

      {/* Grid: Fee Structure + Room Information */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        
        {/* Fee Payment Structure Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FileText size={18} color="#4f46e5" />
              <span>Your Monthly Fee Structure</span>
            </div>
          </div>
          <div className="card-body">
            <div className="fee-breakdown-box" style={{ marginTop: 0 }}>
              <div className="fee-row">
                <span>Room Stay & Utilities</span>
                <strong>₹{((currentStudent.monthlyFee || 6000) * 0.65).toLocaleString('en-IN')}</strong>
              </div>
              <div className="fee-row">
                <span>Mess & 3-Course Meals</span>
                <strong>₹{((currentStudent.monthlyFee || 6000) * 0.35).toLocaleString('en-IN')}</strong>
              </div>
              <div className="fee-row total">
                <span>Monthly Rent (1 Month)</span>
                <span style={{ color: '#4f46e5' }}>₹{(currentStudent.monthlyFee || 6000).toLocaleString('en-IN')}/mo</span>
              </div>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.85rem', fontSize: '0.825rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>Paying 1 month automatically extends your stay validity by 30 days!</span>
            </div>
          </div>
        </div>

        {/* Room & Roommates Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Home size={18} color="#4f46e5" />
              <span>Room & Residence Details</span>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>ROOM NUMBER</span>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{currentStudent.roomNumber}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>BED ASSIGNED</span>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#4f46e5' }}>{currentStudent.bedNumber || 'Bed-1'}</div>
              </div>
            </div>

            {currentRoom?.amenities && (
              <div style={{ fontSize: '0.8rem', color: '#475569', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <strong>Facilities:</strong> {currentRoom.amenities}
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Users size={14} />
                <span>Roommates in {currentStudent.roomNumber}</span>
              </div>
              {roommates.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>No other roommates currently allocated.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {roommates.map((rm) => (
                    <div key={rm.id} style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem', background: '#f8fafc', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>{rm.name}</span>
                      <span style={{ color: '#64748b' }}>{rm.bedNumber} • {rm.phone}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Payment History & Downloadable Receipts */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <FileText size={18} color="#4f46e5" />
              <span>Your Stay Payment History & Receipts</span>
            </div>
            <div className="card-subtitle">
              Track previous month fee payments and view printable receipts
            </div>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => onOpenPaymentModal(currentStudent)}
          >
            <CreditCard size={15} />
            Make New Payment
          </button>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {loadingPayments ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Loading your payment records...
            </div>
          ) : studentPayments.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
              No payments recorded yet for this student.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Receipt No</th>
                    <th>Payment Date</th>
                    <th>Stay Validity Extended</th>
                    <th>Duration</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {studentPayments.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong style={{ color: '#0f172a' }}>{p.receiptNumber || 'REC-' + p.id}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.transactionId}</div>
                      </td>

                      <td>
                        {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: '#166534' }}>
                          {formatDate(p.periodStartDate)} → {formatDate(p.periodEndDate)}
                        </div>
                      </td>

                      <td>{p.monthsExtended || 1} Month(s)</td>

                      <td style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{p.amount?.toLocaleString('en-IN')}
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
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: p.paymentStatus === 'SUCCESS' ? '#ecfdf5' : '#fef3c7',
                          color: p.paymentStatus === 'SUCCESS' ? '#059669' : '#d97706',
                          border: p.paymentStatus === 'SUCCESS' ? '1px solid #a7f3d0' : '1px solid #fde68a'
                        }}>
                          {p.paymentStatus === 'SUCCESS' ? 'PAID & VERIFIED' : 'PENDING'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onViewReceipt(p)}
                        >
                          <Printer size={13} />
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Hostel Help & Warden Assistance Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginTop: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#fef3c7', color: '#d97706', padding: '10px', borderRadius: '10px' }}>
            <Phone size={22} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, color: '#0f172a' }}>Need Assistance or Facing Room Issues?</h4>
            <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
              Warden Office is open 8:00 AM – 8:00 PM. Gate closure curfew: 10:00 PM sharp.
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4f46e5' }}>
          Warden Helpline: +91 98765-43200
        </div>
      </div>
    </div>
  );
}

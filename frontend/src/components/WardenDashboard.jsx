import React, { useState } from 'react';
import { 
  Users, 
  Bed, 
  IndianRupee, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle,
  FileText,
  Layers,
  LayoutGrid,
  PlusCircle,
  CreditCard,
  UserCheck,
  Sparkles,
  Undo2
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function WardenDashboard({ 
  stats, 
  students = [], 
  rooms = [], 
  payments = [], 
  onOpenPaymentModal, 
  onOpenAddStudent, 
  onViewReceipt,
  onVerifyPayment,
  onRevertPayment,
  onNavigateToStudents,
  onViewStudentLedger 
}) {
  const [viewMode, setViewMode] = useState('ANALYTICS'); // 'ANALYTICS' or 'BED_MATRIX'
  const [selectedFloor, setSelectedFloor] = useState('ALL');

  const pendingPayments = payments.filter(p => p.paymentStatus === 'PENDING_VERIFICATION');
  const expiringStudents = students.filter(s => s.paymentStatus === 'EXPIRING_SOON');
  const overdueStudents = students.filter(s => s.paymentStatus === 'OVERDUE');

  // Group rooms by floor
  const floors = Array.from(new Set(rooms.map(r => r.floor || 1))).sort((a, b) => a - b);
  const filteredRooms = selectedFloor === 'ALL' 
    ? rooms 
    : rooms.filter(r => r.floor === Number(selectedFloor));

  return (
    <div>
      {/* Executive Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.65rem', backdropFilter: 'blur(8px)' }}>
            <Sparkles size={13} color="#a5b4fc" />
            <span>Warden Command Center</span>
          </div>
          <h2>Royal Heritage Residence</h2>
          <p>
            Managing {stats?.totalStudents || 0} residents across {stats?.totalRooms || 0} rooms • {stats?.availableBeds || 0} beds available for allocation
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn"
            style={{
              background: '#ffffff',
              color: '#312e81',
              fontWeight: 800,
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}
            onClick={() => onOpenAddStudent()}
          >
            <PlusCircle size={16} />
            Register Student
          </button>

          <button
            className="btn"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(8px)',
              fontWeight: 700
            }}
            onClick={() => setViewMode(viewMode === 'BED_MATRIX' ? 'ANALYTICS' : 'BED_MATRIX')}
          >
            <LayoutGrid size={16} />
            {viewMode === 'BED_MATRIX' ? 'View Summary' : 'Floor Bed Map'}
          </button>
        </div>
      </div>

      {/* Pending Verifications Banner if any */}
      {pendingPayments.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid #93c5fd',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#2563eb', color: 'white', padding: '8px', borderRadius: '10px' }}>
                <Clock size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '1.05rem' }}>
                  {pendingPayments.length} Student Payment Verification Request(s)
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#1e40af' }}>
                  Residents have submitted fee extensions online. Review and approve with 1 click:
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.75rem' }}>
            {pendingPayments.map((p) => (
              <div 
                key={p.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{p.studentName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Roll: {p.studentRollNumber} | Room: {p.roomNumber} | Mode: {p.paymentMethod}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                    ₹{p.amount?.toLocaleString('en-IN')} (+{p.monthsExtended || 1} mo)
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => onVerifyPayment(p.id, true)}
                    title="Approve and extend stay"
                  >
                    <CheckCircle2 size={15} />
                    Approve
                  </button>
                  <button 
                    className="btn btn-sm btn-danger-outline"
                    onClick={() => onVerifyPayment(p.id, false)}
                    title="Reject payment"
                  >
                    <XCircle size={15} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Clickable KPI Stats */}
      <div className="stats-grid">
        {/* Stat 1: Total Students */}
        <div 
          className="stat-card clickable stat-indigo" 
          onClick={() => onNavigateToStudents('ALL')}
          title="Click to view all resident records"
        >
          <div className="stat-info">
            <div className="stat-label">Active Hostellers</div>
            <div className="stat-value">{stats?.totalStudents || 0}</div>
            <div className="stat-hint" style={{ color: '#4f46e5', fontWeight: 700 }}>
              Click to view directory →
            </div>
          </div>
          <div className="stat-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
            <Users size={24} />
          </div>
        </div>

        {/* Stat 2: Bed Occupancy */}
        <div 
          className="stat-card clickable stat-emerald"
          onClick={() => setViewMode(viewMode === 'BED_MATRIX' ? 'ANALYTICS' : 'BED_MATRIX')}
          title="Click to toggle interactive floor bed matrix"
        >
          <div className="stat-info">
            <div className="stat-label">Bed Occupancy</div>
            <div className="stat-value" style={{ color: '#047857' }}>
              {stats?.occupiedBeds || 0} / {stats?.totalBeds || 0}
            </div>
            <div className="stat-hint" style={{ color: '#16a34a', fontWeight: 700 }}>
              {stats?.availableBeds || 0} vacant (Click to view map) →
            </div>
          </div>
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <Bed size={24} />
          </div>
        </div>

        {/* Stat 3: Monthly Collection */}
        <div 
          className="stat-card clickable stat-teal"
          onClick={() => onNavigateToStudents('HISTORY')}
          title="Click to view collection invoices"
        >
          <div className="stat-info">
            <div className="stat-label">Monthly Collection</div>
            <div className="stat-value" style={{ color: '#0f766e' }}>
              ₹{(stats?.totalRevenueThisMonth || 0).toLocaleString('en-IN')}
            </div>
            <div className="stat-hint" style={{ color: '#0d9488', fontWeight: 700 }}>
              View audit receipts →
            </div>
          </div>
          <div className="stat-icon" style={{ background: '#f0fdfa', color: '#0d9488' }}>
            <IndianRupee size={24} />
          </div>
        </div>

        {/* Stat 4: Overdue & Expiring Alerts */}
        <div 
          className="stat-card clickable stat-rose"
          style={{ borderColor: (stats?.overdueCount || 0) > 0 ? '#fecdd3' : '#e2e8f0' }}
          onClick={() => onNavigateToStudents('DUE')}
          title="Click to filter residents needing extension"
        >
          <div className="stat-info">
            <div className="stat-label">Fee Status Alerts</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#e11d48' }}>
                {stats?.overdueCount || 0} Overdue
              </span>
              <span style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: 700 }}>
                • {stats?.expiringSoonCount || 0} Due Soon
              </span>
            </div>
            <div className="stat-hint" style={{ color: '#e11d48', fontWeight: 700 }}>
              Resolve renewals →
            </div>
          </div>
          <div className="stat-icon" style={{ background: '#fff1f2', color: '#e11d48' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Interactive View Switcher Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '10px', gap: '4px' }}>
          <button
            onClick={() => setViewMode('ANALYTICS')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'ANALYTICS' ? '#ffffff' : 'transparent',
              color: viewMode === 'ANALYTICS' ? '#4f46e5' : '#475569',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: viewMode === 'ANALYTICS' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <FileText size={15} />
            <span>Overview & Priority Actions</span>
          </button>

          <button
            onClick={() => setViewMode('BED_MATRIX')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'BED_MATRIX' ? '#ffffff' : 'transparent',
              color: viewMode === 'BED_MATRIX' ? '#4f46e5' : '#475569',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: viewMode === 'BED_MATRIX' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <LayoutGrid size={15} />
            <span>Interactive Floor & Bed Matrix</span>
          </button>
        </div>

        {viewMode === 'BED_MATRIX' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Filter Floor:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 1.5rem 0.35rem 0.75rem', fontSize: '0.85rem' }}
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              <option value="ALL">All Floors ({floors.length})</option>
              {floors.map(f => (
                <option key={f} value={f}>Floor {f}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* VIEW 1: INTERACTIVE FLOOR & BED MATRIX */}
      {viewMode === 'BED_MATRIX' && (
        <div>
          {floors
            .filter(f => selectedFloor === 'ALL' || f === Number(selectedFloor))
            .map((floorNum) => {
              const floorRooms = rooms.filter(r => (r.floor || 1) === floorNum);

              return (
                <div key={floorNum} className="floor-section">
                  <div className="floor-badge">
                    <Layers size={15} color="#4f46e5" />
                    <span>FLOOR {floorNum} RESIDENCE WING</span>
                    <span style={{ color: '#64748b', fontWeight: 500, fontSize: '0.75rem' }}>
                      ({floorRooms.length} Rooms • {floorRooms.reduce((acc, r) => acc + (r.capacity || 0), 0)} Beds)
                    </span>
                  </div>

                  <div className="rooms-matrix-grid">
                    {floorRooms.map((room) => {
                      const roomCapacity = room.capacity || 1;
                      const roomStudents = students.filter(s => s.roomNumber === room.roomNumber && s.active);

                      return (
                        <div key={room.id} className="matrix-room-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div>
                              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                                Room {room.roomNumber}
                              </h4>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                {room.roomType} • ₹{(room.totalMonthlyFee || 6000).toLocaleString('en-IN')}/mo
                              </div>
                            </div>

                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: roomStudents.length < roomCapacity ? '#ecfdf5' : '#fef2f2',
                              color: roomStudents.length < roomCapacity ? '#059669' : '#dc2626',
                              border: roomStudents.length < roomCapacity ? '1px solid #a7f3d0' : '1px solid #fecaca'
                            }}>
                              {roomStudents.length}/{roomCapacity} Beds
                            </span>
                          </div>

                          {/* Bed Slots */}
                          <div className="bed-slots-container">
                            {Array.from({ length: roomCapacity }).map((_, idx) => {
                              const studentInBed = roomStudents[idx];

                              if (studentInBed) {
                                const isOverdue = studentInBed.paymentStatus === 'OVERDUE';
                                const isExpiring = studentInBed.paymentStatus === 'EXPIRING_SOON';

                                return (
                                  <div
                                    key={idx}
                                    className="bed-slot"
                                    onClick={() => onViewStudentLedger(studentInBed)}
                                    title="Click to view resident stay ledger & extend stay"
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <div style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '50%',
                                        background: isOverdue ? '#fee2e2' : (isExpiring ? '#fef3c7' : '#e0e7ff'),
                                        color: isOverdue ? '#dc2626' : (isExpiring ? '#d97706' : '#4f46e5'),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '0.75rem'
                                      }}>
                                        {studentInBed.name.charAt(0)}
                                      </div>
                                      <div>
                                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.8rem' }}>
                                          {studentInBed.name}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                          {studentInBed.bedNumber || `Bed ${idx + 1}`}
                                        </div>
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                      <StatusBadge status={studentInBed.paymentStatus} daysRemaining={studentInBed.daysRemaining} />
                                    </div>
                                  </div>
                                );
                              }

                              // Vacant Bed Slot
                              return (
                                <div
                                  key={idx}
                                  className="bed-slot vacant"
                                  onClick={() => onOpenAddStudent(room.roomNumber)}
                                  title="Click to register resident into this vacant bed"
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontWeight: 600 }}>
                                    <PlusCircle size={15} />
                                    <span>Bed {idx + 1} Vacant</span>
                                  </div>
                                  <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>
                                    + Assign
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* VIEW 2: OVERVIEW & PRIORITY ACTIONS */}
      {viewMode === 'ANALYTICS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Urgent Stay Renewals Needed */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <Clock size={18} color="#d97706" />
                  <span>Renewals & Overdue Stays</span>
                </div>
                <div className="card-subtitle">Hostellers due for their next 1-month fee payment</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => onNavigateToStudents('DUE')}>
                View All
              </button>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {expiringStudents.length === 0 && overdueStudents.length === 0 ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                  All students have paid their monthly fee on time! 🎉
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Resident</th>
                        <th>Room</th>
                        <th>Stay Expiry</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>1-Click Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...overdueStudents, ...expiringStudents].slice(0, 6).map((s) => (
                        <tr key={s.id}>
                          <td>
                            <div 
                              style={{ fontWeight: 700, color: '#0f172a', cursor: 'pointer', textDecoration: 'underline decoration-transparent hover:decoration-indigo-500' }}
                              onClick={() => onViewStudentLedger(s)}
                              title="Click to view stay ledger"
                            >
                              {s.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.rollNumber}</div>
                          </td>
                          <td>
                            <strong>Room {s.roomNumber}</strong>
                          </td>
                          <td>
                            {s.stayValidUntil ? new Date(s.stayValidUntil).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short'
                            }) : 'N/A'}
                          </td>
                          <td>
                            <StatusBadge status={s.paymentStatus} daysRemaining={s.daysRemaining} />
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => onOpenPaymentModal(s)}
                              title="Record payment and extend stay"
                            >
                              <CreditCard size={13} />
                              Extend
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

          {/* Recent Payment Receipts */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <FileText size={18} color="#4f46e5" />
                  <span>Recent Fee Invoices</span>
                </div>
                <div className="card-subtitle">Latest fee extensions recorded</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => onNavigateToStudents('HISTORY')}>
                Audit Log
              </button>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {payments.length === 0 ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                  No payment transactions recorded yet.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Receipt #</th>
                        <th>Resident</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.slice(0, 6).map((p) => (
                        <tr key={p.id}>
                          <td>
                            <code style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                              {p.receiptNumber || 'REC-' + p.id}
                            </code>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{p.studentName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Room {p.roomNumber}</div>
                          </td>
                          <td style={{ fontWeight: 800, color: p.paymentStatus === 'REVERTED' ? '#dc2626' : '#059669' }}>
                            {p.paymentStatus === 'REVERTED' ? (
                              <del style={{ color: '#94a3b8' }}>₹{p.amount?.toLocaleString('en-IN')}</del>
                            ) : (
                              <span>₹{p.amount?.toLocaleString('en-IN')}</span>
                            )}
                          </td>
                          <td>
                            {p.paymentStatus === 'SUCCESS' && (
                              <span className="badge badge-paid" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>Paid</span>
                            )}
                            {p.paymentStatus === 'REVERTED' && (
                              <span className="badge badge-overdue" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>Unpaid / Void</span>
                            )}
                            {p.paymentStatus === 'PENDING_VERIFICATION' && (
                              <span className="badge badge-pending" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>Pending</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => onViewReceipt(p)}
                                title="Print / View Receipt"
                                style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                              >
                                Receipt
                              </button>
                              {p.paymentStatus === 'SUCCESS' && (
                                <button
                                  className="btn btn-sm btn-danger-outline"
                                  onClick={() => onRevertPayment(p)}
                                  title="Mistaken extension? Mark as unpaid and roll back stay validity"
                                  style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                                >
                                  <Undo2 size={12} />
                                  <span>Mark Unpaid</span>
                                </button>
                              )}
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

        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  CreditCard, 
  Edit3, 
  LogOut, 
  Calendar, 
  Phone, 
  History, 
  Download, 
  ArrowUpDown, 
  X,
  Filter
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
  'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
  'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)'
];

const getAvatarGradient = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
};

export default function StudentList({ 
  students = [], 
  onOpenAddStudent, 
  onOpenEditStudent, 
  onOpenPaymentModal, 
  onVacateStudent, 
  onViewStudentHistory,
  initialFilter = 'ALL'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [roomFilter, setRoomFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('URGENT'); // 'URGENT', 'NAME', 'ROOM', 'FEE'

  // Unique list of rooms for filter
  const roomNumbers = Array.from(new Set(students.map(s => s.roomNumber).filter(Boolean))).sort();

  // Filter & Sort
  const filteredStudents = students
    .filter((s) => {
      // Search query match
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        s.name?.toLowerCase().includes(term) ||
        s.rollNumber?.toLowerCase().includes(term) ||
        s.roomNumber?.toLowerCase().includes(term) ||
        s.phone?.includes(term);

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter === 'PAID' && s.paymentStatus !== 'PAID') return false;
      if (statusFilter === 'EXPIRING_SOON' && s.paymentStatus !== 'EXPIRING_SOON') return false;
      if (statusFilter === 'OVERDUE' && s.paymentStatus !== 'OVERDUE' && s.paymentStatus !== 'DUE') return false;
      if (statusFilter === 'PENDING' && s.paymentStatus !== 'PENDING_APPROVAL') return false;

      // Room filter
      if (roomFilter !== 'ALL' && s.roomNumber !== roomFilter) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'URGENT') {
        // Overdue first, then expiring soon, then paid
        const daysA = a.daysRemaining !== undefined ? a.daysRemaining : 999;
        const daysB = b.daysRemaining !== undefined ? b.daysRemaining : 999;
        return daysA - daysB;
      }
      if (sortBy === 'NAME') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'ROOM') {
        return (a.roomNumber || '').localeCompare(b.roomNumber || '');
      }
      if (sortBy === 'FEE') {
        return (b.monthlyFee || 0) - (a.monthlyFee || 0);
      }
      return 0;
    });

  const getFilterCount = (type) => {
    if (type === 'ALL') return students.length;
    if (type === 'PAID') return students.filter(s => s.paymentStatus === 'PAID').length;
    if (type === 'EXPIRING_SOON') return students.filter(s => s.paymentStatus === 'EXPIRING_SOON').length;
    if (type === 'OVERDUE') return students.filter(s => s.paymentStatus === 'OVERDUE' || s.paymentStatus === 'DUE').length;
    if (type === 'PENDING') return students.filter(s => s.paymentStatus === 'PENDING_APPROVAL').length;
    return 0;
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      alert('No student records to export.');
      return;
    }

    const headers = ['Roll Number', 'Name', 'Phone', 'Room', 'Bed', 'Monthly Fee', 'Stay Valid Until', 'Days Remaining', 'Payment Status'];
    const rows = filteredStudents.map(s => [
      `"${s.rollNumber || ''}"`,
      `"${s.name || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.roomNumber || ''}"`,
      `"${s.bedNumber || ''}"`,
      s.monthlyFee || 0,
      `"${s.stayValidUntil || ''}"`,
      s.daysRemaining !== undefined ? s.daysRemaining : '',
      `"${s.paymentStatus || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hostel_Residents_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Student Resident Directory</div>
          <div className="card-subtitle">
            Manage student records, room allocations, and stay validity dates
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleExportCSV}
            title="Export filtered resident records to CSV spreadsheet"
          >
            <Download size={14} />
            Export CSV
          </button>

          <button className="btn btn-primary" onClick={() => onOpenAddStudent()}>
            <UserPlus size={16} />
            Register New Student
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Search & Interactive Filter Controls */}
        <div className="search-filter-bar">
          {/* Search Box with Clear Button */}
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search by student name, roll number, room, phone..."
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

          {/* Interactive Sorting & Room Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#64748b' }}>
              <ArrowUpDown size={14} />
              <select
                className="form-select"
                style={{ padding: '0.4rem 1.75rem 0.4rem 0.65rem', fontSize: '0.8rem', fontWeight: 600, width: 'auto' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="URGENT">Sort: Expiry (Urgent First)</option>
                <option value="NAME">Sort: Name (A-Z)</option>
                <option value="ROOM">Sort: Room Number</option>
                <option value="FEE">Sort: Monthly Fee (High-Low)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#64748b' }}>
              <Filter size={14} />
              <select
                className="form-select"
                style={{ padding: '0.4rem 1.75rem 0.4rem 0.65rem', fontSize: '0.8rem', fontWeight: 600, width: 'auto' }}
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
              >
                <option value="ALL">All Rooms ({roomNumbers.length})</option>
                {roomNumbers.map(r => (
                  <option key={r} value={r}>Room {r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {[
            { id: 'ALL', label: 'All Residents' },
            { id: 'PAID', label: 'Paid & Active' },
            { id: 'EXPIRING_SOON', label: 'Expiring Soon' },
            { id: 'OVERDUE', label: 'Overdue Dues' },
            { id: 'PENDING', label: 'Pending Approval' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '8px',
                border: statusFilter === tab.id ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                background: statusFilter === tab.id ? '#eef2ff' : '#ffffff',
                color: statusFilter === tab.id ? '#4f46e5' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: '0.7rem',
                background: statusFilter === tab.id ? '#4f46e5' : '#f1f5f9',
                color: statusFilter === tab.id ? '#ffffff' : '#475569',
                padding: '1px 6px',
                borderRadius: '10px'
              }}>
                {getFilterCount(tab.id)}
              </span>
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Resident Profile</th>
                <th>Room & Bed</th>
                <th>Monthly Fee</th>
                <th>Stay Valid Until</th>
                <th>Payment Status</th>
                <th>Contact</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No students match the selected search & filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: getAvatarGradient(s.name),
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          flexShrink: 0,
                          boxShadow: '0 3px 8px rgba(0,0,0,0.1)'
                        }}>
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div 
                            style={{ fontWeight: 800, color: '#0f172a', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                            onClick={() => onViewStudentHistory(s)}
                            title="Click to view full stay ledger & invoices"
                          >
                            <span style={{ borderBottom: '1px dashed #6366f1' }}>{s.name}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            ID: <span style={{ fontWeight: 600 }}>{s.rollNumber}</span>
                          </div>
                          {s.notes && (
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {s.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>Room {s.roomNumber}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.bedNumber || 'Bed 1'}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{s.monthlyFee?.toLocaleString('en-IN') || '6,000'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>per month</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} color="#64748b" />
                        <span>
                          {s.stayValidUntil ? new Date(s.stayValidUntil).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : 'Not Set'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                        {s.daysRemaining !== undefined && (
                          <span style={{
                            color: s.daysRemaining < 0 ? '#dc2626' : (s.daysRemaining <= 7 ? '#d97706' : '#16a34a'),
                            fontWeight: 700
                          }}>
                            {s.daysRemaining < 0 
                              ? `Expired ${Math.abs(s.daysRemaining)} days ago` 
                              : `${s.daysRemaining} days left`}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <StatusBadge status={s.paymentStatus} daysRemaining={s.daysRemaining} />
                    </td>

                    <td>
                      <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Phone size={12} color="#64748b" />
                        <span>{s.phone}</span>
                      </div>
                      {s.parentPhone && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          P: {s.parentPhone}
                        </div>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onOpenPaymentModal(s)}
                          title="Record payment and extend stay by 1 month"
                        >
                          <CreditCard size={14} />
                          Extend Stay
                        </button>

                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onViewStudentHistory(s)}
                          title="View stay ledger & invoices"
                        >
                          <History size={14} />
                        </button>

                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onOpenEditStudent(s)}
                          title="Edit student profile"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          className="btn btn-sm btn-danger-outline"
                          onClick={() => onVacateStudent(s)}
                          title="Vacate student and release room bed"
                        >
                          <LogOut size={14} />
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

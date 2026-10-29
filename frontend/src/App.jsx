import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  CreditCard, 
  Bed, 
  FileText, 
  ShieldAlert, 
  LayoutDashboard,
  ShieldCheck,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { api } from './services/api';
import WardenDashboard from './components/WardenDashboard';
import StudentList from './components/StudentList';
import RoomFeeStructure from './components/RoomFeeStructure';
import PaymentHistoryAudit from './components/PaymentHistoryAudit';
import PaymentModal from './components/PaymentModal';
import AddEditStudentModal from './components/AddEditStudentModal';
import ReceiptModal from './components/ReceiptModal';
import StudentLedgerModal from './components/StudentLedgerModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // 'DASHBOARD', 'STUDENTS', 'ROOMS', 'PAYMENTS'
  const [studentFilter, setStudentFilter] = useState('ALL');

  // Core Data States
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(true);

  // Modal States
  const [paymentModalStudent, setPaymentModalStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [viewingStudentLedger, setViewingStudentLedger] = useState(null);

  // Success Notification
  const [notification, setNotification] = useState(null);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Load all data from Spring Boot API
  const loadAllData = async () => {
    try {
      const [statsData, studentsData, roomsData, paymentsData] = await Promise.all([
        api.getDashboardStats(),
        api.getStudents(),
        api.getRooms(),
        api.getAllPayments()
      ]);

      setStats(statsData);
      setStudents(studentsData);
      setRooms(roomsData);
      setPayments(paymentsData);
      setBackendConnected(true);
    } catch (err) {
      console.error('API Error:', err);
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handlePaymentSuccess = (paymentRecord) => {
    loadAllData();
    showToast(`Payment of ₹${paymentRecord.amount?.toLocaleString('en-IN')} recorded! Stay validity extended by ${paymentRecord.monthsExtended || 1} month.`);
    setViewingReceipt(paymentRecord);
  };

  const handleStudentSuccess = () => {
    loadAllData();
    showToast('Student resident record saved successfully.');
  };

  const handleVacateStudent = async (student) => {
    if (window.confirm(`Are you sure you want to mark ${student.name} as vacated? This will release their bed in room ${student.roomNumber}.`)) {
      try {
        await api.vacateStudent(student.id);
        loadAllData();
        showToast(`${student.name} has been vacated from room ${student.roomNumber}.`);
      } catch (err) {
        alert(err.message || 'Failed to vacate student');
      }
    }
  };

  const handleVerifyPayment = async (paymentId, approve) => {
    try {
      await api.verifyPayment(paymentId, approve);
      loadAllData();
      showToast(approve ? 'Student payment approved and stay extended!' : 'Payment has been rejected.');
    } catch (err) {
      alert(err.message || 'Failed to verify payment');
    }
  };

  const handleRevertPayment = async (payment) => {
    const receiptNo = payment.receiptNumber || 'REC-' + payment.id;
    const confirmMsg = `Are you sure you want to revert/mark unpaid payment ${receiptNo} for ${payment.studentName}?\n\nThis will roll back their stay validity date to ${payment.periodStartDate || 'previous date'} and mark this fee as UNPAID.`;
    if (window.confirm(confirmMsg)) {
      try {
        await api.revertPayment(payment.id, 'Mistaken stay extension reverted by warden');
        await loadAllData();
        showToast(`Payment ${receiptNo} marked as UNPAID! Stay validity rolled back.`);
        return true;
      } catch (err) {
        alert(err.message || 'Failed to revert payment');
        return false;
      }
    }
    return false;
  };

  const handleNavigateFromDashboard = (filterOrTab) => {
    if (filterOrTab === 'HISTORY') {
      setActiveTab('PAYMENTS');
    } else {
      setStudentFilter(filterOrTab === 'DUE' ? 'OVERDUE' : 'ALL');
      setActiveTab('STUDENTS');
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 100,
          background: '#065f46',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 600,
          fontSize: '0.875rem',
          animation: 'modalIn 0.2s ease'
        }}>
          <CheckCircle size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav className="navbar">
        <div className="nav-inner">
          <div className="brand-section">
            <div className="brand-icon">
              <Building2 size={24} />
            </div>
            <div>
              <div className="brand-title">HostelEase</div>
              <div className="brand-subtitle">
                Warden Hostel Management & Fee Portal
              </div>
            </div>
          </div>

          {/* Warden Badge & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
              padding: '0.4rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700
            }}>
              <ShieldCheck size={16} />
              <span>Warden Master Access</span>
            </div>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={loadAllData}
              title="Refresh data from Spring Boot API"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="main-wrapper">
        {/* Backend Connectivity Alert if offline */}
        {!backendConnected && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <ShieldAlert size={18} />
              <span>Spring Boot backend server is connecting on <code>http://localhost:8080</code>...</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={loadAllData}>
              Retry Connection
            </button>
          </div>
        )}

        {/* Warden Navigation Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'DASHBOARD' ? 'active' : ''}`}
            onClick={() => setActiveTab('DASHBOARD')}
          >
            <LayoutDashboard size={17} />
            <span>Overview & Analytics</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'STUDENTS' ? 'active' : ''}`}
            onClick={() => {
              setStudentFilter('ALL');
              setActiveTab('STUDENTS');
            }}
          >
            <Users size={17} />
            <span>Student Residents ({students.length})</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'ROOMS' ? 'active' : ''}`}
            onClick={() => setActiveTab('ROOMS')}
          >
            <Bed size={17} />
            <span>Rooms & Fee Structure ({rooms.length})</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'PAYMENTS' ? 'active' : ''}`}
            onClick={() => setActiveTab('PAYMENTS')}
          >
            <CreditCard size={17} />
            <span>Fee Payments & Receipts ({payments.length})</span>
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'DASHBOARD' && (
          <WardenDashboard
            stats={stats}
            students={students}
            rooms={rooms}
            payments={payments}
            onOpenPaymentModal={(s) => setPaymentModalStudent(s)}
            onOpenAddStudent={(roomNum) => {
              setEditingStudent(roomNum ? { roomNumber: roomNum } : null);
              setShowAddStudentModal(true);
            }}
            onViewReceipt={(p) => setViewingReceipt(p)}
            onVerifyPayment={handleVerifyPayment}
            onRevertPayment={handleRevertPayment}
            onNavigateToStudents={handleNavigateFromDashboard}
            onViewStudentLedger={(s) => setViewingStudentLedger(s)}
          />
        )}

        {activeTab === 'STUDENTS' && (
          <StudentList
            students={students}
            initialFilter={studentFilter}
            onOpenAddStudent={() => {
              setEditingStudent(null);
              setShowAddStudentModal(true);
            }}
            onOpenEditStudent={(s) => {
              setEditingStudent(s);
              setShowAddStudentModal(true);
            }}
            onOpenPaymentModal={(s) => setPaymentModalStudent(s)}
            onVacateStudent={handleVacateStudent}
            onViewStudentHistory={(s) => {
              setViewingStudentLedger(s);
            }}
          />
        )}

        {activeTab === 'ROOMS' && (
          <RoomFeeStructure
            rooms={rooms}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === 'PAYMENTS' && (
          <PaymentHistoryAudit
            payments={payments}
            onViewReceipt={(p) => setViewingReceipt(p)}
            onRevertPayment={handleRevertPayment}
          />
        )}
      </main>

      {/* MODALS */}
      {/* 1. Payment & Stay Extension Modal */}
      {paymentModalStudent && (
        <PaymentModal
          student={paymentModalStudent}
          isWarden={true}
          onClose={() => setPaymentModalStudent(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* 2. Add / Edit Student Modal */}
      {showAddStudentModal && (
        <AddEditStudentModal
          student={editingStudent}
          rooms={rooms}
          onClose={() => {
            setShowAddStudentModal(false);
            setEditingStudent(null);
          }}
          onSuccess={handleStudentSuccess}
        />
      )}

      {/* 3. Printable Receipt Modal */}
      {viewingReceipt && (
        <ReceiptModal
          payment={viewingReceipt}
          onClose={() => setViewingReceipt(null)}
        />
      )}

      {/* 4. Complete Student Stay Ledger & Tracking Modal */}
      {viewingStudentLedger && (
        <StudentLedgerModal
          student={students.find(s => s.id === viewingStudentLedger.id) || viewingStudentLedger}
          allStudents={students}
          rooms={rooms}
          onClose={() => setViewingStudentLedger(null)}
          onOpenPaymentModal={(s) => setPaymentModalStudent(s)}
          onViewReceipt={(p) => setViewingReceipt(p)}
          onRevertPayment={handleRevertPayment}
        />
      )}
    </div>
  );
}

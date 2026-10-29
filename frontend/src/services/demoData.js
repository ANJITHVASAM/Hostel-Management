// Initial demo data matching Spring Boot DataInitializer
export function getInitialDemoState() {
  const today = new Date();
  const addDays = (d, days) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + days);
    return copy.toISOString().split('T')[0];
  };

  const rooms = [
    { id: 1, roomNumber: 'A-101', floor: 1, roomType: 'Single AC Deluxe', capacity: 1, occupiedBeds: 1, baseRent: 5500, messFee: 2500, maintenanceFee: 500, totalMonthlyFee: 8500, amenities: 'Private Attached Bath, Air Conditioned, Study Desk, High-Speed WiFi' },
    { id: 2, roomNumber: 'A-102', floor: 1, roomType: 'Double Sharing AC', capacity: 2, occupiedBeds: 1, baseRent: 3500, messFee: 2000, maintenanceFee: 500, totalMonthlyFee: 6000, amenities: 'Attached Washroom, Air Conditioned, 2 Lockers, Study Tables' },
    { id: 3, roomNumber: 'B-201', floor: 2, roomType: 'Double Sharing Non-AC', capacity: 2, occupiedBeds: 1, baseRent: 3000, messFee: 2000, maintenanceFee: 500, totalMonthlyFee: 5500, amenities: 'Attached Washroom, Ceiling Fan, Balcony, 2 Closets' },
    { id: 4, roomNumber: 'B-202', floor: 2, roomType: 'Triple Sharing Budget', capacity: 3, occupiedBeds: 1, baseRent: 2200, messFee: 1800, maintenanceFee: 500, totalMonthlyFee: 4500, amenities: 'Common Bath, Spacious Wardrobes, Study Zone, WiFi' },
    { id: 5, roomNumber: 'C-301', floor: 3, roomType: 'Single Premium Suite', capacity: 1, occupiedBeds: 1, baseRent: 6000, messFee: 2500, maintenanceFee: 500, totalMonthlyFee: 9000, amenities: 'Private Balcony, AC, Mini Refrigerator, Study Station' },
  ];

  const students = [
    {
      id: 1,
      rollNumber: 'HST-2026-101',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@hostel.edu',
      phone: '9876543210',
      parentPhone: '9876500001',
      address: '124 Civil Lines, Jaipur',
      roomNumber: 'A-101',
      bedNumber: 'Bed-1',
      monthlyFee: 8500,
      admissionDate: addDays(today, -60),
      stayValidUntil: addDays(today, 30),
      paymentStatus: 'PAID',
      active: true,
      lastPaymentDate: addDays(today, -2),
      notes: 'First floor premium single room. Prefers vegetarian food.',
      daysRemaining: 30,
    },
    {
      id: 2,
      rollNumber: 'HST-2026-102',
      name: 'Rohan Verma',
      email: 'rohan.verma@hostel.edu',
      phone: '9876543211',
      parentPhone: '9876500002',
      address: '45 Mall Road, Chandigarh',
      roomNumber: 'A-102',
      bedNumber: 'Bed-1',
      monthlyFee: 6000,
      admissionDate: addDays(today, -90),
      stayValidUntil: addDays(today, 4),
      paymentStatus: 'EXPIRING_SOON',
      active: true,
      lastPaymentDate: addDays(today, -26),
      notes: 'Reminder sent via SMS for renewal.',
      daysRemaining: 4,
    },
    {
      id: 3,
      rollNumber: 'HST-2026-103',
      name: 'Priya Patel',
      email: 'priya.patel@hostel.edu',
      phone: '9876543212',
      parentPhone: '9876500003',
      address: '88 MG Road, Ahmedabad',
      roomNumber: 'B-201',
      bedNumber: 'Bed-1',
      monthlyFee: 5500,
      admissionDate: addDays(today, -120),
      stayValidUntil: addDays(today, -9),
      paymentStatus: 'OVERDUE',
      active: true,
      lastPaymentDate: addDays(today, -39),
      notes: 'Extension payment delayed due to semester exams.',
      daysRemaining: -9,
    },
    {
      id: 4,
      rollNumber: 'HST-2026-104',
      name: 'Sneha Kulkarni',
      email: 'sneha.k@hostel.edu',
      phone: '9876543213',
      parentPhone: '9876500004',
      address: '12 FC Road, Pune',
      roomNumber: 'B-202',
      bedNumber: 'Bed-1',
      monthlyFee: 4500,
      admissionDate: addDays(today, -30),
      stayValidUntil: addDays(today, -1),
      paymentStatus: 'PENDING_APPROVAL',
      active: true,
      notes: 'Transferred ₹4,500 via UPI. Needs warden confirmation.',
      daysRemaining: -1,
    },
    {
      id: 5,
      rollNumber: 'HST-2026-105',
      name: 'Devansh Nair',
      email: 'devansh.nair@hostel.edu',
      phone: '9876543214',
      parentPhone: '9876500005',
      address: '77 Marine Drive, Kochi',
      roomNumber: 'C-301',
      bedNumber: 'Bed-1',
      monthlyFee: 9000,
      admissionDate: addDays(today, -30),
      stayValidUntil: addDays(today, 45),
      paymentStatus: 'PAID',
      active: true,
      lastPaymentDate: addDays(today, -15),
      notes: 'Paid 2 months in advance.',
      daysRemaining: 45,
    },
  ];

  const payments = [
    {
      id: 1,
      studentId: 1,
      studentRollNumber: 'HST-2026-101',
      studentName: 'Aarav Sharma',
      roomNumber: 'A-101',
      transactionId: 'TXN-20261027-1011',
      receiptNumber: 'REC-2026-00101',
      amount: 8500,
      monthsExtended: 1,
      periodStartDate: addDays(today, -2),
      periodEndDate: addDays(today, 28),
      paymentDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      paymentMethod: 'UPI',
      paymentStatus: 'SUCCESS',
      remarks: 'Monthly fee extension for 1 month',
      recordedBy: 'WARDEN',
    },
    {
      id: 2,
      studentId: 2,
      studentRollNumber: 'HST-2026-102',
      studentName: 'Rohan Verma',
      roomNumber: 'A-102',
      transactionId: 'TXN-20261003-1022',
      receiptNumber: 'REC-2026-00089',
      amount: 6000,
      monthsExtended: 1,
      periodStartDate: addDays(today, -26),
      periodEndDate: addDays(today, 4),
      paymentDate: new Date(Date.now() - 26 * 86400000).toISOString(),
      paymentMethod: 'NET_BANKING',
      paymentStatus: 'SUCCESS',
      remarks: 'October month stay fee',
      recordedBy: 'WARDEN',
    },
    {
      id: 3,
      studentId: 3,
      studentRollNumber: 'HST-2026-103',
      studentName: 'Priya Patel',
      roomNumber: 'B-201',
      transactionId: 'TXN-20260920-1033',
      receiptNumber: 'REC-2026-00054',
      amount: 5500,
      monthsExtended: 1,
      periodStartDate: addDays(today, -69),
      periodEndDate: addDays(today, -9),
      paymentDate: new Date(Date.now() - 39 * 86400000).toISOString(),
      paymentMethod: 'CASH',
      paymentStatus: 'SUCCESS',
      remarks: 'Previous month fee paid in cash',
      recordedBy: 'WARDEN',
    },
    {
      id: 4,
      studentId: 4,
      studentRollNumber: 'HST-2026-104',
      studentName: 'Sneha Kulkarni',
      roomNumber: 'B-202',
      transactionId: 'TXN-UPI-983274921',
      receiptNumber: 'REC-2026-00142',
      amount: 4500,
      monthsExtended: 1,
      periodStartDate: addDays(today, 0),
      periodEndDate: addDays(today, 30),
      paymentDate: new Date(Date.now() - 3 * 3600000).toISOString(),
      paymentMethod: 'UPI',
      paymentStatus: 'PENDING_VERIFICATION',
      remarks: 'Payment submitted via student portal with UPI UTR: 42918839210',
      recordedBy: 'STUDENT',
    },
    {
      id: 5,
      studentId: 5,
      studentRollNumber: 'HST-2026-105',
      studentName: 'Devansh Nair',
      roomNumber: 'C-301',
      transactionId: 'TXN-20261014-1055',
      receiptNumber: 'REC-2026-00115',
      amount: 18000,
      monthsExtended: 2,
      periodStartDate: addDays(today, -15),
      periodEndDate: addDays(today, 45),
      paymentDate: new Date(Date.now() - 15 * 86400000).toISOString(),
      paymentMethod: 'CARD',
      paymentStatus: 'SUCCESS',
      remarks: 'Extended stay for 2 months advance',
      recordedBy: 'WARDEN',
    },
  ];

  return { rooms, students, payments };
}

const STORAGE_KEY = 'hms_interactive_demo_store_v1';

export function getMockStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read mock store from localStorage', e);
  }
  const initial = getInitialDemoState();
  saveMockStore(initial);
  return initial;
}

export function saveMockStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn('Could not save mock store to localStorage', e);
  }
}

export function calculateStats(students, rooms, payments) {
  const totalStudents = students.filter(s => s.active).length;
  const totalRooms = rooms.length;
  const totalBeds = rooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
  const occupiedBeds = students.filter(s => s.active && s.roomNumber).length;
  const availableBeds = Math.max(0, totalBeds - occupiedBeds);

  const successPayments = payments.filter(p => p.paymentStatus === 'SUCCESS');
  const totalRevenueAllTime = successPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth();
  const totalRevenueThisMonth = successPayments
    .filter(p => {
      const d = new Date(p.paymentDate || p.createdAt || now);
      return d.getFullYear() === curYear && d.getMonth() === curMonth;
    })
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const paidCount = students.filter(s => s.active && s.paymentStatus === 'PAID').length;
  const expiringSoonCount = students.filter(s => s.active && s.paymentStatus === 'EXPIRING_SOON').length;
  const overdueCount = students.filter(s => s.active && s.paymentStatus === 'OVERDUE').length;
  const pendingApprovalCount = students.filter(s => s.active && s.paymentStatus === 'PENDING_APPROVAL').length;

  return {
    totalStudents,
    totalRooms,
    totalBeds,
    occupiedBeds,
    availableBeds,
    totalRevenueThisMonth,
    totalRevenueAllTime,
    paidCount,
    expiringSoonCount,
    overdueCount,
    pendingApprovalCount,
  };
}

// Compute days remaining and status
export function recalculateStudent(student) {
  if (!student.stayValidUntil) {
    student.daysRemaining = -999;
    student.paymentStatus = 'OVERDUE';
    return student;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const validUntil = new Date(student.stayValidUntil);
  validUntil.setHours(0, 0, 0, 0);

  const diffTime = validUntil.getTime() - today.getTime();
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));
  student.daysRemaining = days;

  if (student.paymentStatus !== 'PENDING_APPROVAL') {
    if (days < 0) {
      student.paymentStatus = 'OVERDUE';
    } else if (days <= 7) {
      student.paymentStatus = 'EXPIRING_SOON';
    } else {
      student.paymentStatus = 'PAID';
    }
  }
  return student;
}

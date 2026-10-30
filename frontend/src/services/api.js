import { 
  getMockStore, 
  saveMockStore, 
  calculateStats, 
  recalculateStudent 
} from './demoData';

// Automatically normalize API URL whether user includes /api or trailing slash
function resolveApiBase() {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
  if (!envUrl) return '/api';
  let cleaned = envUrl.replace(/\/+$/, '');
  if (!cleaned.endsWith('/api')) {
    cleaned += '/api';
  }
  return cleaned;
}

const API_BASE = resolveApiBase();

let _mockMode = false;

export const api = {
  isMockMode() {
    return _mockMode;
  },

  setMockMode(val) {
    _mockMode = val;
  },

  // Dashboard Stats
  async getDashboardStats() {
    if (_mockMode) {
      const store = getMockStore();
      return calculateStats(store.students, store.rooms, store.payments);
    }
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  // Students
  async getStudents(search = '') {
    if (_mockMode) {
      const store = getMockStore();
      let list = store.students.filter(s => s.active).map(recalculateStudent);
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(s => 
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.roomNumber.toLowerCase().includes(q)
        );
      }
      return list;
    }
    const url = search ? `${API_BASE}/students?search=${encodeURIComponent(search)}` : `${API_BASE}/students`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  async getStudentById(id) {
    if (_mockMode) {
      const store = getMockStore();
      const s = store.students.find(x => x.id === Number(id));
      if (!s) throw new Error('Student not found');
      return recalculateStudent(s);
    }
    const res = await fetch(`${API_BASE}/students/${id}`);
    if (!res.ok) throw new Error('Student not found');
    return res.json();
  },

  async getStudentByRoll(roll) {
    if (_mockMode) {
      const store = getMockStore();
      const s = store.students.find(x => x.rollNumber?.toLowerCase() === roll.toLowerCase());
      if (!s) throw new Error('Student not found with this roll number');
      return recalculateStudent(s);
    }
    const res = await fetch(`${API_BASE}/students/by-roll/${encodeURIComponent(roll)}`);
    if (!res.ok) throw new Error('Student not found with this roll number');
    return res.json();
  },

  async createStudent(studentData) {
    if (_mockMode) {
      const store = getMockStore();
      const id = Date.now();
      const newStudent = recalculateStudent({
        ...studentData,
        id,
        active: true,
        paymentStatus: 'PAID',
        admissionDate: studentData.admissionDate || new Date().toISOString().split('T')[0],
        stayValidUntil: studentData.stayValidUntil || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      });
      store.students.push(newStudent);

      // update room occupancy
      const room = store.rooms.find(r => r.roomNumber === newStudent.roomNumber);
      if (room) {
        room.occupiedBeds = (room.occupiedBeds || 0) + 1;
      }
      saveMockStore(store);
      return newStudent;
    }
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Failed to create student');
    }
    return res.json();
  },

  async updateStudent(id, studentData) {
    if (_mockMode) {
      const store = getMockStore();
      const idx = store.students.findIndex(s => s.id === Number(id));
      if (idx !== -1) {
        store.students[idx] = recalculateStudent({ ...store.students[idx], ...studentData });
        saveMockStore(store);
        return store.students[idx];
      }
      throw new Error('Student not found');
    }
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    if (!res.ok) throw new Error('Failed to update student');
    return res.json();
  },

  async vacateStudent(id) {
    if (_mockMode) {
      const store = getMockStore();
      const s = store.students.find(x => x.id === Number(id));
      if (s) {
        s.active = false;
        const room = store.rooms.find(r => r.roomNumber === s.roomNumber);
        if (room && room.occupiedBeds > 0) {
          room.occupiedBeds -= 1;
        }
        saveMockStore(store);
        return true;
      }
      throw new Error('Student not found');
    }
    const res = await fetch(`${API_BASE}/students/${id}/vacate`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to vacate student');
    return true;
  },

  async deleteStudent(id) {
    if (_mockMode) {
      const store = getMockStore();
      store.students = store.students.filter(x => x.id !== Number(id));
      saveMockStore(store);
      return true;
    }
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete student');
    return true;
  },

  // Rooms
  async getRooms() {
    if (_mockMode) {
      const store = getMockStore();
      return store.rooms;
    }
    const res = await fetch(`${API_BASE}/rooms`);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return res.json();
  },

  async createRoom(roomData) {
    if (_mockMode) {
      const store = getMockStore();
      const id = Date.now();
      const newRoom = { ...roomData, id, occupiedBeds: 0 };
      store.rooms.push(newRoom);
      saveMockStore(store);
      return newRoom;
    }
    const res = await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData),
    });
    if (!res.ok) throw new Error('Failed to create room');
    return res.json();
  },

  async updateRoom(id, roomData) {
    if (_mockMode) {
      const store = getMockStore();
      const idx = store.rooms.findIndex(r => r.id === Number(id));
      if (idx !== -1) {
        store.rooms[idx] = { ...store.rooms[idx], ...roomData };
        saveMockStore(store);
        return store.rooms[idx];
      }
      throw new Error('Room not found');
    }
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData),
    });
    if (!res.ok) throw new Error('Failed to update room');
    return res.json();
  },

  async deleteRoom(id) {
    if (_mockMode) {
      const store = getMockStore();
      store.rooms = store.rooms.filter(r => r.id !== Number(id));
      saveMockStore(store);
      return true;
    }
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete room');
    return true;
  },

  // Payments & Extensions
  async getAllPayments() {
    if (_mockMode) {
      const store = getMockStore();
      return [...store.payments].reverse();
    }
    const res = await fetch(`${API_BASE}/payments`);
    if (!res.ok) throw new Error('Failed to fetch payments');
    return res.json();
  },

  async getPaymentsByStudentId(studentId) {
    if (_mockMode) {
      const store = getMockStore();
      return store.payments.filter(p => p.studentId === Number(studentId)).reverse();
    }
    const res = await fetch(`${API_BASE}/payments/student/${studentId}`);
    if (!res.ok) throw new Error('Failed to fetch student payments');
    return res.json();
  },

  async getPaymentsByRoll(rollNumber) {
    if (_mockMode) {
      const store = getMockStore();
      return store.payments.filter(p => p.studentRollNumber?.toLowerCase() === rollNumber.toLowerCase()).reverse();
    }
    const res = await fetch(`${API_BASE}/payments/roll/${encodeURIComponent(rollNumber)}`);
    if (!res.ok) throw new Error('Failed to fetch student payments');
    return res.json();
  },

  async extendStayPayment(paymentData) {
    if (_mockMode) {
      const store = getMockStore();
      const student = store.students.find(s => s.id === Number(paymentData.studentId));
      if (!student) throw new Error('Student not found for extension');

      const months = Number(paymentData.monthsExtended) || 1;
      const today = new Date();
      
      let baseDate = new Date();
      if (paymentData.startDate) {
        baseDate = new Date(paymentData.startDate);
      } else if (student.stayValidUntil && new Date(student.stayValidUntil) > today) {
        baseDate = new Date(student.stayValidUntil);
      }

      const periodStartDate = baseDate.toISOString().split('T')[0];
      const endDate = new Date(baseDate);
      endDate.setMonth(endDate.getMonth() + months);
      const periodEndDate = endDate.toISOString().split('T')[0];

      student.stayValidUntil = periodEndDate;
      student.lastPaymentDate = new Date().toISOString().split('T')[0];
      recalculateStudent(student);

      const newPayment = {
        id: Date.now(),
        studentId: student.id,
        studentRollNumber: student.rollNumber,
        studentName: student.name,
        roomNumber: student.roomNumber,
        transactionId: paymentData.transactionId || `TXN-DEMO-${Date.now().toString().slice(-6)}`,
        receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        amount: Number(paymentData.amount) || student.monthlyFee || 6000,
        monthsExtended: months,
        periodStartDate,
        periodEndDate,
        paymentDate: new Date().toISOString(),
        paymentMethod: paymentData.paymentMethod || 'UPI',
        paymentStatus: 'SUCCESS',
        remarks: paymentData.remarks || `1 Month stay extension starting ${periodStartDate}`,
        recordedBy: 'WARDEN',
      };

      store.payments.push(newPayment);
      saveMockStore(store);
      return newPayment;
    }
    const res = await fetch(`${API_BASE}/payments/extend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error || 'Failed to process stay extension payment');
    }
    return res.json();
  },

  async verifyPayment(paymentId, approve = true) {
    if (_mockMode) {
      const store = getMockStore();
      const p = store.payments.find(x => x.id === Number(paymentId));
      if (!p) throw new Error('Payment not found');
      p.paymentStatus = approve ? 'SUCCESS' : 'FAILED';
      const student = store.students.find(s => s.id === p.studentId);
      if (student && approve) {
        student.stayValidUntil = p.periodEndDate;
        recalculateStudent(student);
      }
      saveMockStore(store);
      return p;
    }
    const res = await fetch(`${API_BASE}/payments/${paymentId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approve }),
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error || 'Failed to verify payment');
    }
    return res.json();
  },

  async revertPayment(paymentId, reason = 'Mistaken extension') {
    if (_mockMode) {
      const store = getMockStore();
      const p = store.payments.find(x => x.id === Number(paymentId));
      if (!p) throw new Error('Payment not found');
      if (p.paymentStatus !== 'SUCCESS') {
        throw new Error('Only successful payments can be marked as unpaid / reverted.');
      }
      p.paymentStatus = 'REVERTED';
      p.remarks = `${p.remarks || ''} | [REVERTED: ${reason}]`;
      const student = store.students.find(s => s.id === p.studentId);
      if (student) {
        student.stayValidUntil = p.periodStartDate;
        recalculateStudent(student);
      }
      saveMockStore(store);
      return p;
    }
    const res = await fetch(`${API_BASE}/payments/${paymentId}/revert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error || 'Failed to revert payment');
    }
    return res.json();
  },
};

const API_BASE = '/api';

export const api = {
  // Dashboard
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  // Students
  async getStudents(search = '') {
    const url = search ? `${API_BASE}/students?search=${encodeURIComponent(search)}` : `${API_BASE}/students`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  async getStudentById(id) {
    const res = await fetch(`${API_BASE}/students/${id}`);
    if (!res.ok) throw new Error('Student not found');
    return res.json();
  },

  async getStudentByRoll(roll) {
    const res = await fetch(`${API_BASE}/students/by-roll/${encodeURIComponent(roll)}`);
    if (!res.ok) throw new Error('Student not found with this roll number');
    return res.json();
  },

  async createStudent(studentData) {
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
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    if (!res.ok) throw new Error('Failed to update student');
    return res.json();
  },

  async vacateStudent(id) {
    const res = await fetch(`${API_BASE}/students/${id}/vacate`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to vacate student');
    return true;
  },

  async deleteStudent(id) {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete student');
    return true;
  },

  // Rooms
  async getRooms() {
    const res = await fetch(`${API_BASE}/rooms`);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return res.json();
  },

  async createRoom(roomData) {
    const res = await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData),
    });
    if (!res.ok) throw new Error('Failed to create room');
    return res.json();
  },

  async updateRoom(id, roomData) {
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData),
    });
    if (!res.ok) throw new Error('Failed to update room');
    return res.json();
  },

  async deleteRoom(id) {
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete room');
    return true;
  },

  // Payments & Extensions
  async getAllPayments() {
    const res = await fetch(`${API_BASE}/payments`);
    if (!res.ok) throw new Error('Failed to fetch payments');
    return res.json();
  },

  async getPaymentsByStudentId(studentId) {
    const res = await fetch(`${API_BASE}/payments/student/${studentId}`);
    if (!res.ok) throw new Error('Failed to fetch student payments');
    return res.json();
  },

  async getPaymentsByRoll(rollNumber) {
    const res = await fetch(`${API_BASE}/payments/roll/${encodeURIComponent(rollNumber)}`);
    if (!res.ok) throw new Error('Failed to fetch student payments');
    return res.json();
  },

  async extendStayPayment(paymentData) {
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

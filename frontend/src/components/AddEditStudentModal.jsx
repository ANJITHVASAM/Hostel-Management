import React, { useState } from 'react';
import { X, UserPlus, Save } from 'lucide-react';
import { api } from '../services/api';

export default function AddEditStudentModal({ student = null, rooms = [], onClose, onSuccess }) {
  const isEdit = !!(student && student.id);
  const initialRoom = rooms.find(r => r.roomNumber === (student?.roomNumber || rooms[0]?.roomNumber));

  const [formData, setFormData] = useState({
    name: student?.name || '',
    rollNumber: student?.rollNumber || `HST-2026-${Math.floor(100 + Math.random() * 900)}`,
    email: student?.email || '',
    phone: student?.phone || '',
    parentPhone: student?.parentPhone || '',
    address: student?.address || '',
    roomNumber: student?.roomNumber || (rooms[0]?.roomNumber || 'A-101'),
    bedNumber: student?.bedNumber || 'Bed-1',
    monthlyFee: student?.monthlyFee || (initialRoom?.totalMonthlyFee || 6000),
    stayValidUntil: student?.stayValidUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: student?.notes || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRoomChange = (e) => {
    const rNum = e.target.value;
    const selectedRoom = rooms.find(r => r.roomNumber === rNum);
    setFormData(prev => ({
      ...prev,
      roomNumber: rNum,
      monthlyFee: selectedRoom ? selectedRoom.totalMonthlyFee : prev.monthlyFee
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isEdit) {
        await api.updateStudent(student.id, formData);
      } else {
        await api.createStudent(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save student record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={20} color="#4f46e5" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              {isEdit ? 'Edit Student Details' : 'Register New Student in Hostel'}
            </h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Roll / Student ID *</label>
                <input
                  type="text"
                  required
                  disabled={isEdit}
                  className="form-input"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  placeholder="10-digit mobile"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Parent's Emergency Contact</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Parent mobile number"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="student@hostel.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Allocate Room *</label>
                <select
                  className="form-select"
                  value={formData.roomNumber}
                  onChange={handleRoomChange}
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.roomNumber}>
                      {r.roomNumber} ({r.roomType} - ₹{r.totalMonthlyFee}/mo, {r.capacity - r.occupiedBeds} beds free)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bed Assignment</label>
                <select
                  className="form-select"
                  value={formData.bedNumber}
                  onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                >
                  <option value="Bed-1">Bed 1 (Window side)</option>
                  <option value="Bed-2">Bed 2</option>
                  <option value="Bed-3">Bed 3</option>
                  <option value="Single">Single Room Occupant</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Monthly Fee (₹) *</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Stay Valid Until</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.stayValidUntil}
                  onChange={(e) => setFormData({ ...formData, stayValidUntil: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Permanent Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="City, State"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Warden Remarks / Medical Notes</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="Any dietary restrictions, medical history, or guardian notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Save size={16} />
              {isSubmitting ? 'Saving...' : (isEdit ? 'Update Student' : 'Register Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

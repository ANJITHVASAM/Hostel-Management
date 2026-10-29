import React, { useState } from 'react';
import { Bed, Plus, Edit2, Shield, Check, Info, X, Save } from 'lucide-react';
import { api } from '../services/api';

export default function RoomFeeStructure({ rooms = [], onRefresh }) {
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: 1,
    roomType: 'Double Sharing AC',
    capacity: 2,
    baseRent: 3500,
    messFee: 2000,
    maintenanceFee: 500,
    amenities: 'Attached Washroom, Air Conditioned, WiFi, Study Table'
  });

  const handleEditClick = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber || '',
      floor: room.floor ?? 1,
      roomType: room.roomType || '',
      capacity: room.capacity ?? 2,
      baseRent: room.baseRent ?? 0,
      messFee: room.messFee ?? 0,
      maintenanceFee: room.maintenanceFee ?? 0,
      amenities: room.amenities || ''
    });
    setShowAddRoom(true);
  };

  const handleReset = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      floor: 1,
      roomType: 'Double Sharing AC',
      capacity: 2,
      baseRent: 3500,
      messFee: 2000,
      maintenanceFee: 500,
      amenities: 'Attached Washroom, Air Conditioned, WiFi, Study Table'
    });
    setShowAddRoom(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        floor: Number(formData.floor) || 1,
        capacity: Number(formData.capacity) || 1,
        baseRent: Number(formData.baseRent) || 0,
        messFee: Number(formData.messFee) || 0,
        maintenanceFee: Number(formData.maintenanceFee) || 0
      };

      if (editingRoom) {
        await api.updateRoom(editingRoom.id, payload);
      } else {
        await api.createRoom(payload);
      }
      onRefresh();
      handleReset();
    } catch (err) {
      alert(err.message || 'Failed to save room structure');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatedTotal = (Number(formData.baseRent) || 0) + (Number(formData.messFee) || 0) + (Number(formData.maintenanceFee) || 0);

  return (
    <div>
      {/* Top Header Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Hostel Fee Structure & Room Inventory</div>
            <div className="card-subtitle">
              Configure transparent monthly fee breakdowns (Base Rent + Mess Charges + Amenities)
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              handleReset();
              setShowAddRoom(true);
            }}
          >
            <Plus size={16} />
            Add New Room
          </button>
        </div>

        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ background: '#eef2ff', padding: '8px', borderRadius: '8px', color: '#4f46e5' }}>
                <Bed size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>TOTAL CAPACITY</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  {rooms.reduce((acc, r) => acc + (r.capacity || 0), 0)} Beds in {rooms.length} Rooms
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ background: '#ecfdf5', padding: '8px', borderRadius: '8px', color: '#059669' }}>
                <Check size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>OCCUPANCY STATUS</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>
                  {rooms.reduce((acc, r) => acc + (r.occupiedBeds || 0), 0)} Occupied (
                  {Math.round((rooms.reduce((acc, r) => acc + (r.occupiedBeds || 0), 0) / (rooms.reduce((acc, r) => acc + (r.capacity || 0), 0) || 1)) * 100)}%)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '8px', color: '#d97706' }}>
                <Info size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>AVAILABLE BEDS</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#d97706' }}>
                  {rooms.reduce((acc, r) => acc + ((r.capacity || 0) - (r.occupiedBeds || 0)), 0)} Vacant Beds
                </div>
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {rooms.map((room) => {
              const capacity = room.capacity || 1;
              const occupied = room.occupiedBeds || 0;
              const isAvailable = occupied < capacity;
              const totalFee = (room.baseRent || 0) + (room.messFee || 0) + (room.maintenanceFee || 0);

              return (
                <div 
                  key={room.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Floor {room.floor}
                        </span>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                          Room {room.roomNumber}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                          {room.roomType}
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: isAvailable ? '#ecfdf5' : '#fef2f2',
                        color: isAvailable ? '#059669' : '#dc2626',
                        border: isAvailable ? '1px solid #a7f3d0' : '1px solid #fecaca'
                      }}>
                        {isAvailable ? `${capacity - occupied} Beds Free` : 'Fully Occupied'}
                      </span>
                    </div>

                    {/* Occupancy Progress Bar */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                        <span>Occupancy</span>
                        <span>{occupied} of {capacity} beds taken</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, (occupied / capacity) * 100)}%`,
                          height: '100%',
                          background: occupied >= capacity ? '#ef4444' : '#4f46e5',
                          borderRadius: '999px'
                        }}></div>
                      </div>
                    </div>

                    {/* Detailed Fee Structure Table */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', fontSize: '0.825rem' }}>
                      <div style={{ fontWeight: 700, color: '#334155', marginBottom: '6px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        Monthly Fee Breakdown
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', color: '#64748b' }}>
                        <span>Room Rent:</span>
                        <strong style={{ color: '#0f172a' }}>₹{(room.baseRent || 0).toLocaleString('en-IN')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', color: '#64748b' }}>
                        <span>Mess & Meal Plan:</span>
                        <strong style={{ color: '#0f172a' }}>₹{(room.messFee || 0).toLocaleString('en-IN')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', color: '#64748b' }}>
                        <span>Maintenance & WiFi:</span>
                        <strong style={{ color: '#0f172a' }}>₹{(room.maintenanceFee || 0).toLocaleString('en-IN')}</strong>
                      </div>
                      <div style={{ borderTop: '1px dashed #cbd5e1', marginTop: '6px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.95rem', color: '#4f46e5' }}>
                        <span>Total Monthly Fee:</span>
                        <span>₹{totalFee.toLocaleString('en-IN')}/mo</span>
                      </div>
                    </div>

                    {room.amenities && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                        <strong>Amenities:</strong> {room.amenities}
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEditClick(room)}
                    >
                      <Edit2 size={13} />
                      Edit Fee Structure
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add / Edit Room Modal */}
      {showAddRoom && (
        <div className="modal-overlay" onClick={handleReset}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {editingRoom ? `Edit Room ${editingRoom.roomNumber} Fee Structure` : 'Add New Hostel Room'}
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={handleReset}>
                <X size={16} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Room Number *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. C-302"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Floor</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value === '' ? '' : Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Room Type</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Single AC Deluxe"
                      value={formData.roomType}
                      onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Total Bed Capacity *</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      required
                      className="form-input"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value === '' ? '' : Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.85rem', margin: '0.5rem 0' }}>
                  Monthly Fee Structure Breakdown (₹)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Base Rent</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={formData.baseRent}
                      onChange={(e) => setFormData({ ...formData, baseRent: e.target.value === '' ? '' : Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mess Fee</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={formData.messFee}
                      onChange={(e) => setFormData({ ...formData, messFee: e.target.value === '' ? '' : Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Maintenance</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={formData.maintenanceFee}
                      onChange={(e) => setFormData({ ...formData, maintenanceFee: e.target.value === '' ? '' : Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div style={{ background: '#eef2ff', padding: '0.75rem 1rem', borderRadius: '8px', color: '#4338ca', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Calculated Monthly Total: ₹{calculatedTotal.toLocaleString('en-IN')}/month
                </div>

                <div className="form-group">
                  <label className="form-label">Amenities / Facilities</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Attached Bath, AC, Balcony, WiFi"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  <Save size={16} />
                  {isSubmitting ? 'Saving...' : 'Save Room Structure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

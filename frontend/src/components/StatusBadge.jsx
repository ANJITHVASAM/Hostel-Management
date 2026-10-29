import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status, daysRemaining }) {
  if (status === 'PAID') {
    return (
      <span className="badge badge-paid">
        <span className="dot dot-paid"></span>
        <CheckCircle2 size={13} />
        <span>Paid {daysRemaining !== undefined && daysRemaining > 0 ? `(${daysRemaining}d left)` : ''}</span>
      </span>
    );
  }

  if (status === 'EXPIRING_SOON') {
    return (
      <span className="badge badge-expiring">
        <span className="dot dot-expiring"></span>
        <Clock size={13} />
        <span>Expiring Soon {daysRemaining !== undefined ? `(${daysRemaining}d left)` : ''}</span>
      </span>
    );
  }

  if (status === 'OVERDUE' || status === 'DUE') {
    return (
      <span className="badge badge-overdue">
        <span className="dot dot-overdue"></span>
        <AlertTriangle size={13} />
        <span>Overdue {daysRemaining !== undefined && daysRemaining < 0 ? `(${Math.abs(daysRemaining)}d)` : ''}</span>
      </span>
    );
  }

  if (status === 'PENDING_APPROVAL') {
    return (
      <span className="badge badge-pending">
        <span className="dot dot-pending"></span>
        <AlertCircle size={13} />
        <span>Pending Review</span>
      </span>
    );
  }

  return (
    <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
      {status || 'Unknown'}
    </span>
  );
}

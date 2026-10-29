package com.hostel.model;

public enum PaymentStatus {
    PAID,            // Stay valid and active (> 7 days remaining)
    DUE,             // Payment due
    EXPIRING_SOON,   // Stay expires in <= 7 days
    OVERDUE,         // Stay already expired, payment not received
    PENDING_APPROVAL // Student submitted payment proof, awaiting warden approval
}

package com.hostel.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String rollNumber;

    @Column(nullable = false)
    private String name;

    private String email;

    private String phone;

    private String parentPhone;

    private String address;

    private String roomNumber;

    private String bedNumber;

    private Double monthlyFee;

    private LocalDate admissionDate;

    private LocalDate stayValidUntil;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.DUE;

    private boolean active = true;

    private LocalDate lastPaymentDate;

    private String notes;

    public Student() {
    }

    public Student(String rollNumber, String name, String email, String phone, String parentPhone,
                   String address, String roomNumber, String bedNumber, Double monthlyFee,
                   LocalDate admissionDate, LocalDate stayValidUntil) {
        this.rollNumber = rollNumber;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.parentPhone = parentPhone;
        this.address = address;
        this.roomNumber = roomNumber;
        this.bedNumber = bedNumber;
        this.monthlyFee = monthlyFee;
        this.admissionDate = admissionDate;
        this.stayValidUntil = stayValidUntil;
        this.active = true;
        recalculatePaymentStatus();
    }

    /**
     * Recalculates payment status dynamically based on current date vs stayValidUntil
     */
    public void recalculatePaymentStatus() {
        if (!active) {
            return;
        }
        if (this.paymentStatus == PaymentStatus.PENDING_APPROVAL) {
            // Keep pending until warden verifies
            return;
        }
        if (stayValidUntil == null) {
            this.paymentStatus = PaymentStatus.OVERDUE;
            return;
        }

        LocalDate today = LocalDate.now();
        long daysDiff = ChronoUnit.DAYS.between(today, stayValidUntil);

        if (daysDiff < 0) {
            this.paymentStatus = PaymentStatus.OVERDUE;
        } else if (daysDiff <= 7) {
            this.paymentStatus = PaymentStatus.EXPIRING_SOON;
        } else {
            this.paymentStatus = PaymentStatus.PAID;
        }
    }

    @Transient
    public long getDaysRemaining() {
        if (stayValidUntil == null) return 0;
        return ChronoUnit.DAYS.between(LocalDate.now(), stayValidUntil);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getParentPhone() {
        return parentPhone;
    }

    public void setParentPhone(String parentPhone) {
        this.parentPhone = parentPhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getBedNumber() {
        return bedNumber;
    }

    public void setBedNumber(String bedNumber) {
        this.bedNumber = bedNumber;
    }

    public Double getMonthlyFee() {
        return monthlyFee;
    }

    public void setMonthlyFee(Double monthlyFee) {
        this.monthlyFee = monthlyFee;
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    public LocalDate getStayValidUntil() {
        return stayValidUntil;
    }

    public void setStayValidUntil(LocalDate stayValidUntil) {
        this.stayValidUntil = stayValidUntil;
        recalculatePaymentStatus();
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDate getLastPaymentDate() {
        return lastPaymentDate;
    }

    public void setLastPaymentDate(LocalDate lastPaymentDate) {
        this.lastPaymentDate = lastPaymentDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

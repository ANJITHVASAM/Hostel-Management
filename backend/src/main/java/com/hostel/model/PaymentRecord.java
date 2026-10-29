package com.hostel.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_records")
public class PaymentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long studentId;

    private String studentRollNumber;

    private String studentName;

    private String roomNumber;

    @Column(nullable = false, unique = true)
    private String transactionId;

    private String receiptNumber;

    private Double amount;

    private Integer monthsExtended; // e.g. 1 month

    private LocalDate periodStartDate;

    private LocalDate periodEndDate;

    private LocalDateTime paymentDate;

    private String paymentMethod; // "UPI", "CASH", "CARD", "NET_BANKING"

    private String paymentStatus; // "SUCCESS", "PENDING_VERIFICATION", "REJECTED"

    private String remarks;

    private String recordedBy; // "WARDEN" or "STUDENT"

    public PaymentRecord() {
    }

    public PaymentRecord(Long studentId, String studentRollNumber, String studentName, 
                         String roomNumber, String transactionId, String receiptNumber,
                         Double amount, Integer monthsExtended, LocalDate periodStartDate, 
                         LocalDate periodEndDate, LocalDateTime paymentDate, 
                         String paymentMethod, String paymentStatus, String remarks, 
                         String recordedBy) {
        this.studentId = studentId;
        this.studentRollNumber = studentRollNumber;
        this.studentName = studentName;
        this.roomNumber = roomNumber;
        this.transactionId = transactionId;
        this.receiptNumber = receiptNumber;
        this.amount = amount;
        this.monthsExtended = monthsExtended;
        this.periodStartDate = periodStartDate;
        this.periodEndDate = periodEndDate;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.remarks = remarks;
        this.recordedBy = recordedBy;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentRollNumber() {
        return studentRollNumber;
    }

    public void setStudentRollNumber(String studentRollNumber) {
        this.studentRollNumber = studentRollNumber;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Integer getMonthsExtended() {
        return monthsExtended;
    }

    public void setMonthsExtended(Integer monthsExtended) {
        this.monthsExtended = monthsExtended;
    }

    public LocalDate getPeriodStartDate() {
        return periodStartDate;
    }

    public void setPeriodStartDate(LocalDate periodStartDate) {
        this.periodStartDate = periodStartDate;
    }

    public LocalDate getPeriodEndDate() {
        return periodEndDate;
    }

    public void setPeriodEndDate(LocalDate periodEndDate) {
        this.periodEndDate = periodEndDate;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getRecordedBy() {
        return recordedBy;
    }

    public void setRecordedBy(String recordedBy) {
        this.recordedBy = recordedBy;
    }
}

package com.hostel.dto;

import java.time.LocalDate;

public class PaymentRequestDTO {
    private Long studentId;
    private Integer months = 1;
    private Double amount;
    private String paymentMethod = "UPI";
    private String remarks;
    private String transactionId;
    private String recordedBy = "WARDEN"; // "WARDEN" or "STUDENT"
    private boolean autoApprove = true;
    private LocalDate startDate;

    public PaymentRequestDTO() {
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Integer getMonths() {
        return months != null && months > 0 ? months : 1;
    }

    public void setMonths(Integer months) {
        this.months = months;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod != null ? paymentMethod : "UPI";
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getRecordedBy() {
        return recordedBy != null ? recordedBy : "WARDEN";
    }

    public void setRecordedBy(String recordedBy) {
        this.recordedBy = recordedBy;
    }

    public boolean isAutoApprove() {
        return autoApprove;
    }

    public void setAutoApprove(boolean autoApprove) {
        this.autoApprove = autoApprove;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
}

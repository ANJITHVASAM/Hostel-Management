package com.hostel.service;

import com.hostel.dto.PaymentRequestDTO;
import com.hostel.model.PaymentRecord;
import com.hostel.model.PaymentStatus;
import com.hostel.model.Student;
import com.hostel.repository.PaymentRecordRepository;
import com.hostel.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {

    private final PaymentRecordRepository paymentRecordRepository;
    private final StudentRepository studentRepository;

    public PaymentService(PaymentRecordRepository paymentRecordRepository, StudentRepository studentRepository) {
        this.paymentRecordRepository = paymentRecordRepository;
        this.studentRepository = studentRepository;
    }

    public List<PaymentRecord> getAllPayments() {
        return paymentRecordRepository.findAllByOrderByPaymentDateDesc();
    }

    public List<PaymentRecord> getPaymentsByStudentId(Long studentId) {
        return paymentRecordRepository.findByStudentIdOrderByPaymentDateDesc(studentId);
    }

    public List<PaymentRecord> getPaymentsByRollNumber(String rollNumber) {
        return paymentRecordRepository.findByStudentRollNumberIgnoreCaseOrderByPaymentDateDesc(rollNumber);
    }

    public PaymentRecord processStayExtension(PaymentRequestDTO request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + request.getStudentId()));

        int months = request.getMonths();
        LocalDate today = LocalDate.now();

        LocalDate currentValidUntil = student.getStayValidUntil();
        LocalDate startDate;

        if (request.getStartDate() != null) {
            // Explicitly chosen by Warden: Present date (Today) OR Continue from past month date
            startDate = request.getStartDate();
        } else if (currentValidUntil != null) {
            // Continue from student's existing validity date (past month or future)
            startDate = currentValidUntil;
        } else {
            startDate = today;
        }

        LocalDate endDate = startDate.plusMonths(months);

        double totalAmount = request.getAmount() != null && request.getAmount() > 0
                ? request.getAmount()
                : (student.getMonthlyFee() != null ? student.getMonthlyFee() * months : 6000.0 * months);

        String txnId = request.getTransactionId() != null && !request.getTransactionId().trim().isEmpty()
                ? request.getTransactionId().trim()
                : "TXN-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 900 + 100);

        String receiptNo = "REC-" + LocalDate.now().getYear() + "-" + String.format("%05d", (int)(Math.random() * 90000 + 10000));

        PaymentRecord record = new PaymentRecord();
        record.setStudentId(student.getId());
        record.setStudentRollNumber(student.getRollNumber());
        record.setStudentName(student.getName());
        record.setRoomNumber(student.getRoomNumber());
        record.setTransactionId(txnId);
        record.setReceiptNumber(receiptNo);
        record.setAmount(totalAmount);
        record.setMonthsExtended(months);
        record.setPeriodStartDate(startDate);
        record.setPeriodEndDate(endDate);
        record.setPaymentDate(LocalDateTime.now());
        record.setPaymentMethod(request.getPaymentMethod());
        record.setRemarks(request.getRemarks() != null ? request.getRemarks() : "Monthly Hostel Fee Payment for " + months + " month(s)");
        record.setRecordedBy(request.getRecordedBy());

        if (request.isAutoApprove()) {
            record.setPaymentStatus("SUCCESS");
            student.setStayValidUntil(endDate);
            student.setLastPaymentDate(today);
            student.setPaymentStatus(PaymentStatus.PAID);
            studentRepository.save(student);
        } else {
            record.setPaymentStatus("PENDING_VERIFICATION");
            student.setPaymentStatus(PaymentStatus.PENDING_APPROVAL);
            studentRepository.save(student);
        }

        return paymentRecordRepository.save(record);
    }

    public PaymentRecord verifyPayment(Long paymentId, boolean approve) {
        PaymentRecord record = paymentRecordRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment record not found with ID: " + paymentId));

        if (!"PENDING_VERIFICATION".equalsIgnoreCase(record.getPaymentStatus())) {
            throw new IllegalStateException("Payment is already processed with status: " + record.getPaymentStatus());
        }

        Student student = studentRepository.findById(record.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + record.getStudentId()));

        if (approve) {
            record.setPaymentStatus("SUCCESS");
            student.setStayValidUntil(record.getPeriodEndDate());
            student.setLastPaymentDate(LocalDate.now());
            student.recalculatePaymentStatus();
        } else {
            record.setPaymentStatus("REJECTED");
            student.recalculatePaymentStatus();
        }

        studentRepository.save(student);
        return paymentRecordRepository.save(record);
    }

    public PaymentRecord revertPayment(Long paymentId, String reason) {
        PaymentRecord record = paymentRecordRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment record not found with ID: " + paymentId));

        if (!"SUCCESS".equalsIgnoreCase(record.getPaymentStatus())) {
            throw new IllegalStateException("Only successful payments can be marked as unpaid / reverted.");
        }

        Student student = studentRepository.findById(record.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + record.getStudentId()));

        // Roll back student stay validity date to before this payment
        if (record.getPeriodStartDate() != null) {
            student.setStayValidUntil(record.getPeriodStartDate());
        } else if (record.getMonthsExtended() != null && student.getStayValidUntil() != null) {
            student.setStayValidUntil(student.getStayValidUntil().minusMonths(record.getMonthsExtended()));
        }

        // Recalculate student payment status (e.g. back to OVERDUE or EXPIRING_SOON)
        student.recalculatePaymentStatus();
        studentRepository.save(student);

        // Mark payment record as REVERTED
        record.setPaymentStatus("REVERTED");
        String note = (reason != null && !reason.trim().isEmpty()) ? reason.trim() : "Marked unpaid by warden (mistaken extension)";
        record.setRemarks((record.getRemarks() != null ? record.getRemarks() + " | " : "") + "[REVERTED: " + note + "]");

        return paymentRecordRepository.save(record);
    }
}

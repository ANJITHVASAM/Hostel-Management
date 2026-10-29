package com.hostel.repository;

import com.hostel.model.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, Long> {
    List<PaymentRecord> findByStudentIdOrderByPaymentDateDesc(Long studentId);
    List<PaymentRecord> findByStudentRollNumberIgnoreCaseOrderByPaymentDateDesc(String rollNumber);
    List<PaymentRecord> findAllByOrderByPaymentDateDesc();
    Optional<PaymentRecord> findByTransactionId(String transactionId);

    @Query("SELECT SUM(p.amount) FROM PaymentRecord p WHERE p.paymentStatus = 'SUCCESS' AND p.paymentDate >= :since")
    Double calculateTotalRevenueSince(LocalDateTime since);

    @Query("SELECT SUM(p.amount) FROM PaymentRecord p WHERE p.paymentStatus = 'SUCCESS'")
    Double calculateTotalRevenueAllTime();
}

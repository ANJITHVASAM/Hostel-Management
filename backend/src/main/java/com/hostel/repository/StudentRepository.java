package com.hostel.repository;

import com.hostel.model.PaymentStatus;
import com.hostel.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumberIgnoreCase(String rollNumber);
    Optional<Student> findByEmailIgnoreCase(String email);
    List<Student> findByActive(boolean active);
    List<Student> findByActiveTrueAndPaymentStatus(PaymentStatus paymentStatus);
    List<Student> findByRoomNumber(String roomNumber);

    long countByActiveTrue();
    long countByActiveTrueAndPaymentStatus(PaymentStatus paymentStatus);

    @Query("SELECT s FROM Student s WHERE s.active = true AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.roomNumber) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Student> searchStudents(String query);
}

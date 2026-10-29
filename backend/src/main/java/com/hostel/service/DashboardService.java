package com.hostel.service;

import com.hostel.dto.DashboardStatsDTO;
import com.hostel.model.PaymentStatus;
import com.hostel.model.Room;
import com.hostel.model.Student;
import com.hostel.repository.PaymentRecordRepository;
import com.hostel.repository.RoomRepository;
import com.hostel.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;
    private final PaymentRecordRepository paymentRecordRepository;

    public DashboardService(StudentRepository studentRepository, 
                            RoomRepository roomRepository, 
                            PaymentRecordRepository paymentRecordRepository) {
        this.studentRepository = studentRepository;
        this.roomRepository = roomRepository;
        this.paymentRecordRepository = paymentRecordRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        List<Student> students = studentRepository.findByActive(true);
        for (Student s : students) {
            s.recalculatePaymentStatus();
        }

        stats.setTotalStudents(students.size());

        List<Room> rooms = roomRepository.findAll();
        stats.setTotalRooms(rooms.size());

        int totalBeds = 0;
        int occupiedBeds = 0;
        for (Room r : rooms) {
            totalBeds += r.getCapacity();
            occupiedBeds += r.getOccupiedBeds();
        }
        stats.setTotalBeds(totalBeds);
        stats.setOccupiedBeds(occupiedBeds);
        stats.setAvailableBeds(Math.max(0, totalBeds - occupiedBeds));

        long paid = 0;
        long expiring = 0;
        long overdue = 0;
        long pending = 0;

        for (Student s : students) {
            PaymentStatus ps = s.getPaymentStatus();
            if (ps == PaymentStatus.PAID) paid++;
            else if (ps == PaymentStatus.EXPIRING_SOON) expiring++;
            else if (ps == PaymentStatus.OVERDUE || ps == PaymentStatus.DUE) overdue++;
            else if (ps == PaymentStatus.PENDING_APPROVAL) pending++;
        }

        stats.setPaidCount(paid);
        stats.setExpiringSoonCount(expiring);
        stats.setOverdueCount(overdue);
        stats.setPendingApprovalCount(pending);

        // Revenue calculations
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        Double monthRev = paymentRecordRepository.calculateTotalRevenueSince(startOfMonth);
        stats.setTotalRevenueThisMonth(monthRev != null ? monthRev : 0.0);

        Double allTimeRev = paymentRecordRepository.calculateTotalRevenueAllTime();
        stats.setTotalRevenueAllTime(allTimeRev != null ? allTimeRev : 0.0);

        return stats;
    }
}

package com.hostel.config;

import com.hostel.model.PaymentRecord;
import com.hostel.model.PaymentStatus;
import com.hostel.model.Room;
import com.hostel.model.Student;
import com.hostel.repository.PaymentRecordRepository;
import com.hostel.repository.RoomRepository;
import com.hostel.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoomRepository roomRepository;
    private final StudentRepository studentRepository;
    private final PaymentRecordRepository paymentRecordRepository;

    public DataInitializer(RoomRepository roomRepository, 
                           StudentRepository studentRepository, 
                           PaymentRecordRepository paymentRecordRepository) {
        this.roomRepository = roomRepository;
        this.studentRepository = studentRepository;
        this.paymentRecordRepository = paymentRecordRepository;
    }

    @Override
    public void run(String... args) {
        if (roomRepository.count() > 0) {
            return; // Already initialized
        }

        // 1. Seed Rooms with realistic Fee Structures (Base Rent + Mess + Maintenance)
        Room r101 = new Room("A-101", 1, "Single AC Deluxe", 1, 5500.0, 2500.0, 500.0, "Private Attached Bath, Air Conditioned, Study Desk, High-Speed WiFi");
        Room r102 = new Room("A-102", 1, "Double Sharing AC", 2, 3500.0, 2000.0, 500.0, "Attached Washroom, Air Conditioned, 2 Lockers, Study Tables");
        Room r201 = new Room("B-201", 2, "Double Sharing Non-AC", 2, 3000.0, 2000.0, 500.0, "Attached Washroom, Ceiling Fan, Balcony, 2 Closets");
        Room r202 = new Room("B-202", 2, "Triple Sharing Budget", 3, 2200.0, 1800.0, 500.0, "Common Bath, Spacious Wardrobes, Study Zone, WiFi");
        Room r301 = new Room("C-301", 3, "Single Premium Suite", 1, 6000.0, 2500.0, 500.0, "Private Balcony, AC, Mini Refrigerator, Study Station");

        roomRepository.save(r101);
        roomRepository.save(r102);
        roomRepository.save(r201);
        roomRepository.save(r202);
        roomRepository.save(r301);

        LocalDate today = LocalDate.now();

        // 2. Seed Students across different stay statuses
        // Student 1: Aarav Sharma - Paid, stay valid for 30 more days
        Student s1 = new Student("HST-2026-101", "Aarav Sharma", "aarav.sharma@hostel.edu", "9876543210", 
                "9876500001", "124 Civil Lines, Jaipur", "A-101", "Bed-1", 8500.0, 
                today.minusMonths(2), today.plusDays(30));
        s1.setLastPaymentDate(today.minusDays(2));
        s1.setNotes("First floor premium single room. Prefers vegetarian food.");
        s1.setPaymentStatus(PaymentStatus.PAID);
        s1 = studentRepository.save(s1);

        // Student 2: Rohan Verma - Expiring soon (in 4 days)
        Student s2 = new Student("HST-2026-102", "Rohan Verma", "rohan.verma@hostel.edu", "9876543211", 
                "9876500002", "45 Mall Road, Chandigarh", "A-102", "Bed-1", 6000.0, 
                today.minusMonths(3), today.plusDays(4));
        s2.setLastPaymentDate(today.minusDays(26));
        s2.setNotes("Reminder sent via SMS for renewal.");
        s2.setPaymentStatus(PaymentStatus.EXPIRING_SOON);
        s2 = studentRepository.save(s2);

        // Student 3: Priya Patel - Overdue by 9 days
        Student s3 = new Student("HST-2026-103", "Priya Patel", "priya.patel@hostel.edu", "9876543212", 
                "9876500003", "88 MG Road, Ahmedabad", "B-201", "Bed-1", 5500.0, 
                today.minusMonths(4), today.minusDays(9));
        s3.setLastPaymentDate(today.minusDays(39));
        s3.setNotes("Extension payment delayed due to semester exams.");
        s3.setPaymentStatus(PaymentStatus.OVERDUE);
        s3 = studentRepository.save(s3);

        // Student 4: Sneha Kulkarni - Pending verification (submitted payment online)
        Student s4 = new Student("HST-2026-104", "Sneha Kulkarni", "sneha.k@hostel.edu", "9876543213", 
                "9876500004", "12 FC Road, Pune", "B-202", "Bed-1", 4500.0, 
                today.minusMonths(1), today.minusDays(1));
        s4.setNotes("Transferred ₹4,500 via UPI. Needs warden confirmation.");
        s4.setPaymentStatus(PaymentStatus.PENDING_APPROVAL);
        s4 = studentRepository.save(s4);

        // Student 5: Devansh Nair - Paid till mid December
        Student s5 = new Student("HST-2026-105", "Devansh Nair", "devansh.nair@hostel.edu", "9876543214", 
                "9876500005", "77 Marine Drive, Kochi", "C-301", "Bed-1", 9000.0, 
                today.minusMonths(1), today.plusDays(45));
        s5.setLastPaymentDate(today.minusDays(15));
        s5.setNotes("Paid 2 months in advance.");
        s5.setPaymentStatus(PaymentStatus.PAID);
        s5 = studentRepository.save(s5);

        // Update occupancy counts
        r101.setOccupiedBeds(1);
        r102.setOccupiedBeds(1);
        r201.setOccupiedBeds(1);
        r202.setOccupiedBeds(1);
        r301.setOccupiedBeds(1);
        roomRepository.save(r101);
        roomRepository.save(r102);
        roomRepository.save(r201);
        roomRepository.save(r202);
        roomRepository.save(r301);

        // 3. Seed Payment Records
        PaymentRecord p1 = new PaymentRecord(s1.getId(), s1.getRollNumber(), s1.getName(), s1.getRoomNumber(),
                "TXN-20261027-1011", "REC-2026-00101", 8500.0, 1, today.minusDays(2), today.plusDays(30),
                LocalDateTime.now().minusDays(2), "UPI", "SUCCESS", "Monthly fee extension for 1 month", "WARDEN");

        PaymentRecord p2 = new PaymentRecord(s2.getId(), s2.getRollNumber(), s2.getName(), s2.getRoomNumber(),
                "TXN-20261003-1022", "REC-2026-00089", 6000.0, 1, today.minusDays(26), today.plusDays(4),
                LocalDateTime.now().minusDays(26), "NET_BANKING", "SUCCESS", "October month stay fee", "WARDEN");

        PaymentRecord p3 = new PaymentRecord(s3.getId(), s3.getRollNumber(), s3.getName(), s3.getRoomNumber(),
                "TXN-20260920-1033", "REC-2026-00054", 5500.0, 1, today.minusDays(69), today.minusDays(9),
                LocalDateTime.now().minusDays(69), "CASH", "SUCCESS", "Previous month fee paid in cash", "WARDEN");

        PaymentRecord p4 = new PaymentRecord(s4.getId(), s4.getRollNumber(), s4.getName(), s4.getRoomNumber(),
                "TXN-UPI-983274921", "REC-2026-00142", 4500.0, 1, today, today.plusMonths(1),
                LocalDateTime.now().minusHours(3), "UPI", "PENDING_VERIFICATION", "Payment submitted via student portal with UPI UTR: 42918839210", "STUDENT");

        PaymentRecord p5 = new PaymentRecord(s5.getId(), s5.getRollNumber(), s5.getName(), s5.getRoomNumber(),
                "TXN-20261014-1055", "REC-2026-00115", 18000.0, 2, today.minusDays(15), today.plusDays(45),
                LocalDateTime.now().minusDays(15), "CARD", "SUCCESS", "Extended stay for 2 months advance", "WARDEN");

        paymentRecordRepository.save(p1);
        paymentRecordRepository.save(p2);
        paymentRecordRepository.save(p3);
        paymentRecordRepository.save(p4);
        paymentRecordRepository.save(p5);
    }
}

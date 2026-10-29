package com.hostel.service;

import com.hostel.model.PaymentStatus;
import com.hostel.model.Student;
import com.hostel.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final RoomService roomService;

    public StudentService(StudentRepository studentRepository, RoomService roomService) {
        this.studentRepository = studentRepository;
        this.roomService = roomService;
    }

    public List<Student> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        for (Student s : students) {
            s.recalculatePaymentStatus();
        }
        return students;
    }

    public List<Student> getActiveStudents() {
        List<Student> students = studentRepository.findByActive(true);
        for (Student s : students) {
            s.recalculatePaymentStatus();
        }
        return students;
    }

    public Optional<Student> getStudentById(Long id) {
        Optional<Student> studentOpt = studentRepository.findById(id);
        studentOpt.ifPresent(Student::recalculatePaymentStatus);
        return studentOpt;
    }

    public Optional<Student> getStudentByRollNumber(String rollNumber) {
        Optional<Student> studentOpt = studentRepository.findByRollNumberIgnoreCase(rollNumber);
        studentOpt.ifPresent(Student::recalculatePaymentStatus);
        return studentOpt;
    }

    public List<Student> searchStudents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getActiveStudents();
        }
        List<Student> students = studentRepository.searchStudents(query.trim());
        for (Student s : students) {
            s.recalculatePaymentStatus();
        }
        return students;
    }

    public Student createStudent(Student student) {
        if (studentRepository.findByRollNumberIgnoreCase(student.getRollNumber()).isPresent()) {
            throw new IllegalArgumentException("Student with Roll Number " + student.getRollNumber() + " already exists.");
        }

        if (student.getAdmissionDate() == null) {
            student.setAdmissionDate(LocalDate.now());
        }

        if (student.getStayValidUntil() == null) {
            student.setStayValidUntil(student.getAdmissionDate().plusMonths(1));
        }

        student.recalculatePaymentStatus();
        Student saved = studentRepository.save(student);

        if (saved.getRoomNumber() != null) {
            roomService.recalculateOccupancy(saved.getRoomNumber());
        }

        return saved;
    }

    public Student updateStudent(Long id, Student updated) {
        return studentRepository.findById(id).map(student -> {
            String oldRoom = student.getRoomNumber();
            student.setName(updated.getName());
            student.setEmail(updated.getEmail());
            student.setPhone(updated.getPhone());
            student.setParentPhone(updated.getParentPhone());
            student.setAddress(updated.getAddress());
            student.setRoomNumber(updated.getRoomNumber());
            student.setBedNumber(updated.getBedNumber());
            student.setMonthlyFee(updated.getMonthlyFee());
            student.setStayValidUntil(updated.getStayValidUntil());
            student.setNotes(updated.getNotes());
            if (updated.getPaymentStatus() != null) {
                student.setPaymentStatus(updated.getPaymentStatus());
            } else {
                student.recalculatePaymentStatus();
            }

            Student saved = studentRepository.save(student);

            if (oldRoom != null && !oldRoom.equals(saved.getRoomNumber())) {
                roomService.recalculateOccupancy(oldRoom);
            }
            if (saved.getRoomNumber() != null) {
                roomService.recalculateOccupancy(saved.getRoomNumber());
            }

            return saved;
        }).orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public void vacateStudent(Long id) {
        studentRepository.findById(id).ifPresent(student -> {
            student.setActive(false);
            studentRepository.save(student);
            if (student.getRoomNumber() != null) {
                roomService.recalculateOccupancy(student.getRoomNumber());
            }
        });
    }

    public void deleteStudent(Long id) {
        studentRepository.findById(id).ifPresent(student -> {
            String roomNumber = student.getRoomNumber();
            studentRepository.delete(student);
            if (roomNumber != null) {
                roomService.recalculateOccupancy(roomNumber);
            }
        });
    }
}

package com.hostel.service;

import com.hostel.model.Room;
import com.hostel.repository.RoomRepository;
import com.hostel.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RoomService {

    private final RoomRepository roomRepository;
    private final StudentRepository studentRepository;

    public RoomService(RoomRepository roomRepository, StudentRepository studentRepository) {
        this.roomRepository = roomRepository;
        this.studentRepository = studentRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public Optional<Room> getRoomByNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber);
    }

    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room updatedRoom) {
        return roomRepository.findById(id).map(room -> {
            room.setRoomNumber(updatedRoom.getRoomNumber());
            room.setFloor(updatedRoom.getFloor());
            room.setRoomType(updatedRoom.getRoomType());
            room.setCapacity(updatedRoom.getCapacity());
            room.setBaseRent(updatedRoom.getBaseRent());
            room.setMessFee(updatedRoom.getMessFee());
            room.setMaintenanceFee(updatedRoom.getMaintenanceFee());
            room.setAmenities(updatedRoom.getAmenities());
            Room saved = roomRepository.save(room);

            // Sync monthly fee with active students in this room
            Double newTotalFee = saved.getTotalMonthlyFee();
            studentRepository.findByRoomNumber(saved.getRoomNumber()).forEach(student -> {
                if (student.isActive()) {
                    student.setMonthlyFee(newTotalFee);
                    studentRepository.save(student);
                }
            });

            return saved;
        }).orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    public void recalculateOccupancy(String roomNumber) {
        if (roomNumber == null || roomNumber.trim().isEmpty()) return;
        roomRepository.findByRoomNumber(roomNumber).ifPresent(room -> {
            long count = studentRepository.findByRoomNumber(roomNumber).stream()
                    .filter(s -> s.isActive())
                    .count();
            room.setOccupiedBeds((int) count);
            roomRepository.save(room);
        });
    }
}

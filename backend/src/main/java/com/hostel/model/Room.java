package com.hostel.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roomNumber;

    private int floor;

    private String roomType; // e.g., "Single AC", "Double Sharing", "Triple Sharing"

    private int capacity;

    private int occupiedBeds = 0;

    private Double baseRent; // Base room rent per month

    private Double messFee; // Mess / food fee per month

    private Double maintenanceFee; // Maintenance and utilities fee

    private String amenities; // e.g. "Attached Bath, AC, High-Speed WiFi, Balcony"

    public Room() {
    }

    public Room(String roomNumber, int floor, String roomType, int capacity, 
                Double baseRent, Double messFee, Double maintenanceFee, String amenities) {
        this.roomNumber = roomNumber;
        this.floor = floor;
        this.roomType = roomType;
        this.capacity = capacity;
        this.baseRent = baseRent;
        this.messFee = messFee;
        this.maintenanceFee = maintenanceFee;
        this.amenities = amenities;
        this.occupiedBeds = 0;
    }

    public Double getTotalMonthlyFee() {
        double total = 0.0;
        if (baseRent != null) total += baseRent;
        if (messFee != null) total += messFee;
        if (maintenanceFee != null) total += maintenanceFee;
        return total;
    }

    public boolean isAvailable() {
        return occupiedBeds < capacity;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
        this.floor = floor;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getOccupiedBeds() {
        return occupiedBeds;
    }

    public void setOccupiedBeds(int occupiedBeds) {
        this.occupiedBeds = occupiedBeds;
    }

    public Double getBaseRent() {
        return baseRent;
    }

    public void setBaseRent(Double baseRent) {
        this.baseRent = baseRent;
    }

    public Double getMessFee() {
        return messFee;
    }

    public void setMessFee(Double messFee) {
        this.messFee = messFee;
    }

    public Double getMaintenanceFee() {
        return maintenanceFee;
    }

    public void setMaintenanceFee(Double maintenanceFee) {
        this.maintenanceFee = maintenanceFee;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }
}

package com.hostel.dto;

public class DashboardStatsDTO {
    private long totalStudents;
    private long totalRooms;
    private int totalBeds;
    private int occupiedBeds;
    private int availableBeds;
    private double totalRevenueThisMonth;
    private double totalRevenueAllTime;
    private long paidCount;
    private long expiringSoonCount;
    private long overdueCount;
    private long pendingApprovalCount;

    public DashboardStatsDTO() {
    }

    // Getters and Setters
    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public int getTotalBeds() {
        return totalBeds;
    }

    public void setTotalBeds(int totalBeds) {
        this.totalBeds = totalBeds;
    }

    public int getOccupiedBeds() {
        return occupiedBeds;
    }

    public void setOccupiedBeds(int occupiedBeds) {
        this.occupiedBeds = occupiedBeds;
    }

    public int getAvailableBeds() {
        return availableBeds;
    }

    public void setAvailableBeds(int availableBeds) {
        this.availableBeds = availableBeds;
    }

    public double getTotalRevenueThisMonth() {
        return totalRevenueThisMonth;
    }

    public void setTotalRevenueThisMonth(double totalRevenueThisMonth) {
        this.totalRevenueThisMonth = totalRevenueThisMonth;
    }

    public double getTotalRevenueAllTime() {
        return totalRevenueAllTime;
    }

    public void setTotalRevenueAllTime(double totalRevenueAllTime) {
        this.totalRevenueAllTime = totalRevenueAllTime;
    }

    public long getPaidCount() {
        return paidCount;
    }

    public void setPaidCount(long paidCount) {
        this.paidCount = paidCount;
    }

    public long getExpiringSoonCount() {
        return expiringSoonCount;
    }

    public void setExpiringSoonCount(long expiringSoonCount) {
        this.expiringSoonCount = expiringSoonCount;
    }

    public long getOverdueCount() {
        return overdueCount;
    }

    public void setOverdueCount(long overdueCount) {
        this.overdueCount = overdueCount;
    }

    public long getPendingApprovalCount() {
        return pendingApprovalCount;
    }

    public void setPendingApprovalCount(long pendingApprovalCount) {
        this.pendingApprovalCount = pendingApprovalCount;
    }
}

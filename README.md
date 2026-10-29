# Hostel Management System (HostelEase)

A full-stack, enterprise-grade Hostel Residence and Fee Payment Management System built strictly using **React** for the frontend and **Spring Boot (Java)** for the backend, tailored for complete **Warden Administrative Management**.

---

## 🚀 Key Highlights & Features (Unified Warden System)

### 1. Unified Warden Administration (All Access to Warden)
- **Role switcher removed**: The entire interface is centralized for the Warden to manage hostel operations from one master panel.
- **Master Navigation**:
  - 📊 **Overview & Analytics**: Live hosteller counts, bed occupancy, monthly fee collection, and overdue renewal alerts.
  - 👥 **Student Resident Records**: Complete directory of all hostel residents with status badges (`PAID`, `EXPIRING_SOON`, `OVERDUE`, `PENDING_APPROVAL`).
  - 🏠 **Rooms & Fee Structure**: Base Rent + Mess Fee + Maintenance breakdown and live bed occupancy per room.
  - 💳 **Fee Payments & Receipts**: Historic audit trail with downloadable/printable receipts.
- **Individual Resident Stay Ledger Modal**: Clicking on any resident's name or ledger icon opens their complete stay tracking card, month validity countdown, itemized fee breakdown, assigned room & roommates, and full payment invoice history.

### 2. 1-Month Fee Payment & Stay Extension Workflow
- **Month-by-Month Extension**: When the Warden records a payment (1, 2, or 3 months), the resident's `stayValidUntil` date automatically advances forward by that duration.
- **Automated Status Checking**:
  - 🟢 **PAID**: Stay valid with $>7$ days remaining.
  - 🟡 **EXPIRING SOON**: Stay expires in $\le 7$ days.
  - 🔴 **OVERDUE**: Stay expired without renewal payment.
  - 🔵 **PENDING APPROVAL**: Payment submitted for verification.


---

## 🛠️ Technology Stack

- **Frontend**: React (Vite, React 19, Lucide React icons, Responsive CSS)
- **Backend**: Spring Boot 3.3.4 (Java 17/21+, Spring Web, Spring Data JPA, Hibernate, H2 Database)
- **Database**: H2 Persistent File Database (`./backend/data/hosteldb`) with H2 Web Console

---

## 🏃 Running the Application

### Backend (Spring Boot):
```bash
cd backend
mvn spring-boot:run
```
- API Base URL: `http://localhost:8080/api`
- H2 Database Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:./data/hosteldb`
  - User: `sa`
  - Password: *(leave blank)*

### Frontend (React):
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`
- Connected to Spring Boot via Vite API proxy.

---

## 👥 Demo Pre-Loaded Accounts & Scenarios

The system automatically initializes 5 resident scenarios on first boot:
1. **Aarav Sharma (`HST-2026-101`)**: Room A-101 (Single AC) — **Status: PAID** (Valid for 30 more days).
2. **Rohan Verma (`HST-2026-102`)**: Room A-102 (Double Sharing) — **Status: EXPIRING SOON** (Expires in 4 days).
3. **Priya Patel (`HST-2026-103`)**: Room B-201 (Double Sharing) — **Status: OVERDUE** (Expired 9 days ago).
4. **Sneha Kulkarni (`HST-2026-104`)**: Room B-202 (Triple Sharing) — **Status: PENDING APPROVAL** (Payment submitted via UPI).
5. **Devansh Nair (`HST-2026-105`)**: Room C-301 (Single Suite) — **Status: PAID** (Advance extended for 2 months).

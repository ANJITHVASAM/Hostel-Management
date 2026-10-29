package com.hostel.controller;

import com.hostel.dto.PaymentRequestDTO;
import com.hostel.model.PaymentRecord;
import com.hostel.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentRecord>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<PaymentRecord>> getPaymentsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(paymentService.getPaymentsByStudentId(studentId));
    }

    @GetMapping("/roll/{rollNumber}")
    public ResponseEntity<List<PaymentRecord>> getPaymentsByRollNumber(@PathVariable String rollNumber) {
        return ResponseEntity.ok(paymentService.getPaymentsByRollNumber(rollNumber));
    }

    @PostMapping("/extend")
    public ResponseEntity<?> processStayExtension(@RequestBody PaymentRequestDTO request) {
        try {
            PaymentRecord record = paymentService.processStayExtension(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(record);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<?> verifyPayment(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        try {
            boolean approve = payload.getOrDefault("approve", true);
            PaymentRecord record = paymentService.verifyPayment(id, approve);
            return ResponseEntity.ok(record);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/revert")
    public ResponseEntity<?> revertPayment(@PathVariable Long id, @RequestBody(required = false) Map<String, String> payload) {
        try {
            String reason = payload != null ? payload.getOrDefault("reason", "Mistaken stay extension") : "Mistaken stay extension";
            PaymentRecord record = paymentService.revertPayment(id, reason);
            return ResponseEntity.ok(record);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

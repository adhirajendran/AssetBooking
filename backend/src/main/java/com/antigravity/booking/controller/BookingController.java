package com.antigravity.booking.controller;

import com.antigravity.booking.dto.BookingRequest;
import com.antigravity.booking.model.Booking;
import com.antigravity.booking.model.BookingStatus;
import com.antigravity.booking.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*") // Allow frontend access easily for demo
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request) {
        // In real app, extract userId from JWT. Here we pass it or assume from request.
        Booking booking = bookingService.createBooking(request, request.getUserId());
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }
    
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(@PathVariable Long id, @RequestParam BookingStatus status, @RequestParam Long adminId) {
        return ResponseEntity.ok(bookingService.changeBookingStatus(id, status, adminId));
    }
}

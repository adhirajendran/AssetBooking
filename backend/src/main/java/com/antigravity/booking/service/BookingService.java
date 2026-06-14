package com.antigravity.booking.service;

import com.antigravity.booking.dto.BookingRequest;
import com.antigravity.booking.model.*;
import com.antigravity.booking.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public BookingService(BookingRepository bookingRepository, AssetRepository assetRepository, 
                          UserRepository userRepository, AuditLogRepository auditLogRepository) {
        this.bookingRepository = bookingRepository;
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public Booking createBooking(BookingRequest request, Long performedByUserId) {
        long overlaps = bookingRepository.countOverlappingBookings(
                request.getAssetId(), request.getStartTime(), request.getEndTime());
        
        if (overlaps > 0) {
            throw new RuntimeException("Asset is already booked for the selected time range.");
        }

        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new RuntimeException("Asset not found"));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        BookingStatus initialStatus = asset.isRequiresApproval() ? BookingStatus.PENDING : BookingStatus.APPROVED;

        Booking booking = Booking.builder()
                .asset(asset)
                .user(user)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(initialStatus)
                .purpose(request.getPurpose())
                .build();

        booking = bookingRepository.save(booking);

        logAudit("Booking", booking.getId(), "CREATED", "Booking created with status: " + initialStatus, performedByUserId);
        return booking;
    }

    @Transactional
    public Booking changeBookingStatus(Long bookingId, BookingStatus newStatus, Long performedByAdminId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(newStatus);
        booking = bookingRepository.save(booking);

        logAudit("Booking", booking.getId(), "STATUS_CHANGED", "Status changed to " + newStatus, performedByAdminId);
        return booking;
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    private void logAudit(String type, Long id, String action, String details, Long userId) {
        AuditLog log = AuditLog.builder()
                .entityType(type)
                .entityId(id)
                .action(action)
                .details(details)
                .performedBy(userId != null ? userRepository.findById(userId).orElse(null) : null)
                .build();
        auditLogRepository.save(log);
    }
}

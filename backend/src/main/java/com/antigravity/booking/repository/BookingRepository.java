package com.antigravity.booking.repository;

import com.antigravity.booking.model.Booking;
import com.antigravity.booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByAssetId(Long assetId);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.asset.id = :assetId " +
           "AND b.status IN ('PENDING', 'APPROVED') " +
           "AND NOT (b.endTime <= :newStart OR b.startTime >= :newEnd)")
    long countOverlappingBookings(@Param("assetId") Long assetId,
                                  @Param("newStart") LocalDateTime newStart,
                                  @Param("newEnd") LocalDateTime newEnd);
}

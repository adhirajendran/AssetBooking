package com.antigravity.booking.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequest {
    private Long assetId;
    private Long userId; // Provided manually for now until JWT is fully parsed
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
}

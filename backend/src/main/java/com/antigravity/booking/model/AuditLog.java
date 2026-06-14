package com.antigravity.booking.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String entityType; // e.g., "Booking", "Asset"

    @Column(nullable = false)
    private Long entityId;

    @Column(nullable = false)
    private String action; // e.g., "CREATED", "STATUS_CHANGED"

    @Column(length = 1000)
    private String details;

    @ManyToOne
    @JoinColumn(name = "performed_by", nullable = true) // null if SYSTEM
    private User performedBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}

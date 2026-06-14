package com.antigravity.booking.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetType type;

    private String location;

    @Column(nullable = false)
    private boolean active = true;

    // e.g. Laptops might require approval, Desks might not
    @Column(nullable = false)
    private boolean requiresApproval = false;
}

package com.antigravity.booking.repository;

import com.antigravity.booking.model.Asset;
import com.antigravity.booking.model.AssetType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByType(AssetType type);
    List<Asset> findByActiveTrue();
}

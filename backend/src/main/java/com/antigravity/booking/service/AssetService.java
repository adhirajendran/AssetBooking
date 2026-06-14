package com.antigravity.booking.service;

import com.antigravity.booking.model.Asset;
import com.antigravity.booking.repository.AssetRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AssetService {

    private final AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Asset createAsset(Asset asset) {
        return assetRepository.save(asset);
    }
}

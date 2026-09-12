package com.skillup.skillup.features.learning.dto;

public record LearningResourceResponse(
        Long id,
        String name,
        String provider,
        String url,
        String type,
        Long sectorId,
        Long jobRoleId
) {}

package com.skillup.skillup.features.learning.dto;

public record LearningResourceRequest(
        String name,
        String provider,
        String url,
        String type,
        Long sectorId,
        Long jobRoleId
) {}

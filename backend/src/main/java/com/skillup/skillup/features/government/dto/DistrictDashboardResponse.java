package com.skillup.skillup.features.government.dto;

public record DistrictDashboardResponse(
        Long districtId,
        String districtName,
        Integer criticalGaps,
        Integer prioritySkills,
        Integer trainingCapacity,
        Integer alerts,
        Integer pendingRecommendations,
        Integer activeActionPlans,
        Integer pendingRequests,
        Double implementationProgress
) {
}
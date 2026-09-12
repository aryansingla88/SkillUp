package com.skillup.skillup.features.government.dto;

public record SkillGapResponse(
        Long id,
        Long districtId,
        Long jobRoleId,
        Long skillId,
        Integer year,
        Integer demand,
        Integer trainingCapacity,
        Integer gap,
        Double priorityScore
) {
}
package com.skillup.skillup.features.curriculum.dto;

public record CurriculumGapResponse(
        Long skillId,
        String skillName,
        String requiredLevel,
        String curriculumCoverage,
        String gap,
        String recommendedUpdate) {}

package com.skillup.skillup.features.curriculum.dto;

import com.skillup.skillup.features.reference.dto.response.SkillResponse;

public record CurriculumGapResponse(
        SkillResponse skill,
        String requiredLevel,
        String curriculumCoverage,
        String gap,
        String recommendedUpdate) {}

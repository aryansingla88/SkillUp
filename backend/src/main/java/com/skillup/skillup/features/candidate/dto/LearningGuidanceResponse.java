package com.skillup.skillup.features.candidate.dto;

import com.skillup.skillup.features.learning.dto.LearningResourceResponse;

public record LearningGuidanceResponse(
        LearningResourceResponse learningResource,
        SkillResponse targetSkill,
        String reason,
        String priority
) {}

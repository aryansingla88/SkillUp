package com.skillup.skillup.features.candidate.dto;

import java.util.List;

public record CareerMatchResponse(
        JobRoleResponse jobRole,
        Double matchPercentage,
        List<SkillResponse> matchedSkills,
        List<SkillResponse> missingSkills,
        String explanation
) {}

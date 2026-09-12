package com.skillup.skillup.features.learning.dto;

import com.skillup.skillup.features.candidate.dto.SkillResponse;
import java.util.List;

public record LearningResourceDetailResponse(
        Long id,
        String name,
        String provider,
        String url,
        String type,
        Long sectorId,
        Long jobRoleId,
        List<SkillResponse> skills
) {}

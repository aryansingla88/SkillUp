package com.skillup.skillup.features.government.dto;

import com.skillup.skillup.features.reference.dto.response.DistrictResponse;
import com.skillup.skillup.features.reference.dto.response.JobRoleResponse;
import com.skillup.skillup.features.reference.dto.response.SkillResponse;

public record SkillGapResponse(
        Long id,
        DistrictResponse district,
        JobRoleResponse jobRole,
        SkillResponse skill,
        Integer year,
        Integer demand,
        Integer trainingCapacity,
        Integer gap,
        Double priorityScore
) {}

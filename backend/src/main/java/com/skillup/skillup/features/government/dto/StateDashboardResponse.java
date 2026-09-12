package com.skillup.skillup.features.government.dto;

import java.util.List;

public record StateDashboardResponse(
        Integer criticalSkillGaps,
        Integer emergingSkills,
        Integer districtsAtRisk,
        Integer curriculumMismatches,
        Integer highGrowthSectors,
        List<SkillGapResponse> topDistrictPriorities
) {
}
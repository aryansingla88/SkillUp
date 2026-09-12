package com.skillup.skillup.features.government.service;

import com.skillup.skillup.features.government.dto.DistrictDashboardResponse;
import com.skillup.skillup.features.government.dto.PageSkillGapResponse;
import com.skillup.skillup.features.government.dto.StateDashboardResponse;

public interface GovernmentIntelligenceService {

    StateDashboardResponse getStateDashboard();

    DistrictDashboardResponse getDistrictDashboard(Long districtId);

    PageSkillGapResponse getDistrictSkillGaps(
            Long districtId,
            int page,
            int limit
    );

    void calculateSkillGaps(Long districtId, Integer year);
}
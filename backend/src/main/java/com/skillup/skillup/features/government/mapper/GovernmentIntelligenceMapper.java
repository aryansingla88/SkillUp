package com.skillup.skillup.features.government.mapper;

import com.skillup.skillup.features.government.dto.SkillGapResponse;
import com.skillup.skillup.features.government.entity.SkillGapAnalysis;
import org.springframework.stereotype.Component;

@Component
public class GovernmentIntelligenceMapper {

    public SkillGapResponse toSkillGapResponse(
            SkillGapAnalysis entity
    ) {
        return new SkillGapResponse(
                entity.getId(),
                entity.getDistrictId(),
                entity.getJobRoleId(),
                entity.getSkillId(),
                entity.getYear(),
                entity.getDemand(),
                entity.getTrainingCapacity(),
                entity.getGap(),
                entity.getPriorityScore()
        );
    }
}
package com.skillup.skillup.features.government.mapper;

import com.skillup.skillup.features.government.dto.SkillGapResponse;
import com.skillup.skillup.features.government.entity.SkillGapAnalysis;
import com.skillup.skillup.features.reference.mapper.ReferenceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GovernmentIntelligenceMapper {
    private final ReferenceMapper referenceMapper;

    public SkillGapResponse toSkillGapResponse(SkillGapAnalysis entity) {
        return new SkillGapResponse(
                entity.getId(),
                referenceMapper.toDistrictResponse(entity.getDistrict()),
                referenceMapper.toJobRoleResponse(entity.getJobRole()),
                referenceMapper.toSkillResponse(entity.getSkill()),
                entity.getYear(),
                entity.getDemand(),
                entity.getTrainingCapacity(),
                entity.getGap(),
                entity.getPriorityScore() != null
                        ? entity.getPriorityScore().doubleValue()
                        : null
        );
    }
}

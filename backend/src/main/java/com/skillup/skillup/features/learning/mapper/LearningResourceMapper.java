package com.skillup.skillup.features.learning.mapper;

import com.skillup.skillup.features.candidate.dto.SkillResponse;
import com.skillup.skillup.features.learning.dto.LearningResourceDetailResponse;
import com.skillup.skillup.features.learning.dto.LearningResourceResponse;
import com.skillup.skillup.features.learning.entity.LearningResource;
import com.skillup.skillup.features.learning.entity.ResourceSkillMapping;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LearningResourceMapper {
    public LearningResourceResponse toResponse(LearningResource resource) {
        return new LearningResourceResponse(
                resource.getId(),
                resource.getName(),
                resource.getProvider(),
                resource.getUrl(),
                resource.getType(),
                resource.getSector() == null ? null : resource.getSector().getId(),
                resource.getJobRole() == null ? null : resource.getJobRole().getId()
        );
    }

    public LearningResourceDetailResponse toDetailResponse(LearningResource resource, List<ResourceSkillMapping> mappings) {
        List<SkillResponse> skills = mappings.stream()
                .map(ResourceSkillMapping::getSkill)
                .distinct()
                .map(skill -> new SkillResponse(skill.getId(), skill.getSector().getId(), skill.getName()))
                .toList();

        LearningResourceResponse base = toResponse(resource);
        return new LearningResourceDetailResponse(
                base.id(), base.name(), base.provider(), base.url(), base.type(),
                base.sectorId(), base.jobRoleId(), skills
        );
    }
}

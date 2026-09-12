package com.skillup.skillup.features.reference.mapper;

import com.skillup.skillup.features.reference.dto.response.*;
import com.skillup.skillup.features.reference.entity.District;
import com.skillup.skillup.features.reference.entity.Sector;
import com.skillup.skillup.features.reference.entity.JobRole;
import com.skillup.skillup.features.reference.entity.Subskill;
import com.skillup.skillup.features.skill.entity.Skill;
import org.springframework.stereotype.Component;

@Component
public class ReferenceMapper {

    public DistrictResponse toDistrictResponse(District district) {
        return DistrictResponse.builder()
                .id(district.getId())
                .state(district.getState())
                .name(district.getName())
                .build();
    }

    public SectorResponse toSectorResponse(Sector sector) {
        return SectorResponse.builder()
                .id(sector.getId())
                .name(sector.getName())
                .build();
    }

    public JobRoleResponse toJobRoleResponse(JobRole jobRole) {
        return JobRoleResponse.builder()
                .id(jobRole.getId())
                .sectorId(jobRole.getSector().getId())
                .name(jobRole.getName())
                .build();
    }

    public SkillResponse toSkillResponse(Skill skill) {
        return SkillResponse.builder()
                .id(skill.getId())
                .sectorId(skill.getSector().getId())
                .name(skill.getName())
                .build();
    }

    public SubskillResponse toSubskillResponse(Subskill subskill) {
        return SubskillResponse.builder()
                .id(subskill.getId())
                .skillId(subskill.getSkill().getId())
                .name(subskill.getName())
                .build();
    }
}
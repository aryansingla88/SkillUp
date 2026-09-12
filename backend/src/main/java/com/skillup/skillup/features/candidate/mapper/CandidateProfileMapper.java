package com.skillup.skillup.features.candidate.mapper;

import com.skillup.skillup.features.candidate.dto.CandidateProfileResponse;
import com.skillup.skillup.features.candidate.dto.DistrictResponse;
import com.skillup.skillup.features.candidate.dto.JobRoleResponse;
import com.skillup.skillup.features.candidate.entity.CandidateProfile;
import org.springframework.stereotype.Component;
import com.skillup.skillup.features.reference.entity.JobRole;

@Component
public class CandidateProfileMapper {
    public CandidateProfileResponse toResponse(CandidateProfile entity) {
        DistrictResponse district = new DistrictResponse(
                entity.getDistrict().getId(),
                entity.getDistrict().getState(),
                entity.getDistrict().getName()
        );

        JobRoleResponse careerGoal = null;
        JobRole jobRole = entity.getCareerGoalJobRole();
        if (jobRole != null) {
            careerGoal = new JobRoleResponse(
                    jobRole.getId(),
                    jobRole.getSector().getId(),
                    jobRole.getName()
            );
        }

        return new CandidateProfileResponse(
                entity.getId(),
                entity.getUser().getId(),
                district,
                entity.getEducation(),
                careerGoal
        );
    }
}

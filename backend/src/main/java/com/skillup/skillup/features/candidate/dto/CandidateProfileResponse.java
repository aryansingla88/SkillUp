package com.skillup.skillup.features.candidate.dto;

public record CandidateProfileResponse(
        Long id,
        Long userId,
        DistrictResponse district,
        String education,
        JobRoleResponse careerGoalJobRole
) {}

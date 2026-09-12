package com.skillup.skillup.features.candidate.dto;

public record CandidateProfileRequest(
        Long districtId,
        String education,
        Long careerGoalJobRoleId
) {}

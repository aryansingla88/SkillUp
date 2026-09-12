package com.skillup.skillup.features.candidate.dto;

public record CandidateReadinessResponse(
        Double readinessPercentage,
        JobRoleResponse targetJobRole,
        String summary
) {}

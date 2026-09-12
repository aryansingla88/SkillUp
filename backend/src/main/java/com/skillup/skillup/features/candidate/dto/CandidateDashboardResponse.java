package com.skillup.skillup.features.candidate.dto;

import java.util.List;

public record CandidateDashboardResponse(
        CandidateProfileResponse candidate,
        List<CareerMatchResponse> topCareerMatches,
        List<CandidateSkillGapResponse> topSkillGaps,
        CandidateReadinessResponse readiness,
        List<LearningGuidanceResponse> learningGuidance
) {}

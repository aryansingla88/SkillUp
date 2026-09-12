package com.skillup.skillup.features.candidate.dto;

public record CandidateSkillGapResponse(
        SkillResponse skill,
        String requiredLevel,
        String currentLevel,
        String gap,
        String priority
) {}

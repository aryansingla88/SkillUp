package com.skillup.skillup.features.candidate.dto;

import jakarta.validation.constraints.NotNull;

public record CandidateSkillRequest(
        @NotNull Long skillId,
        @NotNull String proficiency
) {}

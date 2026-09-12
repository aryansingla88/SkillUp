package com.skillup.skillup.features.government.dto;

import java.util.List;

public record PageSkillGapResponse(
        List<SkillGapResponse> content,
        int page,
        int limit,
        long totalElements,
        int totalPages
) {
}
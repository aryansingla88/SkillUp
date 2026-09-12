package com.skillup.skillup.features.learning.dto;

import java.util.List;

public record PageLearningResourceResponse(
        List<LearningResourceResponse> content,
        int page,
        int limit,
        long totalElements,
        int totalPages
) {}

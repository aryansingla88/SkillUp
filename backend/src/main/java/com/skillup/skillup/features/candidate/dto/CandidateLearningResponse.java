package com.skillup.skillup.features.candidate.dto;

import com.skillup.skillup.features.learning.dto.LearningResourceResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CandidateLearningResponse {
    private Long id;
    private LearningResourceResponse learningResource;
    private String status;
    private Integer progress;
}

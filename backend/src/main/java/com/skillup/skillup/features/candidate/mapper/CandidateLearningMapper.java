package com.skillup.skillup.features.candidate.mapper;

import com.skillup.skillup.features.candidate.dto.CandidateLearningResponse;
import com.skillup.skillup.features.candidate.entity.CandidateLearning;
import com.skillup.skillup.features.learning.mapper.LearningResourceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CandidateLearningMapper {
    private final LearningResourceMapper learningResourceMapper;

    public CandidateLearningResponse toResponse(CandidateLearning entity) {
        return new CandidateLearningResponse(
                entity.getId(),
                learningResourceMapper.toResponse(entity.getLearningResource()),
                entity.getStatus(),
                entity.getProgress()
        );
    }
}

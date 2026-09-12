package com.skillup.skillup.features.recommendation.dto.response;

import com.skillup.skillup.features.recommendation.entity.RecommendationStatus;
import com.skillup.skillup.features.recommendation.entity.RecommendationType;

public class RecommendationResponse {

    private Long id;
    private Long skillGapId;
    private RecommendationType type;
    private String title;
    private String description;
    private RecommendationStatus status;

    public RecommendationResponse() {
    }

    public RecommendationResponse(
            Long id,
            Long skillGapId,
            RecommendationType type,
            String title,
            String description,
            RecommendationStatus status
    ) {
        this.id = id;
        this.skillGapId = skillGapId;
        this.type = type;
        this.title = title;
        this.description = description;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getSkillGapId() {
        return skillGapId;
    }

    public RecommendationType getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public RecommendationStatus getStatus() {
        return status;
    }
}
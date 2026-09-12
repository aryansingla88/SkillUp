package com.skillup.skillup.features.recommendation.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "skill_gap_id", nullable = false)
    private Long skillGapId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private RecommendationType type;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RecommendationStatus status;

    public Recommendation() {
    }

    public Recommendation(
            Long skillGapId,
            RecommendationType type,
            String title,
            String description,
            RecommendationStatus status
    ) {
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

    public void setSkillGapId(Long skillGapId) {
        this.skillGapId = skillGapId;
    }

    public RecommendationType getType() {
        return type;
    }

    public void setType(RecommendationType type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RecommendationStatus getStatus() {
        return status;
    }

    public void setStatus(RecommendationStatus status) {
        this.status = status;
    }
}
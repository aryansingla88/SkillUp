package com.skillup.skillup.features.recommendation.dto.response;

import com.skillup.skillup.features.recommendation.entity.RecommendationStatus;
import com.skillup.skillup.features.recommendation.entity.RecommendationType;

import java.util.List;

public class RecommendationDetailResponse {

    private Long id;
    private Long skillGapId;
    private RecommendationType type;
    private String title;
    private String description;
    private RecommendationStatus status;

    private SkillGapResponse skillGap;

    private PriorityFactorsResponse priorityFactors;

    private List<String> evidence;

    private List<String> suggestedActions;

    public RecommendationDetailResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public SkillGapResponse getSkillGap() {
        return skillGap;
    }

    public void setSkillGap(SkillGapResponse skillGap) {
        this.skillGap = skillGap;
    }

    public PriorityFactorsResponse getPriorityFactors() {
        return priorityFactors;
    }

    public void setPriorityFactors(PriorityFactorsResponse priorityFactors) {
        this.priorityFactors = priorityFactors;
    }

    public List<String> getEvidence() {
        return evidence;
    }

    public void setEvidence(List<String> evidence) {
        this.evidence = evidence;
    }

    public List<String> getSuggestedActions() {
        return suggestedActions;
    }

    public void setSuggestedActions(List<String> suggestedActions) {
        this.suggestedActions = suggestedActions;
    }

    public static class SkillGapResponse {

        private Long id;
        private Long districtId;
        private Long jobRoleId;
        private Long skillId;
        private Integer year;
        private Integer demand;
        private Integer trainingCapacity;
        private Integer gap;
        private Double priorityScore;

        public SkillGapResponse() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getDistrictId() {
            return districtId;
        }

        public void setDistrictId(Long districtId) {
            this.districtId = districtId;
        }

        public Long getJobRoleId() {
            return jobRoleId;
        }

        public void setJobRoleId(Long jobRoleId) {
            this.jobRoleId = jobRoleId;
        }

        public Long getSkillId() {
            return skillId;
        }

        public void setSkillId(Long skillId) {
            this.skillId = skillId;
        }

        public Integer getYear() {
            return year;
        }

        public void setYear(Integer year) {
            this.year = year;
        }

        public Integer getDemand() {
            return demand;
        }

        public void setDemand(Integer demand) {
            this.demand = demand;
        }

        public Integer getTrainingCapacity() {
            return trainingCapacity;
        }

        public void setTrainingCapacity(Integer trainingCapacity) {
            this.trainingCapacity = trainingCapacity;
        }

        public Integer getGap() {
            return gap;
        }

        public void setGap(Integer gap) {
            this.gap = gap;
        }

        public Double getPriorityScore() {
            return priorityScore;
        }

        public void setPriorityScore(Double priorityScore) {
            this.priorityScore = priorityScore;
        }
    }
}
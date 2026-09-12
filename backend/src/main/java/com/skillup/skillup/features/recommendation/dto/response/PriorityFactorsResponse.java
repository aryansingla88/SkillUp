package com.skillup.skillup.features.recommendation.dto.response;

public class PriorityFactorsResponse {

    private Integer demandScore;
    private Integer gapScore;
    private Integer growthScore;
    private Integer futureDemandScore;
    private Integer industryRelevanceScore;
    private Integer regionalRelevanceScore;

    public PriorityFactorsResponse() {
    }

    public PriorityFactorsResponse(
            Integer demandScore,
            Integer gapScore,
            Integer growthScore,
            Integer futureDemandScore,
            Integer industryRelevanceScore,
            Integer regionalRelevanceScore
    ) {
        this.demandScore = demandScore;
        this.gapScore = gapScore;
        this.growthScore = growthScore;
        this.futureDemandScore = futureDemandScore;
        this.industryRelevanceScore = industryRelevanceScore;
        this.regionalRelevanceScore = regionalRelevanceScore;
    }

    public Integer getDemandScore() {
        return demandScore;
    }

    public void setDemandScore(Integer demandScore) {
        this.demandScore = demandScore;
    }

    public Integer getGapScore() {
        return gapScore;
    }

    public void setGapScore(Integer gapScore) {
        this.gapScore = gapScore;
    }

    public Integer getGrowthScore() {
        return growthScore;
    }

    public void setGrowthScore(Integer growthScore) {
        this.growthScore = growthScore;
    }

    public Integer getFutureDemandScore() {
        return futureDemandScore;
    }

    public void setFutureDemandScore(Integer futureDemandScore) {
        this.futureDemandScore = futureDemandScore;
    }

    public Integer getIndustryRelevanceScore() {
        return industryRelevanceScore;
    }

    public void setIndustryRelevanceScore(Integer industryRelevanceScore) {
        this.industryRelevanceScore = industryRelevanceScore;
    }

    public Integer getRegionalRelevanceScore() {
        return regionalRelevanceScore;
    }

    public void setRegionalRelevanceScore(Integer regionalRelevanceScore) {
        this.regionalRelevanceScore = regionalRelevanceScore;
    }
}
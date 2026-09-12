package com.skillup.skillup.features.recommendation.dto.response;

import java.util.List;

public class PageRecommendationResponse {

    private List<RecommendationResponse> content;
    private int page;
    private int limit;
    private long totalElements;
    private int totalPages;

    public PageRecommendationResponse() {
    }

    public PageRecommendationResponse(
            List<RecommendationResponse> content,
            int page,
            int limit,
            long totalElements,
            int totalPages
    ) {
        this.content = content;
        this.page = page;
        this.limit = limit;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }

    public List<RecommendationResponse> getContent() {
        return content;
    }

    public void setContent(List<RecommendationResponse> content) {
        this.content = content;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
}
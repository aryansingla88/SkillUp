package com.skillup.skillup.features.recommendation.controller;

import com.skillup.skillup.features.recommendation.dto.request.RecommendationDecisionRequest;
import com.skillup.skillup.features.recommendation.dto.response.PageRecommendationResponse;
import com.skillup.skillup.features.recommendation.dto.response.RecommendationDetailResponse;
import com.skillup.skillup.features.recommendation.dto.response.RecommendationResponse;
import com.skillup.skillup.features.recommendation.service.RecommendationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(
            RecommendationService recommendationService
    ) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<PageRecommendationResponse> getRecommendations(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long districtId
    ) {

        return ResponseEntity.ok(
                recommendationService.getRecommendations(
                        page,
                        limit,
                        status,
                        type,
                        districtId
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecommendationDetailResponse> getRecommendation(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                recommendationService.getRecommendationDetail(id)
        );
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<RecommendationResponse> approveRecommendation(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                recommendationService.approveRecommendation(id)
        );
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<RecommendationResponse> rejectRecommendation(
            @PathVariable Long id,
            @RequestBody(required = false) RecommendationDecisionRequest request
    ) {

        if (request == null) {
            request = new RecommendationDecisionRequest();
        }

        return ResponseEntity.ok(
                recommendationService.rejectRecommendation(id, request)
        );
    }
}
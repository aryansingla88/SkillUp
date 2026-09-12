package com.skillup.skillup.features.recommendation.service;

import com.skillup.skillup.features.recommendation.dto.request.RecommendationDecisionRequest;
import com.skillup.skillup.features.recommendation.dto.response.PageRecommendationResponse;
import com.skillup.skillup.features.recommendation.dto.response.PriorityFactorsResponse;
import com.skillup.skillup.features.recommendation.dto.response.RecommendationDetailResponse;
import com.skillup.skillup.features.recommendation.dto.response.RecommendationResponse;
import com.skillup.skillup.features.recommendation.entity.Recommendation;
import com.skillup.skillup.features.recommendation.entity.RecommendationStatus;
import com.skillup.skillup.features.recommendation.entity.RecommendationType;
import com.skillup.skillup.features.recommendation.repository.RecommendationRepository;

import com.skillup.skillup.features.recommendation.repository.SkillGapQueryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final SkillGapQueryRepository skillGapQueryRepository;

    public RecommendationService(
            RecommendationRepository recommendationRepository,
            SkillGapQueryRepository skillGapQueryRepository
    ) {
        this.recommendationRepository = recommendationRepository;
        this.skillGapQueryRepository = skillGapQueryRepository;
    }

    public PageRecommendationResponse getRecommendations(
            int page,
            int limit,
            String status,
            String type,
            Long districtId
    ) {

        if (page < 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Page must be greater than or equal to 1"
            );
        }

        if (limit < 1 || limit > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Limit must be between 1 and 100"
            );
        }

        RecommendationStatus recommendationStatus = parseStatus(status);
        RecommendationType recommendationType = parseType(type);

        Pageable pageable = PageRequest.of(page - 1, limit);

        Page<Recommendation> result =
                recommendationRepository.findRecommendations(
                        recommendationStatus == null
                                ? null
                                : recommendationStatus.name(),

                        recommendationType == null
                                ? null
                                : recommendationType.name(),

                        districtId,
                        pageable
                );

        List<RecommendationResponse> content = result.getContent()
                .stream()
                .map(this::toResponse)
                .toList();

        return new PageRecommendationResponse(
                content,
                page,
                limit,
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    public RecommendationDetailResponse getRecommendationDetail(Long id) {

        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Recommendation not found with id: " + id
                ));

        SkillGapQueryRepository.SkillGapData skillGap =
                skillGapQueryRepository.findById(
                        recommendation.getSkillGapId()
                ).orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Skill gap not found with id: "
                                + recommendation.getSkillGapId()
                ));

        RecommendationDetailResponse response =
                new RecommendationDetailResponse();

        response.setId(recommendation.getId());
        response.setSkillGapId(recommendation.getSkillGapId());
        response.setType(recommendation.getType());
        response.setTitle(recommendation.getTitle());
        response.setDescription(recommendation.getDescription());
        response.setStatus(recommendation.getStatus());

        /*
         * Populate skill gap information
         */
        RecommendationDetailResponse.SkillGapResponse skillGapResponse =
                new RecommendationDetailResponse.SkillGapResponse();

        skillGapResponse.setId(skillGap.getId());
        skillGapResponse.setDistrictId(skillGap.getDistrictId());
        skillGapResponse.setJobRoleId(skillGap.getJobRoleId());
        skillGapResponse.setSkillId(skillGap.getSkillId());
        skillGapResponse.setYear(skillGap.getYear());
        skillGapResponse.setDemand(skillGap.getDemand());
        skillGapResponse.setTrainingCapacity(skillGap.getTrainingCapacity());
        skillGapResponse.setGap(skillGap.getGap());
        skillGapResponse.setPriorityScore(skillGap.getPriorityScore());

        response.setSkillGap(skillGapResponse);

        /*
         * The current skill_gap_analysis table contains the priority score
         * but not the six individual priority-factor scores required by
         * the API contract.
         *
         * Therefore we don't invent those values here.
         */
        response.setPriorityFactors(
                new PriorityFactorsResponse(
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                )
        );

        /*
         * Evidence and suggested actions are not stored in the
         * recommendations table or skill_gap_analysis table currently.
         *
         * These will be connected when their source tables/entities
         * are implemented.
         */
        response.setEvidence(List.of());
        response.setSuggestedActions(List.of());

        return response;
    }

    public RecommendationResponse getRecommendation(Long id) {

        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Recommendation not found with id: " + id
                ));

        return toResponse(recommendation);
    }

    public RecommendationResponse approveRecommendation(Long id) {

        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Recommendation not found with id: " + id
                ));

        recommendation.setStatus(RecommendationStatus.APPROVED);

        Recommendation saved =
                recommendationRepository.save(recommendation);

        return toResponse(saved);
    }

    public RecommendationResponse rejectRecommendation(
            Long id,
            RecommendationDecisionRequest request
    ) {

        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Recommendation not found with id: " + id
                ));

        recommendation.setStatus(RecommendationStatus.REJECTED);

        Recommendation saved =
                recommendationRepository.save(recommendation);

        return toResponse(saved);
    }

    private RecommendationResponse toResponse(
            Recommendation recommendation
    ) {

        return new RecommendationResponse(
                recommendation.getId(),
                recommendation.getSkillGapId(),
                recommendation.getType(),
                recommendation.getTitle(),
                recommendation.getDescription(),
                recommendation.getStatus()
        );
    }

    private RecommendationStatus parseStatus(String status) {

        if (status == null || status.isBlank()) {
            return null;
        }

        try {
            return RecommendationStatus.valueOf(
                    status.toUpperCase()
            );
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid recommendation status: " + status
            );
        }
    }

    private RecommendationType parseType(String type) {

        if (type == null || type.isBlank()) {
            return null;
        }

        try {
            return RecommendationType.valueOf(
                    type.toUpperCase()
            );
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid recommendation type: " + type
            );
        }
    }
}
package com.skillup.skillup.features.candidate.service;

import com.skillup.skillup.common.exception.ResourceNotFoundException;
import com.skillup.skillup.common.security.CurrentUserService;
import com.skillup.skillup.features.candidate.dto.CandidateLearningRequest;
import com.skillup.skillup.features.candidate.dto.CandidateLearningResponse;
import com.skillup.skillup.features.candidate.entity.CandidateLearning;
import com.skillup.skillup.features.candidate.entity.CandidateProfile;
import com.skillup.skillup.features.candidate.mapper.CandidateLearningMapper;
import com.skillup.skillup.features.candidate.repository.CandidateLearningRepository;
import com.skillup.skillup.features.candidate.repository.CandidateProfileRepository;
import com.skillup.skillup.features.learning.entity.LearningResource;
import com.skillup.skillup.features.learning.repository.LearningResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CandidateLearningService {
    private static final List<String> STATUSES = List.of("PLANNED", "IN_PROGRESS", "COMPLETED", "DROPPED");

    private final CandidateLearningRepository candidateLearningRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final LearningResourceRepository learningResourceRepository;
    private final CandidateLearningMapper mapper;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public List<CandidateLearningResponse> getAll() {
        CandidateProfile candidate = getCurrentCandidate();
        return candidateLearningRepository.findByCandidateIdOrderByIdDesc(candidate.getId())
                .stream().map(mapper::toResponse).toList();
    }

    public CandidateLearningResponse create(CandidateLearningRequest request) {
        validateRequest(request);
        CandidateProfile candidate = getCurrentCandidate();
        if (candidateLearningRepository.existsByCandidateIdAndLearningResourceId(candidate.getId(), request.getLearningResourceId())) {
            throw new IllegalArgumentException("Learning resource already added by candidate");
        }
        LearningResource resource = getResource(request.getLearningResourceId());
        CandidateLearning entity = new CandidateLearning();
        entity.setCandidate(candidate);
        entity.setLearningResource(resource);
        entity.setStatus(request.getStatus());
        entity.setProgress(request.getProgress() == null ? 0 : request.getProgress());
        return mapper.toResponse(candidateLearningRepository.save(entity));
    }

    public CandidateLearningResponse update(Long id, CandidateLearningRequest request) {
        validateRequest(request);
        CandidateProfile candidate = getCurrentCandidate();
        CandidateLearning entity = candidateLearningRepository.findByIdAndCandidateId(id, candidate.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate learning not found: " + id));
        entity.setLearningResource(getResource(request.getLearningResourceId()));
        entity.setStatus(request.getStatus());
        entity.setProgress(request.getProgress() == null ? 0 : request.getProgress());
        return mapper.toResponse(candidateLearningRepository.save(entity));
    }

    public void delete(Long id) {
        CandidateProfile candidate = getCurrentCandidate();
        CandidateLearning entity = candidateLearningRepository.findByIdAndCandidateId(id, candidate.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate learning not found: " + id));
        candidateLearningRepository.delete(entity);
    }

    private CandidateProfile getCurrentCandidate() {
        return candidateProfileRepository.findByUserId(currentUserService.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
    }

    private LearningResource getResource(Long id) {
        return learningResourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found: " + id));
    }

    private void validateRequest(CandidateLearningRequest request) {
        if (request.getLearningResourceId() == null || request.getStatus() == null) {
            throw new IllegalArgumentException("learningResourceId and status are required");
        }
        if (!STATUSES.contains(request.getStatus())) {
            throw new IllegalArgumentException("Invalid status: " + request.getStatus());
        }
        if (request.getProgress() != null && (request.getProgress() < 0 || request.getProgress() > 100)) {
            throw new IllegalArgumentException("progress must be between 0 and 100");
        }
    }
}

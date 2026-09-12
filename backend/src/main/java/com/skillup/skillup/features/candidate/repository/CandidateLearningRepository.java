package com.skillup.skillup.features.candidate.repository;

import com.skillup.skillup.features.candidate.entity.CandidateLearning;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CandidateLearningRepository extends JpaRepository<CandidateLearning, Long> {
    List<CandidateLearning> findByCandidateIdOrderByIdDesc(Long candidateId);
    Optional<CandidateLearning> findByIdAndCandidateId(Long id, Long candidateId);
    boolean existsByCandidateIdAndLearningResourceId(Long candidateId, Long learningResourceId);
}

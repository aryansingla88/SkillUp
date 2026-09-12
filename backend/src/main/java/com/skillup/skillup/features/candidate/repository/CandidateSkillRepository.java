package com.skillup.skillup.features.candidate.repository;

import com.skillup.skillup.features.candidate.entity.CandidateSkill;
import com.skillup.skillup.features.candidate.entity.CandidateSkillId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateSkillRepository extends JpaRepository<CandidateSkill, CandidateSkillId> {
    List<CandidateSkill> findByCandidate_Id(Long candidateId);
}

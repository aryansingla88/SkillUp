package com.skillup.skillup.features.candidate.service;

import com.skillup.skillup.common.exception.ResourceNotFoundException;
import com.skillup.skillup.common.security.CurrentUserService;
import com.skillup.skillup.features.candidate.dto.CandidateSkillRequest;
import com.skillup.skillup.features.candidate.dto.CandidateSkillResponse;
import com.skillup.skillup.features.candidate.entity.CandidateProfile;
import com.skillup.skillup.features.candidate.entity.CandidateSkill;
import com.skillup.skillup.features.candidate.entity.CandidateSkillId;
import com.skillup.skillup.features.candidate.mapper.CandidateSkillMapper;
import com.skillup.skillup.features.candidate.repository.CandidateProfileRepository;
import com.skillup.skillup.features.candidate.repository.CandidateSkillRepository;
import com.skillup.skillup.features.skill.entity.Skill;
import com.skillup.skillup.features.skill.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CandidateSkillService {

    private final CandidateSkillRepository candidateSkillRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final SkillRepository skillRepository;
    private final CandidateSkillMapper mapper;
    private final CurrentUserService currentUserService;

    public List<CandidateSkillResponse> getCandidateSkills() {
        CandidateProfile candidate = getCurrentCandidate();
        return candidateSkillRepository.findByCandidate_Id(candidate.getId())
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public CandidateSkillResponse addCandidateSkill(CandidateSkillRequest request) {
        CandidateProfile candidate = getCurrentCandidate();
        Skill skill = getSkill(request.skillId());
        CandidateSkillId id = new CandidateSkillId(candidate.getId(), skill.getId());

        if (candidateSkillRepository.existsById(id)) {
            throw new IllegalArgumentException("Candidate already has this skill");
        }

        CandidateSkill candidateSkill = new CandidateSkill();
        candidateSkill.setId(id);
        candidateSkill.setCandidate(candidate);
        candidateSkill.setSkill(skill);
        candidateSkill.setProficiency(request.proficiency());

        return mapper.toResponse(candidateSkillRepository.save(candidateSkill));
    }

    @Transactional
    public CandidateSkillResponse updateCandidateSkill(Long skillId, CandidateSkillRequest request) {
        if (!skillId.equals(request.skillId())) {
            throw new IllegalArgumentException("Path skillId must match request skillId");
        }

        CandidateProfile candidate = getCurrentCandidate();
        CandidateSkill candidateSkill = candidateSkillRepository.findById(
                new CandidateSkillId(candidate.getId(), skillId)
        ).orElseThrow(() -> new ResourceNotFoundException("Candidate skill not found"));

        candidateSkill.setProficiency(request.proficiency());
        return mapper.toResponse(candidateSkillRepository.save(candidateSkill));
    }

    @Transactional
    public void deleteCandidateSkill(Long skillId) {
        CandidateProfile candidate = getCurrentCandidate();
        CandidateSkillId id = new CandidateSkillId(candidate.getId(), skillId);

        if (!candidateSkillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Candidate skill not found");
        }

        candidateSkillRepository.deleteById(id);
    }

    private CandidateProfile getCurrentCandidate() {
        Long userId = currentUserService.getCurrentUserId();
        return candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
    }

    private Skill getSkill(Long skillId) {
        return skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
    }
}

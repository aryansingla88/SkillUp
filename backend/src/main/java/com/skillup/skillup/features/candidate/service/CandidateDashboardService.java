package com.skillup.skillup.features.candidate.service;

import com.skillup.skillup.common.exception.ResourceNotFoundException;
import com.skillup.skillup.common.security.CurrentUserService;
import com.skillup.skillup.features.candidate.dto.*;
import com.skillup.skillup.features.candidate.entity.CandidateLearning;
import com.skillup.skillup.features.candidate.entity.CandidateProfile;
import com.skillup.skillup.features.candidate.entity.CandidateSkill;
import com.skillup.skillup.features.candidate.mapper.CandidateProfileMapper;
import com.skillup.skillup.features.candidate.repository.CandidateLearningRepository;
import com.skillup.skillup.features.candidate.repository.CandidateProfileRepository;
import com.skillup.skillup.features.candidate.repository.CandidateSkillRepository;
import com.skillup.skillup.features.jobrole.entity.JobRole;
import com.skillup.skillup.features.jobrole.entity.JobRoleRequirement;
import com.skillup.skillup.features.jobrole.repository.JobRoleRepository;
import com.skillup.skillup.features.jobrole.repository.JobRoleRequirementRepository;
import com.skillup.skillup.features.learning.entity.LearningResource;
import com.skillup.skillup.features.learning.entity.ResourceSkillMapping;
import com.skillup.skillup.features.learning.mapper.LearningResourceMapper;
import com.skillup.skillup.features.learning.repository.LearningResourceRepository;
import com.skillup.skillup.features.learning.repository.ResourceSkillMappingRepository;
import com.skillup.skillup.features.skill.entity.Skill;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidateDashboardService {
    private final CandidateProfileRepository candidateProfileRepository;
    private final CandidateSkillRepository candidateSkillRepository;
    private final CandidateLearningRepository candidateLearningRepository;
    private final JobRoleRepository jobRoleRepository;
    private final JobRoleRequirementRepository requirementRepository;
    private final LearningResourceRepository learningResourceRepository;
    private final ResourceSkillMappingRepository mappingRepository;
    private final CandidateProfileMapper profileMapper;
    private final LearningResourceMapper resourceMapper;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public CandidateDashboardResponse getDashboard() {
        CandidateProfile candidate = candidateProfileRepository.findByUserId(currentUserService.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        Map<Long, CandidateSkill> candidateSkills = candidateSkillRepository.findByCandidate_Id(candidate.getId())
                .stream().collect(Collectors.toMap(cs -> cs.getSkill().getId(), Function.identity(), (a, b) -> a));

        List<CareerMatchResponse> matches = jobRoleRepository.findAll().stream()
                .map(role -> buildCareerMatch(role, candidateSkills))
                .sorted(Comparator.comparing(CareerMatchResponse::matchPercentage).reversed())
                .limit(5)
                .toList();

        JobRole target = candidate.getCareerGoalJobRole();
        List<CandidateSkillGapResponse> gaps = target == null ? List.of() : buildGaps(target, candidateSkills);
        CandidateReadinessResponse readiness = buildReadiness(target, gaps);
        List<LearningGuidanceResponse> guidance = buildLearningGuidance(gaps, candidate);

        return new CandidateDashboardResponse(
                profileMapper.toResponse(candidate), matches, gaps, readiness, guidance
        );
    }

    private CareerMatchResponse buildCareerMatch(JobRole role, Map<Long, CandidateSkill> candidateSkills) {
        List<JobRoleRequirement> requirements = requirementRepository.findByJobRoleId(role.getId());
        List<SkillResponse> matched = new ArrayList<>();
        List<SkillResponse> missing = new ArrayList<>();
        for (JobRoleRequirement req : requirements) {
            Skill skill = req.getSkill();
            SkillResponse response = new SkillResponse(skill.getId(), skill.getSector().getId(), skill.getName());
            CandidateSkill current = candidateSkills.get(skill.getId());
            if (current != null && level(current.getProficiency()) >= level(req.getRequiredLevel())) matched.add(response);
            else missing.add(response);
        }
        double percentage = requirements.isEmpty() ? 0.0 : (matched.size() * 100.0 / requirements.size());
        String explanation = requirements.isEmpty()
                ? "No skill requirements are configured for this job role."
                : matched.size() + " of " + requirements.size() + " required skills currently meet the required level.";
        return new CareerMatchResponse(jobRole(role), round(percentage), matched, missing, explanation);
    }

    private List<CandidateSkillGapResponse> buildGaps(
            JobRole role,
            Map<Long, CandidateSkill> candidateSkills) {

        return requirementRepository.findByJobRoleId(role.getId()).stream()
                .map(req -> {
                    CandidateSkill current = candidateSkills.get(req.getSkillId());

                    int required = level(req.getRequiredLevel());
                    int currentLevel = current == null ? 0 : level(current.getProficiency());

                    int diff = Math.max(0, required - currentLevel);

                    String currentText =
                            current == null ? "NOT_ADDED" : current.getProficiency();

                    String priority =
                            diff >= 2 ? "HIGH" :
                                    diff == 1 ? "MEDIUM" : "LOW";

                    Skill skill = req.getSkill();

                    return new CandidateSkillGapResponse(
                            new SkillResponse(
                                    skill.getId(),
                                    skill.getSector().getId(),
                                    skill.getName()
                            ),
                            req.getRequiredLevel(),
                            currentText,
                            diff == 0 ? "0" : String.valueOf(diff),
                            priority
                    );
                })
                .filter(g -> !"0".equals(g.gap()))
                .sorted(Comparator.comparingInt(
                        (CandidateSkillGapResponse g) -> priorityRank(g.priority())
                ).reversed())
                .limit(5)
                .toList();
    }

    private CandidateReadinessResponse buildReadiness(JobRole target, List<CandidateSkillGapResponse> gaps) {
        if (target == null) return new CandidateReadinessResponse(0.0, null, "No career goal is configured yet.");
        List<JobRoleRequirement> reqs = requirementRepository.findByJobRoleId(target.getId());
        double readiness = reqs.isEmpty() ? 0.0 : ((reqs.size() - gaps.size()) * 100.0 / reqs.size());
        return new CandidateReadinessResponse(round(readiness), jobRole(target),
                gaps.isEmpty() ? "All configured target skills meet the required level." : gaps.size() + " target skill gaps remain.");
    }

    private List<LearningGuidanceResponse> buildLearningGuidance(List<CandidateSkillGapResponse> gaps, CandidateProfile candidate) {
        if (gaps.isEmpty()) return List.of();
        Set<Long> gapSkillIds = gaps.stream().map(g -> g.skill().id()).collect(Collectors.toSet());
        Set<Long> alreadyLearning = candidateLearningRepository.findByCandidateIdOrderByIdDesc(candidate.getId()).stream()
                .map(CandidateLearning::getLearningResource).map(LearningResource::getId).collect(Collectors.toSet());
        List<LearningGuidanceResponse> result = new ArrayList<>();
        for (LearningResource resource : learningResourceRepository.findAll()) {
            if (alreadyLearning.contains(resource.getId())) continue;
            List<ResourceSkillMapping> mappings = mappingRepository.findByLearningResource_Id(resource.getId());
            for (ResourceSkillMapping mapping : mappings) {
                if (gapSkillIds.contains(mapping.getSkill().getId())) {
                    Skill skill = mapping.getSkill();
                    CandidateSkillGapResponse gap = gaps.stream().filter(g -> g.skill().id().equals(skill.getId())).findFirst().orElse(null);
                    result.add(new LearningGuidanceResponse(resourceMapper.toResponse(resource),
                            new SkillResponse(skill.getId(), skill.getSector().getId(), skill.getName()),
                            "This resource can help close the target skill gap.", gap == null ? "MEDIUM" : gap.priority()));
                    break;
                }
            }
        }
        return result.stream().limit(5).toList();
    }

    private JobRoleResponse jobRole(JobRole role) { return new JobRoleResponse(role.getId(), role.getSector().getId(), role.getName()); }
    private int priorityRank(String p) { return "HIGH".equals(p) ? 3 : "MEDIUM".equals(p) ? 2 : 1; }
    private int level(String value) {
        if (value == null) return 0;
        return switch (value.trim().toUpperCase()) {
            case "BEGINNER", "BASIC" -> 1;
            case "INTERMEDIATE", "MEDIUM" -> 2;
            case "ADVANCED" -> 3;
            case "EXPERT" -> 4;
            default -> 1;
        };
    }
    private double round(double value) { return Math.round(value * 100.0) / 100.0; }
}

package com.skillup.skillup.features.curriculum.service;

import com.skillup.skillup.common.exception.ResourceNotFoundException;
import com.skillup.skillup.features.curriculum.dto.CurriculumDetailResponse;
import com.skillup.skillup.features.curriculum.dto.CurriculumGapResponse;
import com.skillup.skillup.features.curriculum.dto.CurriculumResponse;
import com.skillup.skillup.features.curriculum.dto.CurriculumSkillResponse;
import com.skillup.skillup.features.curriculum.entity.CurriculumSkillMapping;
import com.skillup.skillup.features.curriculum.entity.TrainingCurriculum;
import com.skillup.skillup.features.curriculum.mapper.CurriculumMapper;
import com.skillup.skillup.features.curriculum.repository.CurriculumSkillMappingRepository;
import com.skillup.skillup.features.curriculum.repository.TrainingCurriculumRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CurriculumServiceImpl implements CurriculumService {

    private final TrainingCurriculumRepository curriculumRepository;
    private final CurriculumSkillMappingRepository mappingRepository;
    private final CurriculumMapper mapper;

    public CurriculumServiceImpl(
            TrainingCurriculumRepository curriculumRepository,
            CurriculumSkillMappingRepository mappingRepository,
            CurriculumMapper mapper) {
        this.curriculumRepository = curriculumRepository;
        this.mappingRepository = mappingRepository;
        this.mapper = mapper;
    }

    @Override
    public List<CurriculumResponse> getCurricula() {
        return curriculumRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    public CurriculumDetailResponse getCurriculum(Long id) {
        TrainingCurriculum curriculum = curriculumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Curriculum not found with id: " + id));

        List<CurriculumSkillResponse> skills = mappingRepository.findByCurriculumId(id)
                .stream().map(mapper::toSkillResponse).toList();

        return mapper.toDetailResponse(curriculum, skills);
    }

    @Override
    public List<CurriculumGapResponse> getCurriculumGaps(Long id) {
        if (!curriculumRepository.existsById(id)) {
            throw new ResourceNotFoundException("Curriculum not found with id: " + id);
        }

        // P0/P1 deterministic alignment view.
        // Market/job-role gap analytics remain owned by Government Intelligence.
        return mappingRepository.findByCurriculumId(id).stream()
                .map(this::toGapResponse)
                .toList();
    }

    private CurriculumGapResponse toGapResponse(CurriculumSkillMapping mapping) {
        String coverage = mapping.getSubskill() != null ? "ALIGNED" : "PARTIAL";
        String gap = coverage.equals("ALIGNED")
                ? "Skill has a mapped subskill in the curriculum."
                : "Skill mapping exists but subskill-level coverage is incomplete.";
        String update = coverage.equals("ALIGNED")
                ? "Validate the module against current skill requirements."
                : "Add or revise module content for the required subskill.";

        // requiredLevel is not stored in curriculum_skill_mapping.
        // It is therefore intentionally reported as null rather than inventing a value.
        return new CurriculumGapResponse(
                mapping.getSkill() == null ? null :
                        new com.skillup.skillup.features.reference.dto.response.SkillResponse(
                                mapping.getSkill().getId(),
                                mapping.getSkill().getSector().getId(),
                                mapping.getSkill().getName()),
                null,
                coverage,
                gap,
                update);
    }
}

package com.skillup.skillup.features.curriculum.service;

import com.skillup.skillup.common.exception.ResourceNotFoundException;
import com.skillup.skillup.features.curriculum.dto.*;
import com.skillup.skillup.features.curriculum.entity.CurriculumSkillMapping;
import com.skillup.skillup.features.curriculum.entity.TrainingCurriculum;
import com.skillup.skillup.features.curriculum.mapper.CurriculumMapper;
import com.skillup.skillup.features.curriculum.repository.*;
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
        String skillName = mapping.getSkill() != null
                ? mapping.getSkill().getName() : "Skill #" + mapping.getSkillId();

        String coverage = mapping.getSubskill() != null ? "ALIGNED" : "PARTIAL";
        String gap = coverage.equals("ALIGNED")
                ? "Skill is represented with subskill-level curriculum coverage."
                : "Skill is mapped but subskill-level coverage is incomplete.";

        String update = coverage.equals("ALIGNED")
                ? "Validate module content against current market requirements."
                : "Add or revise module content to cover the required subskill.";

        return new CurriculumGapResponse(
                mapping.getSkillId(),
                skillName,
                "REQUIRED",
                coverage,
                gap,
                update);
    }
}

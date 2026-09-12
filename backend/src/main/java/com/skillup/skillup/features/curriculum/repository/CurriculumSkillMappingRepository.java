package com.skillup.skillup.features.curriculum.repository;

import com.skillup.skillup.features.curriculum.entity.CurriculumSkillMapping;
import com.skillup.skillup.features.curriculum.entity.CurriculumSkillMappingId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CurriculumSkillMappingRepository
        extends JpaRepository<CurriculumSkillMapping, CurriculumSkillMappingId> {

    List<CurriculumSkillMapping> findByCurriculumId(Long curriculumId);

    Optional<CurriculumSkillMapping> findByCurriculumIdAndSkillIdAndSubskillId(
            Long curriculumId,
            Long skillId,
            Long subskillId
    );

    void deleteByCurriculumIdAndSkillIdAndSubskillId(
            Long curriculumId,
            Long skillId,
            Long subskillId
    );
}
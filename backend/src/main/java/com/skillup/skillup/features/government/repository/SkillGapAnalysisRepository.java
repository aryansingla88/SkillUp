package com.skillup.skillup.features.government.repository;

import com.skillup.skillup.features.government.entity.SkillGapAnalysis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SkillGapAnalysisRepository
        extends JpaRepository<SkillGapAnalysis, Long> {

    Page<SkillGapAnalysis> findByDistrictId(
            Long districtId,
            Pageable pageable
    );

    List<SkillGapAnalysis> findByDistrictId(
            Long districtId
    );

    Optional<SkillGapAnalysis>
    findByDistrictIdAndJobRoleIdAndSkillIdAndYear(
            Long districtId,
            Long jobRoleId,
            Long skillId,
            Integer year
    );

    List<SkillGapAnalysis> findByYear(
            Integer year
    );
}
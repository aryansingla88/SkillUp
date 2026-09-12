package com.skillup.skillup.features.learning.repository;

import com.skillup.skillup.features.learning.entity.LearningResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {
    Page<LearningResource> findBySector_Id(Long sectorId, Pageable pageable);
    Page<LearningResource> findByJobRole_Id(Long jobRoleId, Pageable pageable);
    Page<LearningResource> findBySector_IdAndJobRole_Id(Long sectorId, Long jobRoleId, Pageable pageable);
}

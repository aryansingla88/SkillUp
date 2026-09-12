package com.skillup.skillup.features.learning.repository;

import com.skillup.skillup.features.learning.entity.ResourceSkillMapping;
import com.skillup.skillup.features.learning.entity.ResourceSkillMappingId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResourceSkillMappingRepository extends JpaRepository<ResourceSkillMapping, ResourceSkillMappingId> {
    List<ResourceSkillMapping> findByLearningResource_Id(Long learningResourceId);
}

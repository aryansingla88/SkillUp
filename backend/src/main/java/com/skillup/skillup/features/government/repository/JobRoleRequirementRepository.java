package com.skillup.skillup.features.government.repository;

import com.skillup.skillup.features.government.entity.JobRoleRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRoleRequirementRepository extends JpaRepository<JobRoleRequirement, com.skillup.skillup.features.government.entity.JobRoleRequirementId> {
    List<JobRoleRequirement> findByJobRole_Id(Long jobRoleId);
    List<JobRoleRequirement> findBySkill_Id(Long skillId);
}

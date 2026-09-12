package com.skillup.skillup.features.jobrole.repository;

import com.skillup.skillup.features.jobrole.entity.JobRoleRequirement;
import com.skillup.skillup.features.jobrole.entity.JobRoleRequirementId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRoleRequirementRepository extends JpaRepository<JobRoleRequirement, JobRoleRequirementId> {
    List<JobRoleRequirement> findByJobRoleId(Long jobRoleId);
}

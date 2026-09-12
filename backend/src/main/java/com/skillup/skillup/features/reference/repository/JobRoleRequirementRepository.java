package com.skillup.skillup.features.reference.repository;

import com.skillup.skillup.features.reference.entity.JobRoleRequirement;
import com.skillup.skillup.features.reference.entity.JobRoleRequirementId;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRoleRequirementRepository extends JpaRepository<JobRoleRequirement, JobRoleRequirementId> {
    List<JobRoleRequirement> findByJobRoleId(Long jobRoleId);
}

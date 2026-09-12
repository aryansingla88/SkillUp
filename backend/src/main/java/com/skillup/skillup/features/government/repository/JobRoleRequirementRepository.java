package com.skillup.skillup.features.government.repository;

import com.skillup.skillup.features.government.entity.JobRoleRequirement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRoleRequirementRepository
        extends JpaRepository<JobRoleRequirement, Long> {

    List<JobRoleRequirement> findByJobRoleId(Long jobRoleId);

    List<JobRoleRequirement> findBySkillId(Long skillId);
}
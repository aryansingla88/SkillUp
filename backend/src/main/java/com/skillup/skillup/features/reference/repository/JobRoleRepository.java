package com.skillup.skillup.features.reference.repository;

import com.skillup.skillup.features.reference.entity.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRoleRepository extends JpaRepository<JobRole, Long> {

    List<JobRole> findBySector_Id(Long sectorId);
}
package com.skillup.skillup.features.reference.repository;

import com.skillup.skillup.features.reference.entity.Subskill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubskillRepository extends JpaRepository<Subskill, Long> {

    List<Subskill> findBySkill_Id(Long skillId);
}
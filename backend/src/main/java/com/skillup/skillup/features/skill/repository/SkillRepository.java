package com.skillup.skillup.features.skill.repository;

import com.skillup.skillup.features.skill.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findBySector_Id(Long sectorId);
}
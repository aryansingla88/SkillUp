package com.skillup.skillup.features.skill.repository;

import com.skillup.skillup.features.skill.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
}

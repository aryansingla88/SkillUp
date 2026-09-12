package com.skillup.skillup.features.curriculum.dto;

public record CurriculumSkillResponse(
        Long skillId, Long subskillId, String skillName, String subskillName, String moduleName) {}

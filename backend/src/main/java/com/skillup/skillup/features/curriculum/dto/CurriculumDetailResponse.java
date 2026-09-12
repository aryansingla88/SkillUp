package com.skillup.skillup.features.curriculum.dto;

import java.util.List;

public record CurriculumDetailResponse(
        Long id, String name, String version, List<CurriculumSkillResponse> skills) {}

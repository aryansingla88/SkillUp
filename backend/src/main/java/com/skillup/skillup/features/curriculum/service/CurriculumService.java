package com.skillup.skillup.features.curriculum.service;

import com.skillup.skillup.features.curriculum.dto.CurriculumDetailResponse;
import com.skillup.skillup.features.curriculum.dto.CurriculumGapResponse;
import com.skillup.skillup.features.curriculum.dto.CurriculumResponse;

import java.util.List;

public interface CurriculumService {
    List<CurriculumResponse> getCurricula();
    CurriculumDetailResponse getCurriculum(Long id);
    List<CurriculumGapResponse> getCurriculumGaps(Long id);
}

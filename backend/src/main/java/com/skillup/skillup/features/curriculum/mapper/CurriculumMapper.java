package com.skillup.skillup.features.curriculum.mapper;

import com.skillup.skillup.features.curriculum.dto.CurriculumDetailResponse;
import com.skillup.skillup.features.curriculum.dto.CurriculumResponse;
import com.skillup.skillup.features.curriculum.dto.CurriculumSkillResponse;
import com.skillup.skillup.features.curriculum.entity.CurriculumSkillMapping;
import com.skillup.skillup.features.curriculum.entity.TrainingCurriculum;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CurriculumMapper {

    public CurriculumResponse toResponse(TrainingCurriculum c) {
        return new CurriculumResponse(
                c.getId(),
                c.getName(),
                c.getVersion()
        );
    }

    public CurriculumSkillResponse toSkillResponse(CurriculumSkillMapping m) {
        return new CurriculumSkillResponse(
                m.getSkillId(),
                m.getSubskillId(),
                m.getSkill() != null ? m.getSkill().getName() : null,
                m.getSubskill() != null ? m.getSubskill().getName() : null,
                m.getModuleName()
        );
    }

    public CurriculumDetailResponse toDetailResponse(
            TrainingCurriculum c,
            List<CurriculumSkillResponse> skills) {

        return new CurriculumDetailResponse(
                c.getId(),
                c.getName(),
                c.getVersion(),
                skills
        );
    }
}
package com.skillup.skillup.features.curriculum.entity;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class CurriculumSkillMappingId implements Serializable {

    private Long curriculumId;
    private Long skillId;
    private Long subskillId;
}
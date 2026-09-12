package com.skillup.skillup.features.curriculum.entity;

import lombok.*;

import java.io.Serializable;

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
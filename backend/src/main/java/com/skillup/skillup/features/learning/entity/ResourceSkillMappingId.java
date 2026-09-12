package com.skillup.skillup.features.learning.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ResourceSkillMappingId implements Serializable {

    @Column(name = "learning_resource_id")
    private Long learningResourceId;

    @Column(name = "skill_id")
    private Long skillId;

    @Column(name = "subskill_id")
    private Long subskillId;
}

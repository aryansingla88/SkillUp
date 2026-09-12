package com.skillup.skillup.features.learning.entity;

import com.skillup.skillup.features.skill.entity.Skill;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "resource_skill_mapping")
@Getter
@Setter
@NoArgsConstructor
public class ResourceSkillMapping {
    @EmbeddedId
    private ResourceSkillMappingId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("learningResourceId")
    @JoinColumn(name = "learning_resource_id", nullable = false)
    private LearningResource learningResource;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("skillId")
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("subskillId")
    @JoinColumn(name = "subskill_id", nullable = false)
    private com.skillup.skillup.features.skill.entity.SubSkill subskill;
}

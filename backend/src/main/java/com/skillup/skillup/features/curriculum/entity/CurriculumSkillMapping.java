package com.skillup.skillup.features.curriculum.entity;

import com.skillup.skillup.features.reference.entity.Skill;
import com.skillup.skillup.features.reference.entity.Subskill;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "curriculum_skill_mapping")
@IdClass(CurriculumSkillMappingId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurriculumSkillMapping {

    @Id
    @Column(name = "curriculum_id")
    private Long curriculumId;

    @Id
    @Column(name = "skill_id")
    private Long skillId;

    @Id
    @Column(name = "subskill_id")
    private Long subskillId;

    @Column(name = "module_name")
    private String moduleName;

    @ManyToOne
    @JoinColumn(
            name = "skill_id",
            insertable = false,
            updatable = false
    )
    private Skill skill;

    @ManyToOne
    @JoinColumn(
            name = "subskill_id",
            insertable = false,
            updatable = false
    )
    private Subskill subskill;

    @ManyToOne
    @JoinColumn(
            name = "curriculum_id",
            insertable = false,
            updatable = false
    )
    private TrainingCurriculum curriculum;
}
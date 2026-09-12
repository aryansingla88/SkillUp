package com.skillup.skillup.features.jobrole.entity;

import com.skillup.skillup.features.skill.entity.Skill;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "job_role_requirements")
@IdClass(JobRoleRequirementId.class)
@Getter @Setter @NoArgsConstructor
public class JobRoleRequirement {
    @Id
    @Column(name = "job_role_id")
    private Long jobRoleId;

    @Id
    @Column(name = "skill_id")
    private Long skillId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_role_id", insertable = false, updatable = false)
    private JobRole jobRole;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", insertable = false, updatable = false)
    private Skill skill;

    @Column(name = "required_level", nullable = false, length = 50)
    private String requiredLevel;
}

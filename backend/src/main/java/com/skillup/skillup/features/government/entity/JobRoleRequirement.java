package com.skillup.skillup.features.government.entity;

import com.skillup.skillup.features.reference.entity.JobRole;
import jakarta.persistence.*;
import lombok.*;
import com.skillup.skillup.features.skill.entity.Skill;


@Entity
@Table(name = "job_role_requirements")
@IdClass(JobRoleRequirementId.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobRoleRequirement {
    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_role_id", nullable = false)
    private JobRole jobRole;

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "required_level", nullable = false)
    private String requiredLevel;
}

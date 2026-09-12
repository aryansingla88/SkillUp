package com.skillup.skillup.features.government.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_role_requirements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRoleRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_role_id", nullable = false)
    private Long jobRoleId;

    @Column(name = "skill_id", nullable = false)
    private Long skillId;

    @Column(name = "required_level", nullable = false)
    private String requiredLevel;

    @Column(nullable = false)
    private Double importance;
}
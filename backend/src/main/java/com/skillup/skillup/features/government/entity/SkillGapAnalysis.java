package com.skillup.skillup.features.government.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill_gap_analysis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillGapAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "district_id", nullable = false)
    private Long districtId;

    @Column(name = "job_role_id", nullable = false)
    private Long jobRoleId;

    @Column(name = "skill_id", nullable = false)
    private Long skillId;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer demand;

    @Column(name = "training_capacity", nullable = false)
    private Integer trainingCapacity;

    @Column(nullable = false)
    private Integer gap;

    @Column(name = "priority_score", nullable = false)
    private Double priorityScore;
}
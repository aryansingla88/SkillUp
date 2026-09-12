package com.skillup.skillup.features.government.entity;

import com.skillup.skillup.features.reference.entity.District;
import com.skillup.skillup.features.reference.entity.JobRole;
import com.skillup.skillup.features.reference.entity.Skill;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "skill_gap_analysis")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SkillGapAnalysis {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_role_id", nullable = false)
    private JobRole jobRole;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer demand;

    @Column(name = "training_capacity", nullable = false)
    private Integer trainingCapacity;

    @Column(nullable = false)
    private Integer gap;

    @Column(name = "priority_score", nullable = false, precision = 10, scale = 2)
    private BigDecimal priorityScore;
}

package com.skillup.skillup.features.government.entity;

import com.skillup.skillup.features.reference.entity.JobRole;
import com.skillup.skillup.features.reference.entity.Skill;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "training_supply")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TrainingSupply {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "training_centre_id", nullable = false)
    private TrainingCentre trainingCentre;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_role_id", nullable = false)
    private JobRole jobRole;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer capacity;
}

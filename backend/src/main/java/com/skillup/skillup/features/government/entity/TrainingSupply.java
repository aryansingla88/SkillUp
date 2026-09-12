package com.skillup.skillup.features.government.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "training_supply")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingSupply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "training_centre_id", nullable = false)
    private Long trainingCentreId;

    @Column(name = "job_role_id", nullable = false)
    private Long jobRoleId;

    @Column(name = "skill_id", nullable = false)
    private Long skillId;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Integer year;
}
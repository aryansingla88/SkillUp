package com.skillup.skillup.features.government.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "training_centres")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingCentre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "district_id", nullable = false)
    private Long districtId;

    @Column(nullable = false)
    private String name;

    @Column(name = "ownership_type", nullable = false)
    private String ownershipType;
}
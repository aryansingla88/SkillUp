package com.skillup.skillup.features.government.entity;

import com.skillup.skillup.features.reference.entity.District;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "training_centres")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TrainingCentre {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @Column(nullable = false)
    private String name;

    @Column(name = "ownership_type", nullable = false)
    private String ownershipType;
}

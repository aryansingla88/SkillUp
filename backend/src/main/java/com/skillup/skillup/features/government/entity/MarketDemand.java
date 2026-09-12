package com.skillup.skillup.features.government.entity;

import com.skillup.skillup.features.reference.entity.District;
import com.skillup.skillup.features.reference.entity.JobRole;
import com.skillup.skillup.features.reference.entity.Skill;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "market_demand")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MarketDemand {
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

    @Column(name = "demand_count", nullable = false)
    private Integer demand;

    @Column(name = "source_type", nullable = false)
    private String sourceType;
}

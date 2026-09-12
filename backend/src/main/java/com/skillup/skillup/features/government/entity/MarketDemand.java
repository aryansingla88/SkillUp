package com.skillup.skillup.features.government.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "market_demand")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketDemand {

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

    @Column(name = "growth_rate")
    private Double growthRate;

    @Column(name = "future_demand")
    private Double futureDemand;

    @Column(name = "industry_relevance")
    private Double industryRelevance;

    @Column(name = "regional_relevance")
    private Double regionalRelevance;

    @Column(name = "source_type")
    private String sourceType;
}
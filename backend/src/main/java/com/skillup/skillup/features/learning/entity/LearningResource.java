package com.skillup.skillup.features.learning.entity;

import com.skillup.skillup.features.reference.entity.JobRole;
import com.skillup.skillup.features.reference.entity.Sector;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "learning_resources")
@Getter
@Setter
@NoArgsConstructor
public class LearningResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 255)
    private String provider;

    @Column(columnDefinition = "text")
    private String url;

    @Column(nullable = false, length = 50)
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id")
    private Sector sector;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_role_id")
    private JobRole jobRole;
}

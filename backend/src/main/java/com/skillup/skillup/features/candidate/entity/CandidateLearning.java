package com.skillup.skillup.features.candidate.entity;

import com.skillup.skillup.features.learning.entity.LearningResource;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "candidate_learning")
@Getter
@Setter
@NoArgsConstructor
public class CandidateLearning {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private CandidateProfile candidate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "learning_resource_id", nullable = false)
    private LearningResource learningResource;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(nullable = false)
    private Integer progress = 0;
}

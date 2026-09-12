package com.skillup.skillup.features.curriculum.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "training_curricula")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TrainingCurriculum {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 50)
    private String version;
}

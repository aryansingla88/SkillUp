package com.skillup.skillup.features.reference.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subskills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subskill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private String name;
}
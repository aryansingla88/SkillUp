package com.skillup.skillup.features.skill.entity;

import com.skillup.skillup.features.jobrole.entity.Sector;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sector_id", nullable = false)
    private Sector sector;

    @Column(name = "name")
    private String name;
}

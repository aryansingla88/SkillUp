package com.skillup.skillup.features.candidate.entity;

import com.skillup.skillup.features.skill.entity.Skill;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "candidate_skills")
@Getter
@Setter
@NoArgsConstructor
public class CandidateSkill {

    @EmbeddedId
    private CandidateSkillId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("candidateId")
    @JoinColumn(name = "candidate_id", nullable = false)
    private CandidateProfile candidate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("skillId")
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(name = "proficiency")
    private String proficiency;
}

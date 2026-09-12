package com.skillup.skillup.features.candidate.entity;

import com.skillup.skillup.features.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.skillup.skillup.features.reference.entity.District;
import com.skillup.skillup.features.reference.entity.JobRole;
@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
public class CandidateProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @Column(length = 255)
    private String education;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_goal_job_role_id")
    private JobRole careerGoalJobRole;
}

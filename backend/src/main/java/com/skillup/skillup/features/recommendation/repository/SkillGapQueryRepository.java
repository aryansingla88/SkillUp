package com.skillup.skillup.features.recommendation.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class SkillGapQueryRepository {

    private final JdbcTemplate jdbcTemplate;

    public SkillGapQueryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<SkillGapData> findById(Long id) {

        String sql = """
                SELECT
                    id,
                    district_id,
                    job_role_id,
                    skill_id,
                    year,
                    demand,
                    training_capacity,
                    gap,
                    priority_score
                FROM skill_gap_analysis
                WHERE id = ?
                """;

        return jdbcTemplate.query(
                sql,
                rs -> {
                    if (!rs.next()) {
                        return Optional.empty();
                    }

                    SkillGapData data = new SkillGapData();

                    data.setId(rs.getLong("id"));
                    data.setDistrictId(rs.getLong("district_id"));
                    data.setJobRoleId(rs.getLong("job_role_id"));
                    data.setSkillId(rs.getLong("skill_id"));
                    data.setYear(rs.getInt("year"));
                    data.setDemand(rs.getInt("demand"));
                    data.setTrainingCapacity(rs.getInt("training_capacity"));
                    data.setGap(rs.getInt("gap"));

                    Number priorityScore =
                            (Number) rs.getObject("priority_score");

                    data.setPriorityScore(
                            priorityScore == null
                                    ? null
                                    : priorityScore.doubleValue()
                    );

                    return Optional.of(data);
                },
                id
        );
    }

    public static class SkillGapData {

        private Long id;
        private Long districtId;
        private Long jobRoleId;
        private Long skillId;
        private Integer year;
        private Integer demand;
        private Integer trainingCapacity;
        private Integer gap;
        private Double priorityScore;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getDistrictId() {
            return districtId;
        }

        public void setDistrictId(Long districtId) {
            this.districtId = districtId;
        }

        public Long getJobRoleId() {
            return jobRoleId;
        }

        public void setJobRoleId(Long jobRoleId) {
            this.jobRoleId = jobRoleId;
        }

        public Long getSkillId() {
            return skillId;
        }

        public void setSkillId(Long skillId) {
            this.skillId = skillId;
        }

        public Integer getYear() {
            return year;
        }

        public void setYear(Integer year) {
            this.year = year;
        }

        public Integer getDemand() {
            return demand;
        }

        public void setDemand(Integer demand) {
            this.demand = demand;
        }

        public Integer getTrainingCapacity() {
            return trainingCapacity;
        }

        public void setTrainingCapacity(Integer trainingCapacity) {
            this.trainingCapacity = trainingCapacity;
        }

        public Integer getGap() {
            return gap;
        }

        public void setGap(Integer gap) {
            this.gap = gap;
        }

        public Double getPriorityScore() {
            return priorityScore;
        }

        public void setPriorityScore(Double priorityScore) {
            this.priorityScore = priorityScore;
        }
    }
}
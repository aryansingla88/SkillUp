CREATE TABLE skill_gap_analysis (
    id BIGSERIAL PRIMARY KEY,
    district_id BIGINT NOT NULL,
    job_role_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    year INT NOT NULL,
    demand INT NOT NULL,
    training_capacity INT NOT NULL,
    gap INT NOT NULL,
    priority_score DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_skill_gap_district FOREIGN KEY (district_id) REFERENCES districts(id),
    CONSTRAINT fk_skill_gap_job_role FOREIGN KEY (job_role_id) REFERENCES job_roles(id),
    CONSTRAINT fk_skill_gap_skill FOREIGN KEY (skill_id) REFERENCES skills(id)
);

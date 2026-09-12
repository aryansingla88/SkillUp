CREATE TABLE candidate_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    district_id BIGINT NOT NULL,
    education VARCHAR(255),
    career_goal_job_role_id BIGINT,
    CONSTRAINT fk_candidate_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_candidate_district FOREIGN KEY (district_id) REFERENCES districts(id),
    CONSTRAINT fk_candidate_goal FOREIGN KEY (career_goal_job_role_id) REFERENCES job_roles(id)
);

CREATE TABLE candidate_skills (
    candidate_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    proficiency VARCHAR(50) NOT NULL,
    PRIMARY KEY (candidate_id, skill_id),
    CONSTRAINT fk_candidate_skills_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id),
    CONSTRAINT fk_candidate_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE candidate_learning (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    learning_resource_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    progress INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_candidate_learning_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id),
    CONSTRAINT fk_candidate_learning_resource FOREIGN KEY (learning_resource_id) REFERENCES learning_resources(id),
    CONSTRAINT chk_candidate_learning_progress CHECK (progress >= 0 AND progress <= 100)
);

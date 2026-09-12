CREATE TABLE recommendations (
    id BIGSERIAL PRIMARY KEY,
    skill_gap_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    CONSTRAINT fk_recommendation_skill_gap FOREIGN KEY (skill_gap_id) REFERENCES skill_gap_analysis(id)
);

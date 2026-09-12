CREATE TABLE learning_resources (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255),
    url TEXT,
    type VARCHAR(50) NOT NULL,
    sector_id BIGINT,
    job_role_id BIGINT,
    CONSTRAINT fk_lr_sector FOREIGN KEY (sector_id) REFERENCES sectors(id),
    CONSTRAINT fk_lr_job_role FOREIGN KEY (job_role_id) REFERENCES job_roles(id)
);

CREATE TABLE resource_skill_mapping (
    learning_resource_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    subskill_id BIGINT NOT NULL,
    PRIMARY KEY (learning_resource_id, skill_id, subskill_id),
    CONSTRAINT fk_rsm_resource FOREIGN KEY (learning_resource_id) REFERENCES learning_resources(id),
    CONSTRAINT fk_rsm_skill FOREIGN KEY (skill_id) REFERENCES skills(id),
    CONSTRAINT fk_rsm_subskill FOREIGN KEY (subskill_id) REFERENCES subskills(id)
);

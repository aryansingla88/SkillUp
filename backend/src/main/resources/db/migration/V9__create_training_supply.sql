CREATE TABLE training_supply (
    id BIGSERIAL PRIMARY KEY,
    training_centre_id BIGINT NOT NULL,
    job_role_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    year INT NOT NULL,
    capacity INT NOT NULL,
    CONSTRAINT fk_training_supply_centre FOREIGN KEY (training_centre_id) REFERENCES training_centres(id),
    CONSTRAINT fk_training_supply_job_role FOREIGN KEY (job_role_id) REFERENCES job_roles(id),
    CONSTRAINT fk_training_supply_skill FOREIGN KEY (skill_id) REFERENCES skills(id),
    CONSTRAINT chk_training_supply_capacity CHECK (capacity >= 0)
);

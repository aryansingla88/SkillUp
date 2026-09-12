CREATE TABLE market_demand (
    id BIGSERIAL PRIMARY KEY,
    district_id BIGINT NOT NULL,
    job_role_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    year INT NOT NULL,
    demand_count INT NOT NULL,
    source_type VARCHAR(50) NOT NULL DEFAULT 'PROTOTYPE_SYNTHETIC',
    CONSTRAINT fk_market_demand_district FOREIGN KEY (district_id) REFERENCES districts(id),
    CONSTRAINT fk_market_demand_job_role FOREIGN KEY (job_role_id) REFERENCES job_roles(id),
    CONSTRAINT fk_market_demand_skill FOREIGN KEY (skill_id) REFERENCES skills(id),
    CONSTRAINT chk_market_demand_count CHECK (demand_count >= 0)
);

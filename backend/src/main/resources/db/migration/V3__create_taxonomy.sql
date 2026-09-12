CREATE TABLE sectors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE job_roles (
    id BIGSERIAL PRIMARY KEY,
    sector_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    CONSTRAINT fk_job_roles_sector FOREIGN KEY (sector_id) REFERENCES sectors(id)
);

CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    sector_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    CONSTRAINT fk_skills_sector FOREIGN KEY (sector_id) REFERENCES sectors(id)
);

CREATE TABLE subskills (
    id BIGSERIAL PRIMARY KEY,
    skill_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    CONSTRAINT fk_subskills_skill FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE job_role_requirements (
    job_role_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    required_level VARCHAR(50) NOT NULL,
    PRIMARY KEY (job_role_id, skill_id),
    CONSTRAINT fk_jrr_job_role FOREIGN KEY (job_role_id) REFERENCES job_roles(id),
    CONSTRAINT fk_jrr_skill FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE training_curricula (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL
);

CREATE TABLE curriculum_skill_mapping (
    curriculum_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    subskill_id BIGINT NOT NULL,
    module_name VARCHAR(255),
    PRIMARY KEY (curriculum_id, skill_id, subskill_id),
    CONSTRAINT fk_csm_curriculum FOREIGN KEY (curriculum_id) REFERENCES training_curricula(id),
    CONSTRAINT fk_csm_skill FOREIGN KEY (skill_id) REFERENCES skills(id),
    CONSTRAINT fk_csm_subskill FOREIGN KEY (subskill_id) REFERENCES subskills(id)
);

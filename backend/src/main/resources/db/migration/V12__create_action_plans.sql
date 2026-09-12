CREATE TABLE action_plans (
    id BIGSERIAL PRIMARY KEY,
    recommendation_id BIGINT NOT NULL,
    district_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    objective TEXT,
    expected_implementation TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    approved_at TIMESTAMP,
    CONSTRAINT fk_action_plan_recommendation FOREIGN KEY (recommendation_id) REFERENCES recommendations(id),
    CONSTRAINT fk_action_plan_district FOREIGN KEY (district_id) REFERENCES districts(id),
    CONSTRAINT fk_action_plan_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE action_items (
    id BIGSERIAL PRIMARY KEY,
    action_plan_id BIGINT NOT NULL,
    training_centre_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    description TEXT,
    target_quantity INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_action_item_plan FOREIGN KEY (action_plan_id) REFERENCES action_plans(id),
    CONSTRAINT fk_action_item_centre FOREIGN KEY (training_centre_id) REFERENCES training_centres(id),
    CONSTRAINT chk_action_item_quantity CHECK (target_quantity >= 0)
);

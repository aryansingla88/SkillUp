CREATE TABLE implementation_progress (
    id BIGSERIAL PRIMARY KEY,
    action_item_id BIGINT NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    current_value INT NOT NULL DEFAULT 0,
    target_value INT NOT NULL,
    remarks TEXT,
    updated_by BIGINT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_implementation_action_item FOREIGN KEY (action_item_id) REFERENCES action_items(id),
    CONSTRAINT fk_implementation_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
    CONSTRAINT chk_implementation_current CHECK (current_value >= 0),
    CONSTRAINT chk_implementation_target CHECK (target_value >= 0)
);

CREATE TABLE requests (
    id BIGSERIAL PRIMARY KEY,
    action_item_id BIGINT NOT NULL,
    raised_by BIGINT NOT NULL,
    assigned_to BIGINT,
    request_type VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'RAISED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_request_action_item FOREIGN KEY (action_item_id) REFERENCES action_items(id),
    CONSTRAINT fk_request_raised_by FOREIGN KEY (raised_by) REFERENCES users(id),
    CONSTRAINT fk_request_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id)
);

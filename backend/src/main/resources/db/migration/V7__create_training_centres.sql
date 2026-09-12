CREATE TABLE training_centres (
    id BIGSERIAL PRIMARY KEY,
    district_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    ownership_type VARCHAR(50) NOT NULL,
    CONSTRAINT fk_training_centre_district FOREIGN KEY (district_id) REFERENCES districts(id)
);

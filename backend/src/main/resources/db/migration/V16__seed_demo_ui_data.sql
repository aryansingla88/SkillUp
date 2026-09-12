-- V16: complete demo/UI dataset for local prototype testing
-- Creates demo users, candidate profiles/skills/learning and operational workflow data.

INSERT INTO users (id,email,password_hash,role) VALUES
                                                    (1, 'candidate@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (2, 'state@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STATE_ADMIN'),
                                                    (3, 'district@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'DISTRICT_ADMIN'),
                                                    (4, 'centre@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TRAINING_CENTRE')
    ON CONFLICT (id) DO UPDATE SET email=EXCLUDED.email, password_hash=EXCLUDED.password_hash, role=EXCLUDED.role;

INSERT INTO users (id,email,password_hash,role) VALUES
                                                    (101, 'candidate101@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (102, 'candidate102@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (103, 'candidate103@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (104, 'candidate104@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (105, 'candidate105@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (106, 'candidate106@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (107, 'candidate107@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (108, 'candidate108@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (109, 'candidate109@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (110, 'candidate110@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (111, 'candidate111@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (112, 'candidate112@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (113, 'candidate113@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (114, 'candidate114@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (115, 'candidate115@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (116, 'candidate116@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (117, 'candidate117@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (118, 'candidate118@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (119, 'candidate119@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (120, 'candidate120@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (121, 'candidate121@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (122, 'candidate122@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (123, 'candidate123@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE'),
                                                    (124, 'candidate124@skillup.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CANDIDATE')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO candidate_profiles (id,user_id,district_id,education,career_goal_job_role_id) VALUES
                                                                                              (1, 1, 1, 'B.Tech', 2),
                                                                                              (2, 101, 1, 'B.Tech', 12),
                                                                                              (3, 102, 2, 'B.Tech', 1),
                                                                                              (4, 103, 3, 'B.Sc', 3),
                                                                                              (5, 104, 4, 'B.Sc', 4),
                                                                                              (6, 105, 5, 'B.Com', 8),
                                                                                              (7, 106, 6, 'B.Tech', 12),
                                                                                              (8, 107, 7, 'B.Voc', 18),
                                                                                              (9, 108, 8, 'ITI Diploma', 17),
                                                                                              (10, 109, 9, 'ITI Diploma', 4),
                                                                                              (11, 110, 10, 'B.Com', 12),
                                                                                              (12, 111, 1, '12th Pass', 16),
                                                                                              (13, 112, 2, 'B.Tech', 17),
                                                                                              (14, 113, 3, 'B.Voc', 7),
                                                                                              (15, 114, 4, 'B.Tech', 9),
                                                                                              (16, 115, 5, 'B.Tech', 15),
                                                                                              (17, 116, 6, '12th Pass', 6),
                                                                                              (18, 117, 7, 'Polytechnic Diploma', 3),
                                                                                              (19, 118, 8, 'B.Sc', 7),
                                                                                              (20, 119, 9, 'B.Tech', 9),
                                                                                              (21, 120, 10, 'ITI Diploma', 7),
                                                                                              (22, 121, 1, 'Polytechnic Diploma', 15),
                                                                                              (23, 122, 2, 'B.Sc', 15),
                                                                                              (24, 123, 3, 'B.Tech', 15),
                                                                                              (25, 124, 4, '12th Pass', 4)
    ON CONFLICT (id) DO UPDATE SET user_id=EXCLUDED.user_id, district_id=EXCLUDED.district_id, education=EXCLUDED.education, career_goal_job_role_id=EXCLUDED.career_goal_job_role_id;

INSERT INTO candidate_skills (candidate_id,skill_id,proficiency) VALUES
                                                                     (1, 1, 'INTERMEDIATE'),
                                                                     (1, 2, 'BEGINNER'),
                                                                     (1, 4, 'BEGINNER'),
                                                                     (2, 21, 'INTERMEDIATE'),
                                                                     (2, 4, 'BEGINNER'),
                                                                     (3, 2, 'INTERMEDIATE'),
                                                                     (3, 9, 'BEGINNER'),
                                                                     (4, 2, 'INTERMEDIATE'),
                                                                     (4, 8, 'BEGINNER'),
                                                                     (5, 9, 'INTERMEDIATE'),
                                                                     (5, 8, 'EXPERT'),
                                                                     (5, 14, 'INTERMEDIATE'),
                                                                     (6, 15, 'INTERMEDIATE'),
                                                                     (6, 10, 'ADVANCED'),
                                                                     (7, 21, 'ADVANCED'),
                                                                     (7, 3, 'INTERMEDIATE'),
                                                                     (8, 25, 'INTERMEDIATE'),
                                                                     (8, 9, 'INTERMEDIATE'),
                                                                     (9, 25, 'BEGINNER'),
                                                                     (9, 27, 'BEGINNER'),
                                                                     (9, 10, 'INTERMEDIATE'),
                                                                     (10, 7, 'BEGINNER'),
                                                                     (10, 9, 'BEGINNER'),
                                                                     (10, 8, 'BEGINNER'),
                                                                     (10, 22, 'INTERMEDIATE'),
                                                                     (11, 21, 'ADVANCED'),
                                                                     (11, 19, 'INTERMEDIATE'),
                                                                     (11, 20, 'INTERMEDIATE'),
                                                                     (11, 25, 'BEGINNER'),
                                                                     (12, 25, 'BEGINNER'),
                                                                     (12, 27, 'BEGINNER'),
                                                                     (12, 26, 'INTERMEDIATE'),
                                                                     (12, 19, 'BEGINNER'),
                                                                     (13, 25, 'ADVANCED'),
                                                                     (13, 4, 'ADVANCED'),
                                                                     (14, 12, 'ADVANCED'),
                                                                     (14, 11, 'EXPERT'),
                                                                     (14, 10, 'ADVANCED'),
                                                                     (14, 23, 'ADVANCED'),
                                                                     (15, 13, 'BEGINNER'),
                                                                     (15, 15, 'BEGINNER'),
                                                                     (15, 4, 'BEGINNER'),
                                                                     (16, 22, 'BEGINNER'),
                                                                     (16, 24, 'ADVANCED'),
                                                                     (16, 23, 'ADVANCED'),
                                                                     (16, 1, 'BEGINNER'),
                                                                     (17, 12, 'ADVANCED'),
                                                                     (17, 10, 'BEGINNER'),
                                                                     (17, 11, 'BEGINNER'),
                                                                     (17, 7, 'BEGINNER'),
                                                                     (18, 5, 'BEGINNER'),
                                                                     (18, 6, 'BEGINNER'),
                                                                     (18, 4, 'INTERMEDIATE'),
                                                                     (18, 23, 'ADVANCED'),
                                                                     (19, 10, 'ADVANCED'),
                                                                     (19, 11, 'BEGINNER'),
                                                                     (19, 12, 'BEGINNER'),
                                                                     (19, 4, 'BEGINNER'),
                                                                     (20, 14, 'ADVANCED'),
                                                                     (20, 13, 'BEGINNER'),
                                                                     (20, 15, 'INTERMEDIATE'),
                                                                     (20, 21, 'INTERMEDIATE'),
                                                                     (21, 11, 'ADVANCED'),
                                                                     (21, 8, 'BEGINNER'),
                                                                     (22, 23, 'BEGINNER'),
                                                                     (22, 11, 'INTERMEDIATE'),
                                                                     (23, 22, 'BEGINNER'),
                                                                     (23, 24, 'BEGINNER'),
                                                                     (23, 23, 'ADVANCED'),
                                                                     (23, 4, 'BEGINNER'),
                                                                     (24, 24, 'BEGINNER'),
                                                                     (24, 23, 'ADVANCED'),
                                                                     (24, 22, 'BEGINNER'),
                                                                     (24, 3, 'ADVANCED'),
                                                                     (25, 8, 'BEGINNER'),
                                                                     (25, 1, 'INTERMEDIATE')
    ON CONFLICT (candidate_id,skill_id) DO UPDATE SET proficiency=EXCLUDED.proficiency;

INSERT INTO candidate_learning (id,candidate_id,learning_resource_id,status,progress) VALUES
                                                                                          (1, 1, 1, 'COMPLETED', 100),
                                                                                          (2, 1, 2, 'IN_PROGRESS', 60),
                                                                                          (3, 1, 3, 'COMPLETED', 100),
                                                                                          (4, 4, 2, 'IN_PROGRESS', 33),
                                                                                          (5, 4, 1, 'PLANNED', 0),
                                                                                          (6, 4, 3, 'COMPLETED', 100),
                                                                                          (7, 6, 9, 'COMPLETED', 100),
                                                                                          (8, 6, 8, 'PLANNED', 0),
                                                                                          (9, 7, 10, 'COMPLETED', 100),
                                                                                          (10, 9, 11, 'IN_PROGRESS', 45),
                                                                                          (11, 9, 15, 'COMPLETED', 100),
                                                                                          (12, 9, 12, 'COMPLETED', 100),
                                                                                          (13, 11, 10, 'PLANNED', 0),
                                                                                          (14, 12, 15, 'IN_PROGRESS', 42),
                                                                                          (15, 13, 15, 'PLANNED', 0),
                                                                                          (16, 13, 11, 'IN_PROGRESS', 79),
                                                                                          (17, 13, 12, 'COMPLETED', 100),
                                                                                          (18, 14, 6, 'PLANNED', 0),
                                                                                          (19, 15, 8, 'COMPLETED', 100),
                                                                                          (20, 15, 9, 'COMPLETED', 100),
                                                                                          (21, 16, 14, 'PLANNED', 0),
                                                                                          (22, 18, 5, 'PLANNED', 0),
                                                                                          (23, 20, 9, 'IN_PROGRESS', 40),
                                                                                          (24, 21, 6, 'COMPLETED', 100),
                                                                                          (25, 22, 14, 'IN_PROGRESS', 12),
                                                                                          (26, 24, 14, 'COMPLETED', 100)
    ON CONFLICT (id) DO UPDATE SET candidate_id=EXCLUDED.candidate_id, learning_resource_id=EXCLUDED.learning_resource_id, status=EXCLUDED.status, progress=EXCLUDED.progress;

INSERT INTO skill_gap_analysis (district_id,job_role_id,skill_id,year,demand,training_capacity,gap,priority_score)
SELECT md.district_id, md.job_role_id, md.skill_id, md.year, md.demand_count,
       COALESCE(SUM(ts.capacity),0) AS training_capacity,
       GREATEST(md.demand_count - COALESCE(SUM(ts.capacity),0),0) AS gap,
       ROUND((0.5 * LEAST(md.demand_count / 1000.0 * 100.0,100.0) +
              0.5 * LEAST(GREATEST(md.demand_count - COALESCE(SUM(ts.capacity),0),0)::numeric / NULLIF(md.demand_count,0) * 100.0,100.0))::numeric,2)
FROM market_demand md
         LEFT JOIN training_supply ts ON ts.training_centre_id IN (SELECT tc.id FROM training_centres tc WHERE tc.district_id=md.district_id)
    AND ts.job_role_id=md.job_role_id AND ts.skill_id=md.skill_id AND ts.year=md.year
WHERE md.year=2026
GROUP BY md.id, md.district_id, md.job_role_id, md.skill_id, md.year, md.demand_count
HAVING md.demand_count - COALESCE(SUM(ts.capacity),0) > 0;

INSERT INTO recommendations (skill_gap_id,type,title,description,status)
SELECT s.id,
       CASE WHEN MOD(s.id,3)=0 THEN 'CURRICULUM' WHEN MOD(s.id,3)=1 THEN 'TRAINING' ELSE 'STRATEGIC' END,
       CASE WHEN MOD(s.id,3)=0 THEN 'Align curriculum with priority skill gap' WHEN MOD(s.id,3)=1 THEN 'Expand training for ' || sk.name ELSE 'Coordinate district response for ' || sk.name END,
       'Synthetic demo recommendation generated from 2026 labour demand and training capacity data.',
       CASE WHEN MOD(s.id,5)=0 THEN 'APPROVED' WHEN MOD(s.id,7)=0 THEN 'REJECTED' ELSE 'DRAFT' END
FROM skill_gap_analysis s JOIN skills sk ON sk.id=s.skill_id;

INSERT INTO action_plans (recommendation_id,district_id,created_by,title,objective,expected_implementation,status,approved_at)
SELECT r.id, s.district_id, 3,
       'Priority delivery plan - ' || sk.name,
       'Close the identified skill gap through targeted training delivery.',
       'Coordinate centre capacity, trainers and equipment; review progress weekly.',
       CASE WHEN MOD(r.id,3)=0 THEN 'IN_PROGRESS' WHEN MOD(r.id,4)=0 THEN 'COMPLETED' ELSE 'APPROVED' END,
       CASE WHEN MOD(r.id,3)=0 OR MOD(r.id,4)=0 THEN CURRENT_TIMESTAMP ELSE CURRENT_TIMESTAMP END
FROM recommendations r JOIN skill_gap_analysis s ON s.id=r.skill_gap_id JOIN skills sk ON sk.id=s.skill_id
WHERE r.status='APPROVED' ORDER BY r.id LIMIT 12;

INSERT INTO action_items (action_plan_id,training_centre_id,action_type,description,target_quantity,status)
SELECT ap.id, (SELECT MIN(tc.id) FROM training_centres tc WHERE tc.district_id=ap.district_id),
       CASE WHEN MOD(ap.id,4)=0 THEN 'INFRASTRUCTURE' WHEN MOD(ap.id,3)=0 THEN 'EQUIPMENT' WHEN MOD(ap.id,2)=0 THEN 'TRAINER' ELSE 'BATCH' END,
       'Deliver the planned intervention and report progress against target.',
       20 + MOD(ap.id,16),
       CASE WHEN ap.status='COMPLETED' THEN 'COMPLETED' WHEN ap.status='IN_PROGRESS' THEN 'IN_PROGRESS' ELSE 'PENDING' END
FROM action_plans ap;

INSERT INTO implementation_progress (action_item_id,metric_type,current_value,target_value,remarks,updated_by)
SELECT ai.id, ai.action_type, CASE WHEN ai.status='COMPLETED' THEN ai.target_quantity WHEN ai.status='IN_PROGRESS' THEN GREATEST(1, ai.target_quantity/2) ELSE 0 END, ai.target_quantity,
       CASE WHEN ai.status='COMPLETED' THEN 'Target achieved.' WHEN ai.status='IN_PROGRESS' THEN 'Execution underway.' ELSE 'Awaiting execution.' END, 4
FROM action_items ai;

INSERT INTO requests (action_item_id,raised_by,assigned_to,request_type,description,status)
SELECT ai.id, 4, 3, CASE WHEN MOD(ai.id,3)=0 THEN 'EQUIPMENT' WHEN MOD(ai.id,2)=0 THEN 'TRAINER' ELSE 'INFRASTRUCTURE' END,
       'Demo coordination request for action item #' || ai.id || '.',
       CASE WHEN MOD(ai.id,4)=0 THEN 'FULFILLED' WHEN MOD(ai.id,3)=0 THEN 'UNDER_REVIEW' ELSE 'RAISED' END
FROM action_items ai WHERE ai.id <= 8;

SELECT setval(pg_get_serial_sequence('users','id'), COALESCE((SELECT MAX(id) FROM users),1), true);
SELECT setval(pg_get_serial_sequence('candidate_profiles','id'), COALESCE((SELECT MAX(id) FROM candidate_profiles),1), true);
SELECT setval(pg_get_serial_sequence('candidate_learning','id'), COALESCE((SELECT MAX(id) FROM candidate_learning),1), true);
SELECT setval(pg_get_serial_sequence('skill_gap_analysis','id'), COALESCE((SELECT MAX(id) FROM skill_gap_analysis),1), true);
SELECT setval(pg_get_serial_sequence('recommendations','id'), COALESCE((SELECT MAX(id) FROM recommendations),1), true);
SELECT setval(pg_get_serial_sequence('action_plans','id'), COALESCE((SELECT MAX(id) FROM action_plans),1), true);
SELECT setval(pg_get_serial_sequence('action_items','id'), COALESCE((SELECT MAX(id) FROM action_items),1), true);
SELECT setval(pg_get_serial_sequence('implementation_progress','id'), COALESCE((SELECT MAX(id) FROM implementation_progress),1), true);
SELECT setval(pg_get_serial_sequence('requests','id'), COALESCE((SELECT MAX(id) FROM requests),1), true);

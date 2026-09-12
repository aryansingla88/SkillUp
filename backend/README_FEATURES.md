# SkillUp - Recommendation, Execution and Coordination

Implemented against the existing Flyway schema (V10-V14). Hibernate schema management is `validate`; no new DB migrations are required.

## Endpoints

### Recommendations
- GET `/recommendations`
- GET `/recommendations/{id}`
- POST `/recommendations/{id}/approve`
- POST `/recommendations/{id}/reject`

### Execution / Action Plans
- GET `/action-plans`
- POST `/action-plans`
- GET `/action-plans/{id}`
- PUT `/action-plans/{id}`
- POST `/action-plans/{id}/approve`
- GET `/action-items/{id}`
- GET `/action-items/{id}/progress`
- POST `/action-items/{id}/progress`

### Coordination
- GET `/requests`
- POST `/requests`
- PUT `/requests/{id}`

Pagination is 1-based at the API boundary and converted to Spring's 0-based `PageRequest`.

CurrentUserService intentionally returns user id `1` as requested for the permit-all development setup. Replace it with JWT principal extraction when authentication is enabled.

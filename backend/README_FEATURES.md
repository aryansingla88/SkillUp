# SkillUp - Recommendation, Execution and Coordination

Implemented against the existing Flyway schema (V10-V14). Hibernate schema management is `validate`; no new DB migrations are required.

## Endpoints

### Recommendations
- GET `/api/recommendations`
- GET `/api/recommendations/{id}`
- POST `/api/recommendations/{id}/approve`
- POST `/api/recommendations/{id}/reject`

### Execution / Action Plans
- GET `/api/action-plans`
- POST `/api/action-plans`
- GET `/api/action-plans/{id}`
- PUT `/api/action-plans/{id}`
- POST `/api/action-plans/{id}/approve`
- GET `/api/action-items/{id}`
- GET `/api/action-items/{id}/progress`
- POST `/api/action-items/{id}/progress`

### Coordination
- GET `/api/requests`
- POST `/api/requests`
- PUT `/api/requests/{id}`

Pagination is 1-based at the API boundary and converted to Spring's 0-based `PageRequest`.

CurrentUserService intentionally returns user id `1` as requested for the permit-all development setup. Replace it with JWT principal extraction when authentication is enabled.

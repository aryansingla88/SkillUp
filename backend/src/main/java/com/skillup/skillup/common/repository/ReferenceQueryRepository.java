package com.skillup.skillup.common.repository;
import com.skillup.skillup.common.dto.response.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public class ReferenceQueryRepository {
 private final JdbcTemplate jdbc;
 public ReferenceQueryRepository(JdbcTemplate jdbc){this.jdbc=jdbc;}
 public Optional<DistrictResponse> district(Long id){return one("SELECT id,state,name FROM districts WHERE id=?",id,(rs)->new DistrictResponse(rs.getLong("id"),rs.getString("state"),rs.getString("name")));}
 public Optional<JobRoleResponse> jobRole(Long id){return one("SELECT id,sector_id,name FROM job_roles WHERE id=?",id,(rs)->new JobRoleResponse(rs.getLong("id"),rs.getLong("sector_id"),rs.getString("name")));}
 public Optional<SkillResponse> skill(Long id){return one("SELECT id,sector_id,name FROM skills WHERE id=?",id,(rs)->new SkillResponse(rs.getLong("id"),rs.getLong("sector_id"),rs.getString("name")));}
 public Optional<TrainingCentreResponse> trainingCentre(Long id){
  return jdbc.query("SELECT tc.id,tc.name,tc.ownership_type,d.id AS district_id,d.state,d.name AS district_name FROM training_centres tc JOIN districts d ON d.id=tc.district_id WHERE tc.id=?",
    rs->{if(!rs.next())return Optional.empty(); DistrictResponse d=new DistrictResponse(rs.getLong("district_id"),rs.getString("state"),rs.getString("district_name"));return Optional.of(new TrainingCentreResponse(rs.getLong("id"),d,rs.getString("name"),rs.getString("ownership_type")));},id);
 }
 private <T> Optional<T> one(String sql,Long id,RowMapper<T> mapper){return jdbc.query(sql,rs->{if(!rs.next())return Optional.empty();return Optional.of(mapper.map(rs));},id);}
 @FunctionalInterface private interface RowMapper<T>{T map(java.sql.ResultSet rs)throws java.sql.SQLException;}
}

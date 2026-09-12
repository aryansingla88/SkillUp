package com.skillup.skillup.features.execution.repository;
import com.skillup.skillup.features.execution.entity.ActionPlan;
import org.springframework.data.domain.*; import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
public interface ActionPlanRepository extends JpaRepository<ActionPlan,Long>{
 @Query(value="SELECT * FROM action_plans WHERE (:districtId IS NULL OR district_id=:districtId) AND (:status IS NULL OR status=:status)",
        countQuery="SELECT COUNT(*) FROM action_plans WHERE (:districtId IS NULL OR district_id=:districtId) AND (:status IS NULL OR status=:status)",nativeQuery=true)
 Page<ActionPlan> findPlans(@Param("districtId") Long districtId,@Param("status") String status,Pageable pageable);
}

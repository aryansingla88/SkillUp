package com.skillup.skillup.features.coordination.repository;
import com.skillup.skillup.features.coordination.entity.CoordinationRequest; import org.springframework.data.domain.*; import org.springframework.data.jpa.repository.*; import org.springframework.data.repository.query.Param;
public interface CoordinationRequestRepository extends JpaRepository<CoordinationRequest,Long>{
 @Query(value="SELECT * FROM requests WHERE (:status IS NULL OR status=:status) AND (:actionItemId IS NULL OR action_item_id=:actionItemId)",
 countQuery="SELECT COUNT(*) FROM requests WHERE (:status IS NULL OR status=:status) AND (:actionItemId IS NULL OR action_item_id=:actionItemId)",nativeQuery=true)
 Page<CoordinationRequest> findRequests(@Param("status")String status,@Param("actionItemId")Long actionItemId,Pageable pageable);
}

package com.skillup.skillup.features.execution.repository;
import com.skillup.skillup.features.execution.entity.ActionItem; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface ActionItemRepository extends JpaRepository<ActionItem,Long>{List<ActionItem> findByActionPlanId(Long actionPlanId);}

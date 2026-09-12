package com.skillup.skillup.features.implementation.repository;
import com.skillup.skillup.features.implementation.entity.ImplementationProgress; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface ImplementationProgressRepository extends JpaRepository<ImplementationProgress,Long>{List<ImplementationProgress> findByActionItemIdOrderByUpdatedAtDesc(Long actionItemId);}

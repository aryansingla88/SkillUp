package com.skillup.skillup.features.recommendation.repository;

import com.skillup.skillup.features.recommendation.entity.Recommendation;
import com.skillup.skillup.features.recommendation.entity.RecommendationStatus;
import com.skillup.skillup.features.recommendation.entity.RecommendationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    @Query(
            value = """
            SELECT r.*
            FROM recommendations r
            JOIN skill_gap_analysis sga
                ON r.skill_gap_id = sga.id
            WHERE (:status IS NULL OR r.status = :status)
              AND (:type IS NULL OR r.type = :type)
              AND (:districtId IS NULL OR sga.district_id = :districtId)
            """,
            countQuery = """
            SELECT COUNT(*)
            FROM recommendations r
            JOIN skill_gap_analysis sga
                ON r.skill_gap_id = sga.id
            WHERE (:status IS NULL OR r.status = :status)
              AND (:type IS NULL OR r.type = :type)
              AND (:districtId IS NULL OR sga.district_id = :districtId)
            """,
            nativeQuery = true
    )
    Page<Recommendation> findRecommendations(
            @Param("status") String status,
            @Param("type") String type,
            @Param("districtId") Long districtId,
            Pageable pageable
    );
}
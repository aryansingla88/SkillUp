package com.skillup.skillup.features.government.repository;

import com.skillup.skillup.features.government.entity.TrainingSupply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrainingSupplyRepository
        extends JpaRepository<TrainingSupply, Long> {

    List<TrainingSupply> findByTrainingCentreId(
            Long trainingCentreId
    );

    List<TrainingSupply>
    findByJobRoleIdAndSkillIdAndYear(
            Long jobRoleId,
            Long skillId,
            Integer year
    );

    @Query("""
        SELECT COALESCE(SUM(ts.capacity), 0)
        FROM TrainingSupply ts
        JOIN TrainingCentre tc
          ON ts.trainingCentreId = tc.id
        WHERE tc.districtId = :districtId
          AND ts.year = :year
    """)
    Integer getDistrictCapacity(
            @Param("districtId") Long districtId,
            @Param("year") Integer year
    );
}
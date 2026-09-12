package com.skillup.skillup.features.government.repository;

import com.skillup.skillup.features.government.entity.TrainingSupply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrainingSupplyRepository extends JpaRepository<TrainingSupply, Long> {
    List<TrainingSupply> findByTrainingCentre_Id(Long trainingCentreId);
    List<TrainingSupply> findByJobRole_IdAndSkill_IdAndYear(Long jobRoleId, Long skillId, Integer year);

    @Query("""
        SELECT COALESCE(SUM(ts.capacity), 0)
        FROM TrainingSupply ts
        WHERE ts.trainingCentre.district.id = :districtId
          AND ts.year = :year
    """)
    Integer getDistrictCapacity(@Param("districtId") Long districtId, @Param("year") Integer year);
}

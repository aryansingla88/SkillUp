package com.skillup.skillup.features.government.repository;

import com.skillup.skillup.features.government.entity.TrainingCentre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrainingCentreRepository extends JpaRepository<TrainingCentre, Long> {
    List<TrainingCentre> findByDistrict_Id(Long districtId);
}

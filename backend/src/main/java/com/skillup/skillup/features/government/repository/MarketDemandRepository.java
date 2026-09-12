package com.skillup.skillup.features.government.repository;

import com.skillup.skillup.features.government.entity.MarketDemand;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarketDemandRepository extends JpaRepository<MarketDemand, Long> {
    List<MarketDemand> findByDistrict_Id(Long districtId);
    List<MarketDemand> findByDistrict_IdAndYear(Long districtId, Integer year);
    List<MarketDemand> findByYear(Integer year);
    MarketDemand findTopByOrderByYearDesc();
}

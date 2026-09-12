package com.skillup.skillup.features.government.repository;

import com.skillup.skillup.features.government.entity.MarketDemand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarketDemandRepository
        extends JpaRepository<MarketDemand, Long> {

    List<MarketDemand> findByDistrictId(Long districtId);

    List<MarketDemand> findByDistrictIdAndYear(
            Long districtId,
            Integer year
    );

    List<MarketDemand> findByYear(Integer year);
}
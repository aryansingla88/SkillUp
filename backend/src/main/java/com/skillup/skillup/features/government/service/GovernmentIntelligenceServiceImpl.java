package com.skillup.skillup.features.government.service;

import com.skillup.skillup.common.exception.ResourceNotFoundException;
import com.skillup.skillup.features.government.dto.DistrictDashboardResponse;
import com.skillup.skillup.features.government.dto.PageSkillGapResponse;
import com.skillup.skillup.features.government.dto.SkillGapResponse;
import com.skillup.skillup.features.government.dto.StateDashboardResponse;
import com.skillup.skillup.features.government.entity.MarketDemand;
import com.skillup.skillup.features.government.entity.SkillGapAnalysis;
import com.skillup.skillup.features.government.entity.TrainingSupply;
import com.skillup.skillup.features.government.mapper.GovernmentIntelligenceMapper;
import com.skillup.skillup.features.government.repository.MarketDemandRepository;
import com.skillup.skillup.features.government.repository.SkillGapAnalysisRepository;
import com.skillup.skillup.features.government.repository.TrainingSupplyRepository;
import com.skillup.skillup.features.reference.entity.District;
import com.skillup.skillup.features.reference.repository.DistrictRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class GovernmentIntelligenceServiceImpl implements GovernmentIntelligenceService {

    private final MarketDemandRepository marketDemandRepository;
    private final TrainingSupplyRepository trainingSupplyRepository;
    private final SkillGapAnalysisRepository skillGapAnalysisRepository;
    private final DistrictRepository districtRepository;
    private final GovernmentIntelligenceMapper mapper;

    public GovernmentIntelligenceServiceImpl(
            MarketDemandRepository marketDemandRepository,
            TrainingSupplyRepository trainingSupplyRepository,
            SkillGapAnalysisRepository skillGapAnalysisRepository,
            DistrictRepository districtRepository,
            GovernmentIntelligenceMapper mapper) {
        this.marketDemandRepository = marketDemandRepository;
        this.trainingSupplyRepository = trainingSupplyRepository;
        this.skillGapAnalysisRepository = skillGapAnalysisRepository;
        this.districtRepository = districtRepository;
        this.mapper = mapper;
    }

    @Override
    public void calculateSkillGaps(Long districtId, Integer year) {

        District district = districtRepository.findById(districtId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "District not found with id: " + districtId));

        for (MarketDemand demand :
                marketDemandRepository.findByDistrict_IdAndYear(districtId, year)) {

            int capacity = trainingSupplyRepository
                    .findByJobRole_IdAndSkill_IdAndYear(
                            demand.getJobRole().getId(),
                            demand.getSkill().getId(),
                            year)
                    .stream()
                    .mapToInt(TrainingSupply::getCapacity)
                    .sum();

            int demandValue = demand.getDemand();
            int gap = Math.max(demandValue - capacity, 0);

            BigDecimal priority = calculatePriorityScore(demandValue, gap);

            SkillGapAnalysis entity =
                    skillGapAnalysisRepository
                            .findByDistrict_IdAndJobRole_IdAndSkill_IdAndYear(
                                    districtId,
                                    demand.getJobRole().getId(),
                                    demand.getSkill().getId(),
                                    year)
                            .orElseGet(SkillGapAnalysis::new);

            entity.setDistrict(district);
            entity.setJobRole(demand.getJobRole());
            entity.setSkill(demand.getSkill());
            entity.setYear(year);
            entity.setDemand(demandValue);
            entity.setTrainingCapacity(capacity);
            entity.setGap(gap);
            entity.setPriorityScore(priority);

            skillGapAnalysisRepository.save(entity);
        }
    }

    private BigDecimal calculatePriorityScore(int demand, int gap) {

        if (demand <= 0) {
            return BigDecimal.ZERO.setScale(2);
        }

        double demandScore =
                Math.min((demand / 1000.0) * 100.0, 100.0);

        double gapScore =
                Math.min(((double) gap / demand) * 100.0, 100.0);

        double score =
                Math.round(
                        (0.5 * demandScore + 0.5 * gapScore) * 100.0
                ) / 100.0;

        return BigDecimal.valueOf(score).setScale(2);
    }

    private Integer latestYear() {
        MarketDemand latest =
                marketDemandRepository.findTopByOrderByYearDesc();

        return latest == null ? null : latest.getYear();
    }

    private void refreshDistrictIfPossible(Long districtId) {
        Integer year = latestYear();

        if (year != null) {
            calculateSkillGaps(districtId, year);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PageSkillGapResponse getDistrictSkillGaps(
            Long districtId,
            int page,
            int limit) {

        if (!districtRepository.existsById(districtId)) {
            throw new ResourceNotFoundException(
                    "District not found with id: " + districtId);
        }

        Pageable pageable =
                PageRequest.of(
                        Math.max(page - 1, 0),
                        Math.min(limit, 100));

        Page<SkillGapAnalysis> result =
                skillGapAnalysisRepository.findByDistrict_Id(
                        districtId,
                        pageable);

        return new PageSkillGapResponse(
                result.getContent()
                        .stream()
                        .map(mapper::toSkillGapResponse)
                        .toList(),
                page,
                limit,
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public DistrictDashboardResponse getDistrictDashboard(
            Long districtId) {

        District district =
                districtRepository.findById(districtId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "District not found with id: " + districtId));

        List<SkillGapAnalysis> gaps =
                skillGapAnalysisRepository.findByDistrict_Id(districtId);

        Integer latest = latestYear();

        if (gaps.isEmpty() && latest != null) {
            gaps = calculateInMemory(districtId, latest);
        }

        int critical =
                (int) gaps.stream()
                        .filter(g ->
                                g.getPriorityScore() != null &&
                                        g.getPriorityScore()
                                                .compareTo(BigDecimal.valueOf(80)) >= 0)
                        .count();

        int priority =
                (int) gaps.stream()
                        .filter(g ->
                                g.getPriorityScore() != null &&
                                        g.getPriorityScore()
                                                .compareTo(BigDecimal.valueOf(60)) >= 0)
                        .count();

        int capacity =
                gaps.stream()
                        .mapToInt(SkillGapAnalysis::getTrainingCapacity)
                        .sum();

        return new DistrictDashboardResponse(
                district.getId(),
                district.getName(),
                critical,
                priority,
                capacity,
                0,
                0,
                0,
                0,
                0.0
        );
    }

    private List<SkillGapAnalysis> calculateInMemory(
            Long districtId,
            Integer year) {

        return marketDemandRepository
                .findByDistrict_IdAndYear(districtId, year)
                .stream()
                .map(d -> {

                    int capacity =
                            trainingSupplyRepository
                                    .findByJobRole_IdAndSkill_IdAndYear(
                                            d.getJobRole().getId(),
                                            d.getSkill().getId(),
                                            year)
                                    .stream()
                                    .mapToInt(TrainingSupply::getCapacity)
                                    .sum();

                    int gap =
                            Math.max(
                                    d.getDemand() - capacity,
                                    0);

                    return SkillGapAnalysis.builder()
                            .district(d.getDistrict())
                            .jobRole(d.getJobRole())
                            .skill(d.getSkill())
                            .year(year)
                            .demand(d.getDemand())
                            .trainingCapacity(capacity)
                            .gap(gap)
                            .priorityScore(
                                    calculatePriorityScore(
                                            d.getDemand(),
                                            gap))
                            .build();
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StateDashboardResponse getStateDashboard() {

        List<SkillGapAnalysis> allGaps =
                skillGapAnalysisRepository.findAll();

        Integer latest = latestYear();

        if (allGaps.isEmpty() && latest != null) {

            allGaps =
                    marketDemandRepository
                            .findByYear(latest)
                            .stream()
                            .map(d -> {

                                int capacity =
                                        trainingSupplyRepository
                                                .findByJobRole_IdAndSkill_IdAndYear(
                                                        d.getJobRole().getId(),
                                                        d.getSkill().getId(),
                                                        latest)
                                                .stream()
                                                .mapToInt(TrainingSupply::getCapacity)
                                                .sum();

                                int gap =
                                        Math.max(
                                                d.getDemand() - capacity,
                                                0);

                                return SkillGapAnalysis.builder()
                                        .district(d.getDistrict())
                                        .jobRole(d.getJobRole())
                                        .skill(d.getSkill())
                                        .year(latest)
                                        .demand(d.getDemand())
                                        .trainingCapacity(capacity)
                                        .gap(gap)
                                        .priorityScore(
                                                calculatePriorityScore(
                                                        d.getDemand(),
                                                        gap))
                                        .build();
                            })
                            .toList();
        }

        int critical =
                (int) allGaps.stream()
                        .filter(g ->
                                g.getPriorityScore() != null &&
                                        g.getPriorityScore()
                                                .compareTo(BigDecimal.valueOf(80)) >= 0)
                        .count();

        int emerging =
                (int) allGaps.stream()
                        .map(SkillGapAnalysis::getSkill)
                        .distinct()
                        .count();

        int atRisk =
                (int) allGaps.stream()
                        .filter(g ->
                                g.getPriorityScore() != null &&
                                        g.getPriorityScore()
                                                .compareTo(BigDecimal.valueOf(80)) >= 0)
                        .map(g -> g.getDistrict().getId())
                        .distinct()
                        .count();

        List<SkillGapResponse> top =
                allGaps.stream()
                        .sorted(
                                Comparator.comparing(
                                        SkillGapAnalysis::getPriorityScore,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder())))
                        .limit(10)
                        .map(mapper::toSkillGapResponse)
                        .toList();

        return new StateDashboardResponse(
                critical,
                emerging,
                atRisk,
                0,
                0,
                top
        );
    }
}
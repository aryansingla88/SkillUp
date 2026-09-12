package com.skillup.skillup.features.government.service;

import com.skillup.skillup.features.government.dto.*;
import com.skillup.skillup.features.government.entity.*;
import com.skillup.skillup.features.government.mapper.GovernmentIntelligenceMapper;
import com.skillup.skillup.features.government.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class GovernmentIntelligenceServiceImpl
        implements GovernmentIntelligenceService {

    private final MarketDemandRepository marketDemandRepository;
    private final TrainingCentreRepository trainingCentreRepository;
    private final TrainingSupplyRepository trainingSupplyRepository;
    private final SkillGapAnalysisRepository skillGapAnalysisRepository;
    private final GovernmentIntelligenceMapper mapper;

    public GovernmentIntelligenceServiceImpl(
            MarketDemandRepository marketDemandRepository,
            TrainingCentreRepository trainingCentreRepository,
            TrainingSupplyRepository trainingSupplyRepository,
            SkillGapAnalysisRepository skillGapAnalysisRepository,
            GovernmentIntelligenceMapper mapper
    ) {
        this.marketDemandRepository = marketDemandRepository;
        this.trainingCentreRepository = trainingCentreRepository;
        this.trainingSupplyRepository = trainingSupplyRepository;
        this.skillGapAnalysisRepository = skillGapAnalysisRepository;
        this.mapper = mapper;
    }

    @Override
    public void calculateSkillGaps(
            Long districtId,
            Integer year
    ) {

        List<MarketDemand> demands =
                marketDemandRepository
                        .findByDistrictIdAndYear(districtId, year);

        for (MarketDemand demand : demands) {

            List<TrainingSupply> supplies =
                    trainingSupplyRepository
                            .findByJobRoleIdAndSkillIdAndYear(
                                    demand.getJobRoleId(),
                                    demand.getSkillId(),
                                    year
                            );

            int capacity = supplies.stream()
                    .mapToInt(TrainingSupply::getCapacity)
                    .sum();

            int demandValue = demand.getDemand();

            int gap = Math.max(
                    demandValue - capacity,
                    0
            );

            double priorityScore =
                    calculatePriorityScore(
                            demand,
                            demandValue,
                            capacity,
                            gap
                    );

            Optional<SkillGapAnalysis> existing =
                    skillGapAnalysisRepository
                            .findAll()
                            .stream()
                            .filter(g ->
                                    Objects.equals(
                                            g.getDistrictId(),
                                            districtId
                                    )
                                            &&
                                            Objects.equals(
                                                    g.getJobRoleId(),
                                                    demand.getJobRoleId()
                                            )
                                            &&
                                            Objects.equals(
                                                    g.getSkillId(),
                                                    demand.getSkillId()
                                            )
                                            &&
                                            Objects.equals(
                                                    g.getYear(),
                                                    year
                                            )
                            )
                            .findFirst();

            SkillGapAnalysis gapAnalysis =
                    existing.orElseGet(
                            SkillGapAnalysis::new
                    );

            gapAnalysis.setDistrictId(districtId);
            gapAnalysis.setJobRoleId(demand.getJobRoleId());
            gapAnalysis.setSkillId(demand.getSkillId());
            gapAnalysis.setYear(year);
            gapAnalysis.setDemand(demandValue);
            gapAnalysis.setTrainingCapacity(capacity);
            gapAnalysis.setGap(gap);
            gapAnalysis.setPriorityScore(priorityScore);

            skillGapAnalysisRepository.save(gapAnalysis);
        }
    }

    private double calculatePriorityScore(
            MarketDemand demand,
            int demandValue,
            int capacity,
            int gap
    ) {

        double demandScore =
                normalizeDemand(demandValue);

        double gapScore =
                calculateGapPercentage(
                        demandValue,
                        gap
                );

        double growthScore =
                clamp(
                        demand.getGrowthRate() == null
                                ? 0
                                : demand.getGrowthRate()
                );

        double futureDemandScore =
                clamp(
                        demand.getFutureDemand() == null
                                ? 0
                                : demand.getFutureDemand()
                );

        double industryScore =
                clamp(
                        demand.getIndustryRelevance() == null
                                ? 0
                                : demand.getIndustryRelevance()
                );

        double regionalScore =
                clamp(
                        demand.getRegionalRelevance() == null
                                ? 0
                                : demand.getRegionalRelevance()
                );

        double score =
                (0.25 * demandScore)
                        + (0.25 * gapScore)
                        + (0.15 * growthScore)
                        + (0.15 * futureDemandScore)
                        + (0.10 * industryScore)
                        + (0.10 * regionalScore);

        return Math.round(score * 100.0) / 100.0;
    }

    private double normalizeDemand(int demand) {

        // Prototype normalization.
        // 1000 demand = 100 score.

        return clamp(
                (demand / 1000.0) * 100.0
        );
    }

    private double calculateGapPercentage(
            int demand,
            int gap
    ) {

        if (demand <= 0) {
            return 0;
        }

        return clamp(
                ((double) gap / demand) * 100.0
        );
    }

    private double clamp(double value) {

        return Math.max(
                0,
                Math.min(100, value)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PageSkillGapResponse getDistrictSkillGaps(
            Long districtId,
            int page,
            int limit
    ) {

        Pageable pageable =
                PageRequest.of(
                        Math.max(page - 1, 0),
                        Math.min(limit, 100)
                );

        Page<SkillGapAnalysis> result =
                skillGapAnalysisRepository
                        .findByDistrictId(
                                districtId,
                                pageable
                        );

        List<SkillGapResponse> content =
                result.getContent()
                        .stream()
                        .map(mapper::toSkillGapResponse)
                        .toList();

        return new PageSkillGapResponse(
                content,
                page,
                limit,
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public DistrictDashboardResponse getDistrictDashboard(
            Long districtId
    ) {

        List<SkillGapAnalysis> gaps =
                skillGapAnalysisRepository
                        .findByDistrictId(districtId);

        int criticalGaps =
                (int) gaps.stream()
                        .filter(g ->
                                g.getPriorityScore() >= 80
                        )
                        .count();

        int prioritySkills =
                (int) gaps.stream()
                        .filter(g ->
                                g.getPriorityScore() >= 60
                        )
                        .count();

        int trainingCapacity =
                gaps.stream()
                        .mapToInt(
                                SkillGapAnalysis::getTrainingCapacity
                        )
                        .sum();

        return new DistrictDashboardResponse(
                districtId,
                "District-" + districtId,
                criticalGaps,
                prioritySkills,
                trainingCapacity,

                // Backend 3 integration later
                0,
                0,
                0,
                0,

                // Implementation progress
                0.0
        );
    }

    @Override
    @Transactional(readOnly = true)
    public StateDashboardResponse getStateDashboard() {

        List<SkillGapAnalysis> allGaps =
                skillGapAnalysisRepository.findAll();

        int criticalSkillGaps =
                (int) allGaps.stream()
                        .filter(g ->
                                g.getPriorityScore() >= 80
                        )
                        .count();

        int highGrowth =
                (int) marketDemandRepository
                        .findAll()
                        .stream()
                        .filter(d ->
                                d.getGrowthRate() != null
                                        &&
                                        d.getGrowthRate() >= 20
                        )
                        .map(MarketDemand::getJobRoleId)
                        .distinct()
                        .count();

        List<SkillGapResponse> topPriorities =
                allGaps.stream()
                        .sorted(
                                Comparator.comparing(
                                        SkillGapAnalysis::getPriorityScore
                                ).reversed()
                        )
                        .limit(10)
                        .map(mapper::toSkillGapResponse)
                        .toList();

        long emergingSkills =
                marketDemandRepository
                        .findAll()
                        .stream()
                        .filter(d ->
                                d.getGrowthRate() != null
                                        &&
                                        d.getGrowthRate() >= 20
                        )
                        .map(MarketDemand::getSkillId)
                        .distinct()
                        .count();

        long districtsAtRisk =
                allGaps.stream()
                        .filter(g ->
                                g.getPriorityScore() >= 80
                        )
                        .map(SkillGapAnalysis::getDistrictId)
                        .distinct()
                        .count();

        return new StateDashboardResponse(
                criticalSkillGaps,
                (int) emergingSkills,
                (int) districtsAtRisk,

                // Curriculum module will provide this later
                0,

                highGrowth,
                topPriorities
        );
    }
}
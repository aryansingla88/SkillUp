package com.skillup.skillup.features.government.controller;

import com.skillup.skillup.features.government.dto.*;
import com.skillup.skillup.features.government.service.GovernmentIntelligenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping
public class GovernmentIntelligenceController {

    private final GovernmentIntelligenceService service;

    public GovernmentIntelligenceController(
            GovernmentIntelligenceService service
    ) {
        this.service = service;
    }

    @GetMapping("/state/dashboard")
    public ResponseEntity<StateDashboardResponse>
    getStateDashboard() {

        return ResponseEntity.ok(
                service.getStateDashboard()
        );
    }

    @GetMapping("/districts/{id}/dashboard")
    public ResponseEntity<DistrictDashboardResponse>
    getDistrictDashboard(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                service.getDistrictDashboard(id)
        );
    }

    @GetMapping("/districts/{id}/skill-gaps")
    public ResponseEntity<PageSkillGapResponse>
    getDistrictSkillGaps(
            @PathVariable Long id,

            @RequestParam(
                    defaultValue = "1"
            )
            int page,

            @RequestParam(
                    defaultValue = "20"
            )
            int limit
    ) {

        return ResponseEntity.ok(
                service.getDistrictSkillGaps(
                        id,
                        page,
                        limit
                )
        );
    }
}
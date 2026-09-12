package com.skillup.skillup.features.reference.controller;

import com.skillup.skillup.features.reference.dto.response.DistrictResponse;
import com.skillup.skillup.features.reference.dto.response.JobRoleResponse;
import com.skillup.skillup.features.reference.dto.response.SectorResponse;
import com.skillup.skillup.features.reference.dto.response.SkillResponse;
import com.skillup.skillup.features.reference.dto.response.SubskillResponse;
import com.skillup.skillup.features.reference.service.ReferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class ReferenceController {

    private final ReferenceService referenceService;

    @GetMapping("/districts")
    public List<DistrictResponse> getDistricts() {
        return referenceService.getDistricts();
    }

    @GetMapping("/sectors")
    public List<SectorResponse> getSectors() {
        return referenceService.getSectors();
    }

    @GetMapping("/job-roles")
    public List<JobRoleResponse> getJobRoles(
            @RequestParam(required = false) Long sectorId
    ) {
        return referenceService.getJobRoles(sectorId);
    }

    @GetMapping("/skills")
    public List<SkillResponse> getSkills(
            @RequestParam(required = false) Long sectorId
    ) {
        return referenceService.getSkills(sectorId);
    }

    @GetMapping("/skills/{id}/subskills")
    public List<SubskillResponse> getSubskills(
            @PathVariable Long id
    ) {
        return referenceService.getSubskills(id);
    }
}
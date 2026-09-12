package com.skillup.skillup.features.candidate.controller;

import com.skillup.skillup.features.candidate.dto.CandidateDashboardResponse;
import com.skillup.skillup.features.candidate.service.CandidateDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/candidate/dashboard")
@RequiredArgsConstructor
public class CandidateDashboardController {
    private final CandidateDashboardService service;

    @GetMapping
    public ResponseEntity<CandidateDashboardResponse> getDashboard() {
        return ResponseEntity.ok(service.getDashboard());
    }
}

package com.skillup.skillup.features.candidate.controller;

import com.skillup.skillup.features.candidate.dto.CandidateProfileRequest;
import com.skillup.skillup.features.candidate.dto.CandidateProfileResponse;
import com.skillup.skillup.features.candidate.service.CandidateProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/candidate/profile")
public class CandidateProfileController {
    private final CandidateProfileService candidateProfileService;

    public CandidateProfileController(CandidateProfileService candidateProfileService) {
        this.candidateProfileService = candidateProfileService;
    }

    @GetMapping
    public ResponseEntity<CandidateProfileResponse> getCandidateProfile() {
        return ResponseEntity.ok(candidateProfileService.getProfile());
    }

    @PutMapping
    public ResponseEntity<CandidateProfileResponse> updateCandidateProfile(
            @RequestBody CandidateProfileRequest request) {
        return ResponseEntity.ok(candidateProfileService.updateProfile(request));
    }
}

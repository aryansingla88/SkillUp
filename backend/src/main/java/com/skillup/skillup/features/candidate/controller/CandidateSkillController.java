package com.skillup.skillup.features.candidate.controller;

import com.skillup.skillup.features.candidate.dto.CandidateSkillRequest;
import com.skillup.skillup.features.candidate.dto.CandidateSkillResponse;
import com.skillup.skillup.features.candidate.service.CandidateSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/candidate/skills")
@RequiredArgsConstructor
public class CandidateSkillController {

    private final CandidateSkillService candidateSkillService;

    @GetMapping
    public ResponseEntity<List<CandidateSkillResponse>> getCandidateSkills() {
        return ResponseEntity.ok(candidateSkillService.getCandidateSkills());
    }

    @PostMapping
    public ResponseEntity<CandidateSkillResponse> addCandidateSkill(
            @Valid @RequestBody CandidateSkillRequest request) {
        return ResponseEntity.status(201).body(candidateSkillService.addCandidateSkill(request));
    }

    @PutMapping("/{skillId}")
    public ResponseEntity<CandidateSkillResponse> updateCandidateSkill(
            @PathVariable Long skillId,
            @Valid @RequestBody CandidateSkillRequest request) {
        return ResponseEntity.ok(candidateSkillService.updateCandidateSkill(skillId, request));
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<Void> deleteCandidateSkill(@PathVariable Long skillId) {
        candidateSkillService.deleteCandidateSkill(skillId);
        return ResponseEntity.noContent().build();
    }
}

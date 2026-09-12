package com.skillup.skillup.features.candidate.controller;

import com.skillup.skillup.features.candidate.dto.CandidateLearningRequest;
import com.skillup.skillup.features.candidate.dto.CandidateLearningResponse;
import com.skillup.skillup.features.candidate.service.CandidateLearningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/candidate/learning")
@RequiredArgsConstructor
public class CandidateLearningController {
    private final CandidateLearningService service;

    @GetMapping
    public ResponseEntity<List<CandidateLearningResponse>> getCandidateLearning() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<CandidateLearningResponse> addCandidateLearning(
            @Valid @RequestBody CandidateLearningRequest request) {
        return ResponseEntity.status(201).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateLearningResponse> updateCandidateLearning(
            @PathVariable Long id,
            @Valid @RequestBody CandidateLearningRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidateLearning(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

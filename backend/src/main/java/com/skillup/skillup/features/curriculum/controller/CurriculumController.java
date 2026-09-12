package com.skillup.skillup.features.curriculum.controller;

import com.skillup.skillup.features.curriculum.dto.*;
import com.skillup.skillup.features.curriculum.service.CurriculumService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/curricula")
@PreAuthorize("hasAnyRole('STATE_ADMIN','DISTRICT_ADMIN')")
public class CurriculumController {

    private final CurriculumService curriculumService;

    public CurriculumController(CurriculumService curriculumService) {
        this.curriculumService = curriculumService;
    }

    @GetMapping
    public ResponseEntity<List<CurriculumResponse>> getCurricula() {
        return ResponseEntity.ok(curriculumService.getCurricula());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CurriculumDetailResponse> getCurriculum(@PathVariable Long id) {
        return ResponseEntity.ok(curriculumService.getCurriculum(id));
    }

    @GetMapping("/{id}/gaps")
    public ResponseEntity<List<CurriculumGapResponse>> getCurriculumGaps(@PathVariable Long id) {
        return ResponseEntity.ok(curriculumService.getCurriculumGaps(id));
    }
}

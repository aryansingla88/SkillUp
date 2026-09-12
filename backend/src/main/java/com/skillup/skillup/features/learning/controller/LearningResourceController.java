package com.skillup.skillup.features.learning.controller;

import com.skillup.skillup.features.learning.dto.LearningResourceDetailResponse;
import com.skillup.skillup.features.learning.dto.LearningResourceRequest;
import com.skillup.skillup.features.learning.dto.LearningResourceResponse;
import com.skillup.skillup.features.learning.dto.PageLearningResourceResponse;
import com.skillup.skillup.features.learning.service.LearningResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/learning-resources")
@RequiredArgsConstructor
public class LearningResourceController {
    private final LearningResourceService service;

    @GetMapping
    public PageLearningResourceResponse getLearningResources(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) Long sectorId,
            @RequestParam(required = false) Long jobRoleId) {
        return service.getLearningResources(page, limit, sectorId, jobRoleId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearningResourceResponse createLearningResource(@RequestBody LearningResourceRequest request) {
        return service.createLearningResource(request);
    }

    @GetMapping("/{id}")
    public LearningResourceDetailResponse getLearningResource(@PathVariable Long id) {
        return service.getLearningResource(id);
    }
}

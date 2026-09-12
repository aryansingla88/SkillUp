package com.skillup.skillup.features.learning.service;

import com.skillup.skillup.common.exception.ResourceNotFoundException;
import com.skillup.skillup.features.learning.dto.LearningResourceDetailResponse;
import com.skillup.skillup.features.learning.dto.LearningResourceRequest;
import com.skillup.skillup.features.learning.dto.LearningResourceResponse;
import com.skillup.skillup.features.learning.dto.PageLearningResourceResponse;
import com.skillup.skillup.features.learning.entity.LearningResource;
import com.skillup.skillup.features.learning.mapper.LearningResourceMapper;
import com.skillup.skillup.features.learning.repository.LearningResourceRepository;
import com.skillup.skillup.features.learning.repository.ResourceSkillMappingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LearningResourceService {
    private final LearningResourceRepository repository;
    private final ResourceSkillMappingRepository mappingRepository;
    private final com.skillup.skillup.features.reference.repository.JobRoleRepository jobRoleRepository;
    private final com.skillup.skillup.features.reference.repository.SectorRepository sectorRepository;
    private final LearningResourceMapper mapper;

    public PageLearningResourceResponse getLearningResources(int page, int limit, Long sectorId, Long jobRoleId) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<LearningResource> result;
        if (sectorId != null && jobRoleId != null) {
            result = repository.findBySector_IdAndJobRole_Id(sectorId, jobRoleId, pageable);
        } else if (sectorId != null) {
            result = repository.findBySector_Id(sectorId, pageable);
        } else if (jobRoleId != null) {
            result = repository.findByJobRole_Id(jobRoleId, pageable);
        } else {
            result = repository.findAll(pageable);
        }
        return new PageLearningResourceResponse(
                result.getContent().stream().map(mapper::toResponse).toList(),
                page, limit, result.getTotalElements(), result.getTotalPages()
        );
    }

    @Transactional
    public LearningResourceResponse createLearningResource(LearningResourceRequest request) {
        LearningResource resource = new LearningResource();
        resource.setName(request.name());
        resource.setProvider(request.provider());
        resource.setUrl(request.url());
        resource.setType(request.type());
        resource.setSector(request.sectorId() == null ? null : sectorRepository.findById(request.sectorId())
                .orElseThrow(() -> new ResourceNotFoundException("Sector not found")));
        resource.setJobRole(request.jobRoleId() == null ? null : jobRoleRepository.findById(request.jobRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Job role not found")));
        return mapper.toResponse(repository.save(resource));
    }

    public LearningResourceDetailResponse getLearningResource(Long id) {
        LearningResource resource = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found"));
        return mapper.toDetailResponse(resource, mappingRepository.findByLearningResource_Id(id));
    }
}

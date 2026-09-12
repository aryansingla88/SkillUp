package com.skillup.skillup.features.candidate.service;

import com.skillup.skillup.common.exception.ResourceNotFoundException;
import com.skillup.skillup.common.security.CurrentUserService;
import com.skillup.skillup.features.candidate.dto.CandidateProfileRequest;
import com.skillup.skillup.features.candidate.dto.CandidateProfileResponse;
import com.skillup.skillup.features.candidate.entity.CandidateProfile;
import com.skillup.skillup.features.candidate.mapper.CandidateProfileMapper;
import com.skillup.skillup.features.candidate.repository.CandidateProfileRepository;
import com.skillup.skillup.features.candidate.repository.DistrictRepository;
import com.skillup.skillup.features.jobrole.repository.JobRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CandidateProfileService {
    private final CandidateProfileRepository candidateProfileRepository;
    private final DistrictRepository districtRepository;
    private final JobRoleRepository jobRoleRepository;
    private final CurrentUserService currentUserService;
    private final CandidateProfileMapper mapper;

    public CandidateProfileService(
            CandidateProfileRepository candidateProfileRepository,
            DistrictRepository districtRepository,
            JobRoleRepository jobRoleRepository,
            CurrentUserService currentUserService,
            CandidateProfileMapper mapper) {
        this.candidateProfileRepository = candidateProfileRepository;
        this.districtRepository = districtRepository;
        this.jobRoleRepository = jobRoleRepository;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
    }

    public CandidateProfileResponse getProfile() {
        Long userId = currentUserService.getCurrentUserId();
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
        return mapper.toResponse(profile);
    }

    @Transactional
    public CandidateProfileResponse updateProfile(CandidateProfileRequest request) {
        Long userId = currentUserService.getCurrentUserId();
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        if (request.districtId() != null) {
            profile.setDistrict(districtRepository.findById(request.districtId())
                    .orElseThrow(() -> new ResourceNotFoundException("District not found: " + request.districtId())));
        }

        profile.setEducation(request.education());

        if (request.careerGoalJobRoleId() != null) {
            profile.setCareerGoalJobRole(jobRoleRepository.findById(request.careerGoalJobRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Job role not found: " + request.careerGoalJobRoleId())));
        } else {
            profile.setCareerGoalJobRole(null);
        }

        return mapper.toResponse(candidateProfileRepository.save(profile));
    }
}

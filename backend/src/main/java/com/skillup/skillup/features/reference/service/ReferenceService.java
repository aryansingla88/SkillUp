package com.skillup.skillup.features.reference.service;
import com.skillup.skillup.features.skill.repository.SkillRepository;
import com.skillup.skillup.common.exception.ResourceNotFoundException;
import com.skillup.skillup.features.reference.dto.response.*;
import com.skillup.skillup.features.reference.mapper.ReferenceMapper;
import com.skillup.skillup.features.reference.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReferenceService {

    private final DistrictRepository districtRepository;
    private final SectorRepository sectorRepository;
    private final JobRoleRepository jobRoleRepository;
    private final SkillRepository skillRepository;
    private final SubskillRepository subskillRepository;

    private final ReferenceMapper referenceMapper;

    public List<DistrictResponse> getDistricts() {
        return districtRepository.findAll()
                .stream()
                .map(referenceMapper::toDistrictResponse)
                .toList();
    }

    public List<SectorResponse> getSectors() {
        return sectorRepository.findAll()
                .stream()
                .map(referenceMapper::toSectorResponse)
                .toList();
    }

    public List<JobRoleResponse> getJobRoles(Long sectorId) {

        if (sectorId == null) {
            return jobRoleRepository.findAll()
                    .stream()
                    .map(referenceMapper::toJobRoleResponse)
                    .toList();
        }

        if (!sectorRepository.existsById(sectorId)) {
            throw new ResourceNotFoundException("Sector not found with id: " + sectorId);
        }

        return jobRoleRepository.findBySector_Id(sectorId)
                .stream()
                .map(referenceMapper::toJobRoleResponse)
                .toList();
    }

    public List<SkillResponse> getSkills(Long sectorId) {

        if (sectorId == null) {
            return skillRepository.findAll()
                    .stream()
                    .map(referenceMapper::toSkillResponse)
                    .toList();
        }

        if (!sectorRepository.existsById(sectorId)) {
            throw new ResourceNotFoundException("Sector not found with id: " + sectorId);
        }

        return skillRepository.findBySector_Id(sectorId)
                .stream()
                .map(referenceMapper::toSkillResponse)
                .toList();
    }

    public List<SubskillResponse> getSubskills(Long skillId) {

        if (!skillRepository.existsById(skillId)) {
            throw new ResourceNotFoundException("Skill not found with id: " + skillId);
        }

        return subskillRepository.findBySkill_Id(skillId)
                .stream()
                .map(referenceMapper::toSubskillResponse)
                .toList();
    }
}
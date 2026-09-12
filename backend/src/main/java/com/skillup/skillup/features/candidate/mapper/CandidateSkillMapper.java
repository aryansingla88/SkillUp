package com.skillup.skillup.features.candidate.mapper;

import com.skillup.skillup.features.candidate.dto.CandidateSkillResponse;
import com.skillup.skillup.features.candidate.dto.SkillResponse;
import com.skillup.skillup.features.candidate.entity.CandidateSkill;
import com.skillup.skillup.features.skill.entity.Skill;
import org.springframework.stereotype.Component;

@Component
public class CandidateSkillMapper {

    public CandidateSkillResponse toResponse(CandidateSkill candidateSkill) {
        Skill skill = candidateSkill.getSkill();
        SkillResponse skillResponse = new SkillResponse(
                skill.getId(),
                skill.getSector().getId(),
                skill.getName()
        );
        return new CandidateSkillResponse(skillResponse, candidateSkill.getProficiency());
    }
}

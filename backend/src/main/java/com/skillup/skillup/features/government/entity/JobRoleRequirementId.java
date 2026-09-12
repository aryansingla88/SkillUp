package com.skillup.skillup.features.government.entity;

import lombok.*;

import java.io.Serializable;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class JobRoleRequirementId implements Serializable {
    private Long jobRole;
    private Long skill;
}

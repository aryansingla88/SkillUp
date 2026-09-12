package com.skillup.skillup.features.reference.entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class JobRoleRequirementId implements Serializable {
    private Long jobRoleId;
    private Long skillId;
}

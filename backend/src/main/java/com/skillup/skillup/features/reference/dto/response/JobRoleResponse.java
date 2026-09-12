package com.skillup.skillup.features.reference.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRoleResponse {

    private Long id;
    private Long sectorId;
    private String name;
}
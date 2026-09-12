package com.skillup.skillup.features.reference.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubskillResponse {

    private Long id;
    private Long skillId;
    private String name;
}
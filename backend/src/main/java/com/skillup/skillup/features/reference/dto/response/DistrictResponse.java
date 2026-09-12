package com.skillup.skillup.features.reference.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistrictResponse {

    private Long id;
    private String state;
    private String name;
}
package com.skillup.skillup.features.candidate.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CandidateLearningRequest {
    @NotNull
    private Long learningResourceId;

    @NotNull
    private String status;

    @Min(0)
    @Max(100)
    private Integer progress;
}

package com.skillup.skillup.features.implementation.dto.request;
import jakarta.validation.constraints.*;
public class ProgressRequest {
 @NotBlank private String metricType; @NotNull @Min(0) private Integer currentValue; @NotNull @Min(0) private Integer targetValue; private String remarks;
 public ProgressRequest(){} public String getMetricType(){return metricType;} public void setMetricType(String v){metricType=v;} public Integer getCurrentValue(){return currentValue;} public void setCurrentValue(Integer v){currentValue=v;} public Integer getTargetValue(){return targetValue;} public void setTargetValue(Integer v){targetValue=v;} public String getRemarks(){return remarks;} public void setRemarks(String v){remarks=v;}
}

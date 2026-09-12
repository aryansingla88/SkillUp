package com.skillup.skillup.features.execution.dto.request;
import jakarta.validation.constraints.*;
public class ActionPlanRequest {
 @NotNull private Long recommendationId; @NotNull private Long districtId; @NotBlank private String title; private String objective; private String expectedImplementation;
 public ActionPlanRequest(){}
 public Long getRecommendationId(){return recommendationId;} public void setRecommendationId(Long v){recommendationId=v;} public Long getDistrictId(){return districtId;} public void setDistrictId(Long v){districtId=v;}
 public String getTitle(){return title;} public void setTitle(String v){title=v;} public String getObjective(){return objective;} public void setObjective(String v){objective=v;}
 public String getExpectedImplementation(){return expectedImplementation;} public void setExpectedImplementation(String v){expectedImplementation=v;}
}

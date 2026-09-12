package com.skillup.skillup.features.implementation.dto.response;
import java.time.LocalDateTime;
public class ProgressResponse {
 private Long id,actionItemId,updatedBy; private String metricType,remarks; private Integer currentValue,targetValue; private LocalDateTime updatedAt;
 public ProgressResponse(){} public ProgressResponse(Long i,Long a,String m,Integer c,Integer t,String r,Long u,LocalDateTime d){id=i;actionItemId=a;metricType=m;currentValue=c;targetValue=t;remarks=r;updatedBy=u;updatedAt=d;}
 public Long getId(){return id;} public Long getActionItemId(){return actionItemId;} public String getMetricType(){return metricType;} public Integer getCurrentValue(){return currentValue;} public Integer getTargetValue(){return targetValue;} public String getRemarks(){return remarks;} public Long getUpdatedBy(){return updatedBy;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}

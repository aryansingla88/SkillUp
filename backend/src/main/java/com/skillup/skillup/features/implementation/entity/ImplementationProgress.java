package com.skillup.skillup.features.implementation.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="implementation_progress")
public class ImplementationProgress {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="action_item_id",nullable=false) private Long actionItemId; @Column(name="metric_type",nullable=false) private String metricType;
 @Column(name="current_value",nullable=false) private Integer currentValue; @Column(name="target_value",nullable=false) private Integer targetValue;
 @Column(columnDefinition="TEXT") private String remarks; @Column(name="updated_by",nullable=false) private Long updatedBy; @Column(name="updated_at",nullable=false) private LocalDateTime updatedAt;
 public ImplementationProgress(){} public Long getId(){return id;} public Long getActionItemId(){return actionItemId;} public void setActionItemId(Long v){actionItemId=v;} public String getMetricType(){return metricType;} public void setMetricType(String v){metricType=v;}
 public Integer getCurrentValue(){return currentValue;} public void setCurrentValue(Integer v){currentValue=v;} public Integer getTargetValue(){return targetValue;} public void setTargetValue(Integer v){targetValue=v;} public String getRemarks(){return remarks;} public void setRemarks(String v){remarks=v;}
 public Long getUpdatedBy(){return updatedBy;} public void setUpdatedBy(Long v){updatedBy=v;} public LocalDateTime getUpdatedAt(){return updatedAt;} public void setUpdatedAt(LocalDateTime v){updatedAt=v;}
}

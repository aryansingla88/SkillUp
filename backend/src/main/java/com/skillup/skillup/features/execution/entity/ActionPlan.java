package com.skillup.skillup.features.execution.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="action_plans")
public class ActionPlan {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="recommendation_id",nullable=false) private Long recommendationId;
 @Column(name="district_id",nullable=false) private Long districtId;
 @Column(name="created_by",nullable=false) private Long createdBy;
 @Column(nullable=false) private String title;
 @Column(columnDefinition="TEXT") private String objective;
 @Column(name="expected_implementation",columnDefinition="TEXT") private String expectedImplementation;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private ActionPlanStatus status;
 @Column(name="approved_at") private LocalDateTime approvedAt;
 public ActionPlan(){}
 public Long getId(){return id;} public Long getRecommendationId(){return recommendationId;} public void setRecommendationId(Long v){recommendationId=v;}
 public Long getDistrictId(){return districtId;} public void setDistrictId(Long v){districtId=v;} public Long getCreatedBy(){return createdBy;} public void setCreatedBy(Long v){createdBy=v;}
 public String getTitle(){return title;} public void setTitle(String v){title=v;} public String getObjective(){return objective;} public void setObjective(String v){objective=v;}
 public String getExpectedImplementation(){return expectedImplementation;} public void setExpectedImplementation(String v){expectedImplementation=v;}
 public ActionPlanStatus getStatus(){return status;} public void setStatus(ActionPlanStatus v){status=v;} public LocalDateTime getApprovedAt(){return approvedAt;} public void setApprovedAt(LocalDateTime v){approvedAt=v;}
}

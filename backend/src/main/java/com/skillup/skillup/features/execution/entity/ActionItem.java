package com.skillup.skillup.features.execution.entity;
import jakarta.persistence.*;
@Entity @Table(name="action_items")
public class ActionItem {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="action_plan_id",nullable=false) private Long actionPlanId;
 @Column(name="training_centre_id",nullable=false) private Long trainingCentreId;
 @Enumerated(EnumType.STRING) @Column(name="action_type",nullable=false) private ActionType actionType;
 @Column(columnDefinition="TEXT") private String description;
 @Column(name="target_quantity",nullable=false) private Integer targetQuantity;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private ActionItemStatus status;
 public ActionItem(){}
 public Long getId(){return id;} public Long getActionPlanId(){return actionPlanId;} public void setActionPlanId(Long v){actionPlanId=v;}
 public Long getTrainingCentreId(){return trainingCentreId;} public void setTrainingCentreId(Long v){trainingCentreId=v;} public ActionType getActionType(){return actionType;} public void setActionType(ActionType v){actionType=v;}
 public String getDescription(){return description;} public void setDescription(String v){description=v;} public Integer getTargetQuantity(){return targetQuantity;} public void setTargetQuantity(Integer v){targetQuantity=v;}
 public ActionItemStatus getStatus(){return status;} public void setStatus(ActionItemStatus v){status=v;}
}

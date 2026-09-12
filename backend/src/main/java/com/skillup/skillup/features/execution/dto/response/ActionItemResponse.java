package com.skillup.skillup.features.execution.dto.response;
import com.skillup.skillup.common.dto.response.TrainingCentreResponse;
import com.skillup.skillup.features.execution.entity.*;
public class ActionItemResponse {
 private Long id,actionPlanId; private TrainingCentreResponse trainingCentre; private ActionType actionType; private String description; private Integer targetQuantity; private ActionItemStatus status;
 public ActionItemResponse(){}
 public ActionItemResponse(Long id,Long plan,TrainingCentreResponse centre,ActionType type,String desc,Integer target,ActionItemStatus status){this.id=id;actionPlanId=plan;trainingCentre=centre;actionType=type;description=desc;targetQuantity=target;this.status=status;}
 public Long getId(){return id;} public Long getActionPlanId(){return actionPlanId;} public TrainingCentreResponse getTrainingCentre(){return trainingCentre;} public ActionType getActionType(){return actionType;} public String getDescription(){return description;} public Integer getTargetQuantity(){return targetQuantity;} public ActionItemStatus getStatus(){return status;}
}

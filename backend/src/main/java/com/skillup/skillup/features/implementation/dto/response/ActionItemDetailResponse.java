package com.skillup.skillup.features.execution.dto.response;
import com.skillup.skillup.features.execution.entity.*; import com.skillup.skillup.features.implementation.dto.response.ProgressResponse; import java.util.List;
public class ActionItemDetailResponse {
 private Long id,actionPlanId,trainingCentreId; private ActionType actionType; private String description; private Integer targetQuantity; private ActionItemStatus status; private List<ProgressResponse> progress;
 public ActionItemDetailResponse(){} public ActionItemDetailResponse(Long i,Long p,Long c,ActionType t,String d,Integer q,ActionItemStatus s,List<ProgressResponse> pr){id=i;actionPlanId=p;trainingCentreId=c;actionType=t;description=d;targetQuantity=q;status=s;progress=pr;}
 public Long getId(){return id;} public Long getActionPlanId(){return actionPlanId;} public Long getTrainingCentreId(){return trainingCentreId;} public ActionType getActionType(){return actionType;} public String getDescription(){return description;} public Integer getTargetQuantity(){return targetQuantity;} public ActionItemStatus getStatus(){return status;} public List<ProgressResponse> getProgress(){return progress;}
}

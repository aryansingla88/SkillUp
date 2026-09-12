package com.skillup.skillup.features.execution.dto.response;
import com.skillup.skillup.common.dto.response.DistrictResponse;
import com.skillup.skillup.features.execution.entity.*; import java.time.LocalDateTime; import java.util.List;
public class ActionPlanResponse {
 private Long id,recommendationId; private DistrictResponse district; private String title,objective,expectedImplementation; private ActionPlanStatus status; private LocalDateTime approvedAt; private List<ActionItemResponse> items;
 public ActionPlanResponse(){}
 public ActionPlanResponse(Long i,Long r,DistrictResponse d,String t,String o,String e,ActionPlanStatus s,LocalDateTime a,List<ActionItemResponse> items){id=i;recommendationId=r;district=d;title=t;objective=o;expectedImplementation=e;status=s;approvedAt=a;this.items=items;}
 public Long getId(){return id;} public Long getRecommendationId(){return recommendationId;} public DistrictResponse getDistrict(){return district;} public String getTitle(){return title;} public String getObjective(){return objective;} public String getExpectedImplementation(){return expectedImplementation;} public ActionPlanStatus getStatus(){return status;} public LocalDateTime getApprovedAt(){return approvedAt;} public List<ActionItemResponse> getItems(){return items;}
}

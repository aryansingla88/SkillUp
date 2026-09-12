package com.skillup.skillup.features.coordination.dto.response;
import com.skillup.skillup.features.coordination.entity.CoordinationRequestStatus; import java.time.LocalDateTime;
public class CoordinationRequestResponse {
 private Long id,actionItemId,raisedBy,assignedTo; private String requestType,description; private CoordinationRequestStatus status; private LocalDateTime createdAt,updatedAt;
 public CoordinationRequestResponse(){} public CoordinationRequestResponse(Long i,Long a,Long r,Long as,String t,String d,CoordinationRequestStatus s,LocalDateTime c,LocalDateTime u){id=i;actionItemId=a;raisedBy=r;assignedTo=as;requestType=t;description=d;status=s;createdAt=c;updatedAt=u;}
 public Long getId(){return id;} public Long getActionItemId(){return actionItemId;} public Long getRaisedBy(){return raisedBy;} public Long getAssignedTo(){return assignedTo;} public String getRequestType(){return requestType;} public String getDescription(){return description;} public CoordinationRequestStatus getStatus(){return status;} public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}

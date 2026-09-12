package com.skillup.skillup.features.coordination.entity;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="requests")
public class CoordinationRequest {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(name="action_item_id",nullable=false) private Long actionItemId; @Column(name="raised_by",nullable=false) private Long raisedBy; @Column(name="assigned_to") private Long assignedTo;
 @Column(name="request_type",nullable=false) private String requestType; @Column(columnDefinition="TEXT") private String description;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private CoordinationRequestStatus status; @Column(name="created_at",nullable=false) private LocalDateTime createdAt; @Column(name="updated_at",nullable=false) private LocalDateTime updatedAt;
 public CoordinationRequest(){} public Long getId(){return id;} public Long getActionItemId(){return actionItemId;} public void setActionItemId(Long v){actionItemId=v;} public Long getRaisedBy(){return raisedBy;} public void setRaisedBy(Long v){raisedBy=v;} public Long getAssignedTo(){return assignedTo;} public void setAssignedTo(Long v){assignedTo=v;} public String getRequestType(){return requestType;} public void setRequestType(String v){requestType=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;} public CoordinationRequestStatus getStatus(){return status;} public void setStatus(CoordinationRequestStatus v){status=v;} public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;} public LocalDateTime getUpdatedAt(){return updatedAt;} public void setUpdatedAt(LocalDateTime v){updatedAt=v;}
}

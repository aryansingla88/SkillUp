package com.skillup.skillup.features.coordination.dto.request;
import jakarta.validation.constraints.NotBlank;
public class RequestUpdateRequest { private Long assignedTo; @NotBlank private String status; private String description; public RequestUpdateRequest(){} public Long getAssignedTo(){return assignedTo;} public void setAssignedTo(Long v){assignedTo=v;} public String getStatus(){return status;} public void setStatus(String v){status=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;}}

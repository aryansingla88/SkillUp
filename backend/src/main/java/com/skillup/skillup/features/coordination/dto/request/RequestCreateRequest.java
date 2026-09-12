package com.skillup.skillup.features.coordination.dto.request;
import jakarta.validation.constraints.*;
public class RequestCreateRequest { @NotNull private Long actionItemId; @NotBlank private String requestType; private String description; public RequestCreateRequest(){} public Long getActionItemId(){return actionItemId;} public void setActionItemId(Long v){actionItemId=v;} public String getRequestType(){return requestType;} public void setRequestType(String v){requestType=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;}}

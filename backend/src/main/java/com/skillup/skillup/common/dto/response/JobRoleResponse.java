package com.skillup.skillup.common.dto.response;
public class JobRoleResponse {
 private Long id,sectorId; private String name;
 public JobRoleResponse(){} public JobRoleResponse(Long id,Long sectorId,String name){this.id=id;this.sectorId=sectorId;this.name=name;}
 public Long getId(){return id;} public Long getSectorId(){return sectorId;} public String getName(){return name;}
}

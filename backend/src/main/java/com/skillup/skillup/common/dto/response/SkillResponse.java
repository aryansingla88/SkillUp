package com.skillup.skillup.common.dto.response;
public class SkillResponse {
 private Long id,sectorId; private String name;
 public SkillResponse(){} public SkillResponse(Long id,Long sectorId,String name){this.id=id;this.sectorId=sectorId;this.name=name;}
 public Long getId(){return id;} public Long getSectorId(){return sectorId;} public String getName(){return name;}
}

package com.skillup.skillup.common.dto.response;
public class DistrictResponse {
 private Long id; private String state,name;
 public DistrictResponse(){} public DistrictResponse(Long id,String state,String name){this.id=id;this.state=state;this.name=name;}
 public Long getId(){return id;} public String getState(){return state;} public String getName(){return name;}
}

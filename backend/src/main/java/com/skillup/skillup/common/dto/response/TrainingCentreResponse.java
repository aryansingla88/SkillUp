package com.skillup.skillup.common.dto.response;
public class TrainingCentreResponse {
 private Long id; private DistrictResponse district; private String name,ownershipType;
 public TrainingCentreResponse(){} public TrainingCentreResponse(Long id,DistrictResponse district,String name,String ownershipType){this.id=id;this.district=district;this.name=name;this.ownershipType=ownershipType;}
 public Long getId(){return id;} public DistrictResponse getDistrict(){return district;} public String getName(){return name;} public String getOwnershipType(){return ownershipType;}
}

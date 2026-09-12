package com.skillup.skillup.features.execution.dto.response;
import java.util.List;
public class PageActionPlanResponse {
 private List<ActionPlanResponse> content; private int page,limit; private long totalElements; private int totalPages;
 public PageActionPlanResponse(){} public PageActionPlanResponse(List<ActionPlanResponse> c,int p,int l,long t,int tp){content=c;page=p;limit=l;totalElements=t;totalPages=tp;}
 public List<ActionPlanResponse> getContent(){return content;} public int getPage(){return page;} public int getLimit(){return limit;} public long getTotalElements(){return totalElements;} public int getTotalPages(){return totalPages;}
}

package com.skillup.skillup.features.execution.service;
import com.skillup.skillup.common.exception.*; import com.skillup.skillup.common.security.CurrentUserService;
import com.skillup.skillup.common.repository.ReferenceQueryRepository;
import com.skillup.skillup.features.execution.dto.request.*; import com.skillup.skillup.features.execution.dto.response.*;
import com.skillup.skillup.features.execution.entity.*; import com.skillup.skillup.features.execution.repository.*;
import com.skillup.skillup.features.recommendation.repository.RecommendationRepository;
import org.springframework.data.domain.*; import org.springframework.stereotype.Service; import java.time.LocalDateTime;

@Service
public class ActionPlanService {
 private final ActionPlanRepository planRepo; private final ActionItemRepository itemRepo; private final RecommendationRepository recommendationRepo; private final CurrentUserService user; private final ReferenceQueryRepository reference;
 public ActionPlanService(ActionPlanRepository p,ActionItemRepository i,RecommendationRepository r,CurrentUserService u,ReferenceQueryRepository ref){planRepo=p;itemRepo=i;recommendationRepo=r;user=u;reference=ref;}
 public PageActionPlanResponse list(int page,int limit,Long districtId,String status){
  validatePage(page,limit); ActionPlanStatus s=parseStatus(status); Page<ActionPlan> result=planRepo.findPlans(districtId,s==null?null:s.name(),PageRequest.of(page-1,limit));
  return new PageActionPlanResponse(result.getContent().stream().map(this::toResponse).toList(),page,limit,result.getTotalElements(),result.getTotalPages());
 }
 public ActionPlanResponse create(ActionPlanRequest req){
  if(!recommendationRepo.existsById(req.getRecommendationId()))throw new ResourceNotFoundException("Recommendation not found with id: "+req.getRecommendationId());
  ActionPlan p=new ActionPlan(); p.setRecommendationId(req.getRecommendationId());p.setDistrictId(req.getDistrictId());p.setCreatedBy(user.getCurrentUserId());
  p.setTitle(req.getTitle());p.setObjective(req.getObjective());p.setExpectedImplementation(req.getExpectedImplementation());p.setStatus(ActionPlanStatus.DRAFT);
  return toResponse(planRepo.save(p));
 }
 public ActionPlanResponse get(Long id){return toResponse(find(id));}
 public ActionPlanResponse update(Long id,ActionPlanRequest req){
  ActionPlan p=find(id);
  if(req.getRecommendationId()!=null){if(!recommendationRepo.existsById(req.getRecommendationId()))throw new ResourceNotFoundException("Recommendation not found with id: "+req.getRecommendationId());p.setRecommendationId(req.getRecommendationId());}
  if(req.getDistrictId()!=null)p.setDistrictId(req.getDistrictId());p.setTitle(req.getTitle());p.setObjective(req.getObjective());p.setExpectedImplementation(req.getExpectedImplementation());
  return toResponse(planRepo.save(p));
 }
 public ActionPlanResponse approve(Long id){ActionPlan p=find(id);p.setStatus(ActionPlanStatus.APPROVED);p.setApprovedAt(LocalDateTime.now());return toResponse(planRepo.save(p));}
 private ActionPlan find(Long id){return planRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Action plan not found with id: "+id));}
 private ActionPlanResponse toResponse(ActionPlan p){return new ActionPlanResponse(p.getId(),p.getRecommendationId(),reference.district(p.getDistrictId()).orElse(null),p.getTitle(),p.getObjective(),p.getExpectedImplementation(),p.getStatus(),p.getApprovedAt(),itemRepo.findByActionPlanId(p.getId()).stream().map(i->new ActionItemResponse(i.getId(),i.getActionPlanId(),reference.trainingCentre(i.getTrainingCentreId()).orElse(null),i.getActionType(),i.getDescription(),i.getTargetQuantity(),i.getStatus())).toList());}
 private void validatePage(int p,int l){if(p<1)throw new BadRequestException("Page must be greater than or equal to 1");if(l<1||l>100)throw new BadRequestException("Limit must be between 1 and 100");}
 private ActionPlanStatus parseStatus(String s){if(s==null||s.isBlank())return null;try{return ActionPlanStatus.valueOf(s.toUpperCase());}catch(Exception e){throw new BadRequestException("Invalid action plan status: "+s);}}
}

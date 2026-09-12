package com.skillup.skillup.features.execution.service;
import com.skillup.skillup.common.exception.ResourceNotFoundException; import com.skillup.skillup.features.execution.dto.response.*;
import com.skillup.skillup.features.execution.entity.ActionItem; import com.skillup.skillup.features.execution.repository.ActionItemRepository; import com.skillup.skillup.features.implementation.dto.response.ProgressResponse; import com.skillup.skillup.features.implementation.repository.ImplementationProgressRepository;
import org.springframework.stereotype.Service;
@Service
public class ActionItemService {
 private final ActionItemRepository repo; private final ImplementationProgressRepository progressRepo;
 public ActionItemService(ActionItemRepository r,ImplementationProgressRepository p){repo=r;progressRepo=p;}
 public ActionItemDetailResponse get(Long id){
  ActionItem i=repo.findById(id).orElseThrow(()->new ResourceNotFoundException("Action item not found with id: "+id));
  var progress=progressRepo.findByActionItemIdOrderByUpdatedAtDesc(id).stream().map(p->new ProgressResponse(p.getId(),p.getActionItemId(),p.getMetricType(),p.getCurrentValue(),p.getTargetValue(),p.getRemarks(),p.getUpdatedBy(),p.getUpdatedAt())).toList();
  return new ActionItemDetailResponse(i.getId(),i.getActionPlanId(),i.getTrainingCentreId(),i.getActionType(),i.getDescription(),i.getTargetQuantity(),i.getStatus(),progress);
 }
}

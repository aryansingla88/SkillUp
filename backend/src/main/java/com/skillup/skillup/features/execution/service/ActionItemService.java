package com.skillup.skillup.features.execution.service;
import com.skillup.skillup.common.exception.ResourceNotFoundException;
import com.skillup.skillup.common.repository.ReferenceQueryRepository;
import com.skillup.skillup.features.execution.dto.response.ActionItemResponse;
import com.skillup.skillup.features.execution.entity.ActionItem;
import com.skillup.skillup.features.execution.repository.ActionItemRepository;
import org.springframework.stereotype.Service;
@Service
public class ActionItemService {
 private final ActionItemRepository repo; private final ReferenceQueryRepository reference;
 public ActionItemService(ActionItemRepository r,ReferenceQueryRepository ref){repo=r;reference=ref;}
 public ActionItemResponse get(Long id){
  ActionItem i=repo.findById(id).orElseThrow(()->new ResourceNotFoundException("Action item not found with id: "+id));
  return new ActionItemResponse(i.getId(),i.getActionPlanId(),reference.trainingCentre(i.getTrainingCentreId()).orElse(null),i.getActionType(),i.getDescription(),i.getTargetQuantity(),i.getStatus());
 }
}

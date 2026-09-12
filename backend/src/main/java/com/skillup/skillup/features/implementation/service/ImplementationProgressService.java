package com.skillup.skillup.features.implementation.service;
import com.skillup.skillup.common.exception.*; import com.skillup.skillup.common.security.CurrentUserService;
import com.skillup.skillup.features.execution.entity.*; import com.skillup.skillup.features.execution.repository.ActionItemRepository;
import com.skillup.skillup.features.implementation.dto.request.ProgressRequest; import com.skillup.skillup.features.implementation.dto.response.ProgressResponse;
import com.skillup.skillup.features.implementation.entity.ImplementationProgress;
import com.skillup.skillup.features.implementation.entity.MetricType; import com.skillup.skillup.features.implementation.repository.ImplementationProgressRepository;
import org.springframework.stereotype.Service; import java.time.LocalDateTime; import java.util.List;
@Service
public class ImplementationProgressService {
 private final ImplementationProgressRepository repo; private final ActionItemRepository itemRepo; private final CurrentUserService user;
 public ImplementationProgressService(ImplementationProgressRepository r,ActionItemRepository i,CurrentUserService u){repo=r;itemRepo=i;user=u;}
 public List<ProgressResponse> get(Long id){ensureItem(id);return repo.findByActionItemIdOrderByUpdatedAtDesc(id).stream().map(this::toResponse).toList();}
 public ProgressResponse create(Long id,ProgressRequest req){
  ActionItem item=ensureItem(id); parseMetricType(req.getMetricType()); if(req.getCurrentValue()>req.getTargetValue())throw new BadRequestException("Current value cannot exceed target value");
  ImplementationProgress p=new ImplementationProgress();p.setActionItemId(id);p.setMetricType(req.getMetricType());p.setCurrentValue(req.getCurrentValue());p.setTargetValue(req.getTargetValue());p.setRemarks(req.getRemarks());p.setUpdatedBy(user.getCurrentUserId());p.setUpdatedAt(LocalDateTime.now());
  ProgressResponse out=toResponse(repo.save(p));
  if(req.getCurrentValue().equals(req.getTargetValue()))item.setStatus(ActionItemStatus.COMPLETED);else if(req.getCurrentValue()>0)item.setStatus(ActionItemStatus.IN_PROGRESS);itemRepo.save(item);
  return out;
 }
 private MetricType parseMetricType(String s){try{return MetricType.valueOf(s.toUpperCase());}catch(Exception e){throw new BadRequestException("Invalid metric type: "+s);}}
 private ActionItem ensureItem(Long id){return itemRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Action item not found with id: "+id));}
 private ProgressResponse toResponse(ImplementationProgress p){return new ProgressResponse(p.getId(),p.getActionItemId(),p.getMetricType(),p.getCurrentValue(),p.getTargetValue(),p.getRemarks(),p.getUpdatedBy(),p.getUpdatedAt());}
}

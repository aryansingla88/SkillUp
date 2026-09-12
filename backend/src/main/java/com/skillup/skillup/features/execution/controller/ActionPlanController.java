package com.skillup.skillup.features.execution.controller;
import com.skillup.skillup.features.execution.dto.request.*; import com.skillup.skillup.features.execution.dto.response.*; import com.skillup.skillup.features.execution.service.ActionPlanService;
import jakarta.validation.Valid; import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/action-plans")
public class ActionPlanController {
 private final ActionPlanService service; public ActionPlanController(ActionPlanService s){service=s;}
 @GetMapping public ResponseEntity<PageActionPlanResponse> list(@RequestParam(defaultValue="1")int page,@RequestParam(defaultValue="20")int limit,@RequestParam(required=false)Long districtId,@RequestParam(required=false)String status){return ResponseEntity.ok(service.list(page,limit,districtId,status));}
 @PostMapping public ResponseEntity<ActionPlanResponse> create(@Valid @RequestBody ActionPlanRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));}
 @GetMapping("/{id}") public ResponseEntity<ActionPlanResponse> get(@PathVariable Long id){return ResponseEntity.ok(service.get(id));}
 @PutMapping("/{id}") public ResponseEntity<ActionPlanResponse> update(@PathVariable Long id,@Valid @RequestBody ActionPlanRequest r){return ResponseEntity.ok(service.update(id,r));}
 @PostMapping("/{id}/approve") public ResponseEntity<ActionPlanResponse> approve(@PathVariable Long id){return ResponseEntity.ok(service.approve(id));}
}

package com.skillup.skillup.features.implementation.controller;
import com.skillup.skillup.features.implementation.dto.request.ProgressRequest; import com.skillup.skillup.features.implementation.dto.response.ProgressResponse; import com.skillup.skillup.features.implementation.service.ImplementationProgressService;
import jakarta.validation.Valid; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/action-items/{actionItemId}/progress")
public class ImplementationProgressController {
 private final ImplementationProgressService service; public ImplementationProgressController(ImplementationProgressService s){service=s;}
 @GetMapping public ResponseEntity<List<ProgressResponse>> get(@PathVariable Long actionItemId){return ResponseEntity.ok(service.get(actionItemId));}
 @PostMapping public ResponseEntity<ProgressResponse> create(@PathVariable Long actionItemId,@Valid @RequestBody ProgressRequest r){return ResponseEntity.ok(service.create(actionItemId,r));}
}

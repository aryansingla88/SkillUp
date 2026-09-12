package com.skillup.skillup.features.coordination.controller;
import com.skillup.skillup.features.coordination.dto.request.*; import com.skillup.skillup.features.coordination.dto.response.*; import com.skillup.skillup.features.coordination.service.CoordinationRequestService; import jakarta.validation.Valid; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/requests")
public class CoordinationRequestController {
 private final CoordinationRequestService service; public CoordinationRequestController(CoordinationRequestService s){service=s;}
 @GetMapping public ResponseEntity<PageCoordinationRequestResponse> list(@RequestParam(defaultValue="1")int page,@RequestParam(defaultValue="20")int limit,@RequestParam(required=false)String status,@RequestParam(required=false)Long actionItemId){return ResponseEntity.ok(service.list(page,limit,status,actionItemId));}
 @PostMapping public ResponseEntity<CoordinationRequestResponse> create(@Valid @RequestBody RequestCreateRequest r){return ResponseEntity.ok(service.create(r));}
 @PutMapping("/{id}") public ResponseEntity<CoordinationRequestResponse> update(@PathVariable Long id,@Valid @RequestBody RequestUpdateRequest r){return ResponseEntity.ok(service.update(id,r));}
}

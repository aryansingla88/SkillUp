package com.skillup.skillup.features.execution.controller;
import com.skillup.skillup.features.execution.dto.response.ActionItemDetailResponse; import com.skillup.skillup.features.execution.service.ActionItemService; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/action-items")
public class ActionItemController { private final ActionItemService service; public ActionItemController(ActionItemService s){service=s;} @GetMapping("/{id}") public ResponseEntity<ActionItemDetailResponse> get(@PathVariable Long id){return ResponseEntity.ok(service.get(id));}}

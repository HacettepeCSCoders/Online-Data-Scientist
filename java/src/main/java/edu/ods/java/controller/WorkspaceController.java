package edu.ods.java.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import edu.ods.java.dto.WorkspaceDTO;
import edu.ods.java.dto.WorkspaceUpdateDTO;
import edu.ods.java.service.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

	private final WorkspaceService workspaceService;

	@GetMapping("/{workspaceId}")
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER')")
	public ResponseEntity<WorkspaceDTO> getWorkspace(@PathVariable(name = "workspaceId") long id) {
		return ResponseEntity.ok(workspaceService.getById(id));
	}

	@PutMapping("/{workspaceId}")
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER')")
	public ResponseEntity<WorkspaceDTO> updateWorkspace(@Valid @PathVariable(name = "workspaceId") long id,
			@Valid @RequestBody WorkspaceUpdateDTO workspaceUpdateDTO) {
		return ResponseEntity.ok(workspaceService.updateWorkspace(id, workspaceUpdateDTO));
	}

	@PostMapping("/deactivate/{workspaceId}")
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER')")
	public ResponseEntity<WorkspaceDTO> removeWorkspace(@PathVariable(name = "workspaceId") long id) {
		return ResponseEntity.ok(workspaceService.removeWorkspace(id));
	}

	@PostMapping("/activate/{workspaceId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<WorkspaceDTO> setWorkspaceActive(@PathVariable(name = "workspaceId") long id) {
		return ResponseEntity.ok(workspaceService.setWorkspaceActive(id));
	}

	@DeleteMapping("/{workspaceId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<String> deleteWorkspace(@PathVariable(name = "workspaceId") long id) {
		workspaceService.deleteWorkspace(id);
		return new ResponseEntity<>("Workspace deleted permanently!", HttpStatus.OK);
	}

	@GetMapping("/existsByFileName/{fileName}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Boolean> existsByFileName(@PathVariable(name = "fileName") String fileName) {
		return ResponseEntity.ok(workspaceService.workspaceExistsByFileName(fileName));
	}

}

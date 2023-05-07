package edu.ods.java.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import edu.ods.java.dto.UserDTO;
import edu.ods.java.dto.UserUpdateDTO;
import edu.ods.java.dto.WorkspaceDTO;
import edu.ods.java.model.Workspace;
import edu.ods.java.service.UserService;
import edu.ods.java.service.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	private final WorkspaceService workspaceService;

	@PostMapping("")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
		return ResponseEntity.ok(userService.createUser(userDTO));

	}

	@GetMapping("")
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER')")
	public ResponseEntity<List<UserDTO>> getUsers() {
		return ResponseEntity.ok(userService.getAllUsers());
	}

	@GetMapping("/by-username")
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER')")
	public ResponseEntity<UserDTO> searchUserByUsername(@RequestParam(name = "username") String username) {
		return ResponseEntity.ok(userService.getByUsername(username));
	}

	@GetMapping("/all-by-username")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<UserDTO>> searchUsersByUsername(@RequestParam(name = "username") String username) {
		return ResponseEntity.ok(userService.getAllByUsername(username));
	}

	@GetMapping("/with-jpa-pagination")
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER')")
	public ResponseEntity<Page<UserDTO>> getUsersWithJpaPagination(
			@RequestParam(name = "pageNumber", defaultValue = "1") int pageNumber,
			@RequestParam(name = "pageSize", defaultValue = "5") int pageSize,
			@RequestParam(name = "currentUser", defaultValue = "") String username) {
		return ResponseEntity.ok(userService.getAllWithJpaPagination(pageNumber, pageSize, username));
	}

	@GetMapping("/has-role-user")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<UserDTO>> getUsersWithUserRole() {
		return ResponseEntity.ok(userService.getUsersWithRole(List.of("ROLE_USER")));
	}

	@GetMapping("/has-role-admin")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<UserDTO>> getUsersWithAdminRole() {
		return ResponseEntity.ok(userService.getUsersWithRole(List.of("ROLE_ADMIN")));
	}

	@GetMapping("/{userId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<UserDTO> getUser(@PathVariable(name = "userId") long id) {
		return ResponseEntity.ok(userService.getById(id));
	}

	@PutMapping("/{userId}")
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER')")
	public ResponseEntity<UserDTO> updateUser(@Valid @PathVariable(name = "userId") long id,
			@Valid @RequestBody UserUpdateDTO userUpdateDTO) {
		return ResponseEntity.ok(userService.updateUser(id, userUpdateDTO));
	}

	@PostMapping("/deactivate/{userId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<UserDTO> removeUser(@PathVariable(name = "userId") long id) {
		return ResponseEntity.ok(userService.removeUser(id));
	}

	@PostMapping("/activate/{userId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<UserDTO> setUserActive(@PathVariable(name = "userId") long id) {
		return ResponseEntity.ok(userService.setUserActive(id));
	}

	@DeleteMapping("/{userId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<String> deleteUser(@PathVariable(name = "userId") long id) {
		userService.deleteUser(id);
		return new ResponseEntity<>("User deleted permanently!", HttpStatus.OK);
	}

	@GetMapping("/existsByName/{username}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Boolean> existsByUsername(@PathVariable(name = "username") String email) {
		return ResponseEntity.ok(userService.userExists(email));
	}

	@GetMapping("/{userId}/workspaces")
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER')")
	public ResponseEntity<List<Workspace>> getAllWorkspacesByUserId(@PathVariable(value = "userId") long userId) {
		return ResponseEntity.ok(workspaceService.getAllByUserId(userId));
	}

	@PostMapping("/{userId}/workspaces")
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER')")
	public ResponseEntity<WorkspaceDTO> createWorkspace(@RequestBody WorkspaceDTO workspaceDTO) {
		return ResponseEntity.ok(workspaceService.createWorkspace(workspaceDTO));

	}

	@GetMapping("/{userId}/workspaces/{fileName}")
	@PreAuthorize("hasRole('ROLE_ADMIN') OR hasRole('ROLE_USER')")
	public ResponseEntity<WorkspaceDTO> getWorkspaceByUserIdAndFileName(@PathVariable(name = "userId") long userId,
			@PathVariable(name = "fileName") String fileName) {
		return ResponseEntity.ok(workspaceService.getByFileNameAndUserId(fileName, userId));
	}

	@DeleteMapping("/{userId}/workspaces")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<String> deleteAllWorkspacesOfUser(@PathVariable(value = "userId") long userId) {
		workspaceService.deleteAllWorkspacesOfUser(userId);
		return new ResponseEntity<>("User deleted permanently!", HttpStatus.OK);

	}

}

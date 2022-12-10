package edu.ods.java.controllers;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import edu.ods.java.dto.RoleDTO;
import edu.ods.java.dto.RoleUpdateDTO;
import edu.ods.java.models.User;
import edu.ods.java.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/roles")
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequiredArgsConstructor
public class RoleController {

	private final RoleService roleService;

	@PostMapping("")
	public ResponseEntity<RoleDTO> createRole(@Valid @RequestBody RoleDTO roleDTO) {
		return ResponseEntity.ok(roleService.createRole(roleDTO));

	}

	@PostMapping("/add-role-to-user")
	public ResponseEntity<User> addRoleToUser(@RequestParam(name = "roleId") long roleId,
			@RequestParam(name = "userId") long userId) {
		return ResponseEntity.ok(roleService.addRoleToUser(roleId, userId));

	}

	@PostMapping("/remove-role-from-user")
	public ResponseEntity<User> removeRoleFromUser(@RequestParam(name = "roleId") long roleId,
			@RequestParam(name = "userId") long userId) {
		return ResponseEntity.ok(roleService.removeRoleFromUser(roleId, userId));

	}

	@GetMapping("")
	public ResponseEntity<List<RoleDTO>> getRoles() {
		return ResponseEntity.ok(roleService.getAllRoles());
	}

	@GetMapping("/by-role-name")
	public ResponseEntity<RoleDTO> searchRoles(@RequestParam(name = "roleName") String roleName) {
		return ResponseEntity.ok(roleService.getByRoleName(roleName));
	}

	@GetMapping("/with-jpa-pagination")
	public ResponseEntity<Page<RoleDTO>> getRolesWithJpaPagination(
			@RequestParam(name = "pageNumber", defaultValue = "1") int pageNumber,
			@RequestParam(name = "pageSize", defaultValue = "5") int pageSize) {
		return ResponseEntity.ok(roleService.getAllWithJpaPagination(pageNumber, pageSize));
	}

	@GetMapping("/{roleId}")
	public ResponseEntity<RoleDTO> getRole(@PathVariable(name = "roleId") long id) {
		return ResponseEntity.ok(roleService.getById(id));
	}

	@PutMapping("/{roleId}")
	public ResponseEntity<RoleDTO> updateRole(@PathVariable(name = "roleId") long id,
			@Valid @RequestBody RoleUpdateDTO roleUpdateDTO) {
		return ResponseEntity.ok(roleService.updateRole(id, roleUpdateDTO));
	}

	@DeleteMapping("/remove/{roleId}")
	public ResponseEntity<RoleDTO> removeRole(@PathVariable(name = "roleId") long id) {
		return ResponseEntity.ok(roleService.removeRole(id));
	}

	@PostMapping("/activate/{roleId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<RoleDTO> setRoleActive(@PathVariable(name = "roleId") long id) {
		return ResponseEntity.ok(roleService.setRoleActive(id));
	}

	@DeleteMapping("/{roleId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<String> deleteRole(@PathVariable(name = "roleId") long id) {
		roleService.deleteRole(id);
		return new ResponseEntity<>("Role deleted permanently!", HttpStatus.OK);
	}

	@GetMapping("/existsByName/{roleName}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Boolean> existsByName(@PathVariable(name = "roleName") String name) {
		return ResponseEntity.ok(roleService.roleExists(name));
	}

}

package edu.ods.java.service;

import edu.ods.java.dto.RoleDTO;
import edu.ods.java.dto.RoleUpdateDTO;
import edu.ods.java.exceptions.RoleNotFoundException;
import edu.ods.java.exceptions.UserNotFoundException;
import edu.ods.java.models.Role;
import edu.ods.java.models.User;
import edu.ods.java.repository.RoleRepository;
import edu.ods.java.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

	private final RoleRepository roleRepository;

	private final UserRepository userRepository;

	public RoleDTO createRole(RoleDTO roleDTO) {
		Role role = mapToEntity(roleDTO);
		return mapToDTO(roleRepository.save(role));
	}

	public User addRoleToUser(long roleId, long userId) {
		Optional<User> user = userRepository.findById(userId);
		Optional<Role> role = roleRepository.findById(roleId);

		if (user.isPresent()) {
			if (role.isPresent()) {
				user.get().addRole(role.get());
				roleRepository.save(role.get());
				return userRepository.save(user.get());
			}
			else {
				throw new RoleNotFoundException("Role could not found to be added to a user!");
			}
		}
		else {
			throw new UserNotFoundException("User could not found to add a role!");
		}
	}

	public User removeRoleFromUser(long roleId, long userId) {
		Optional<User> user = userRepository.findById(userId);
		Optional<Role> role = roleRepository.findById(roleId);

		if (user.isPresent()) {
			if (role.isPresent()) {
				user.get().removeRole(role.get());
				roleRepository.save(role.get());
				return userRepository.save(user.get());
			}
			else {
				throw new RoleNotFoundException("Role could not found to be removed from a user!");
			}
		}
		else {
			throw new UserNotFoundException("User could not found to remove a role!");
		}
	}

	public List<RoleDTO> getAllRoles() {
		return roleRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	public RoleDTO getByRoleName(String roleName) {
		return mapToDTO(roleRepository.findByName(roleName)
				.orElseThrow(() -> new RoleNotFoundException("Role could not be found")));

	}

	public RoleDTO getById(long id) {
		return mapToDTO(
				roleRepository.findById(id).orElseThrow(() -> new RoleNotFoundException("Role could not be found")));
	}

	public Page<RoleDTO> getAllWithJpaPagination(int pageNumber, int pageSize) {
		Page<Role> paged = roleRepository.findAll(PageRequest.of(pageNumber, pageSize));
		return paged.map(this::mapToDTO);
	}

	public RoleDTO updateRole(long id, RoleUpdateDTO roleUpdateDTO) {
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new RoleNotFoundException("Role could not be updated"));
		role.setName(roleUpdateDTO.getName());
		return mapToDTO(roleRepository.save(role));
	}

	public RoleDTO removeRole(long id) {
		Role role = roleRepository.findById(id).orElseThrow(() -> new RoleNotFoundException("Role could not be found"));
		role.setActive(false);
		return mapToDTO(roleRepository.save(role));
	}

	public RoleDTO setRoleActive(long id) {
		Role role = roleRepository.findById(id).orElseThrow(() -> new RoleNotFoundException("Role could not be found"));
		role.setActive(true);
		return mapToDTO(roleRepository.save(role));
	}

	public void deleteRole(long id) {
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new RoleNotFoundException("Role could not be delete"));
		roleRepository.delete(role);
	}

	public boolean roleExists(String name) {
		return roleRepository.findByName(name).isPresent();
	}

	private RoleDTO mapToDTO(Role role) {
		RoleDTO roleDTO = new RoleDTO();
		roleDTO.setName(role.getName());
		return roleDTO;
	}

	private Role mapToEntity(RoleDTO roleDTO) {
		Role role = new Role();
		role.setName(roleDTO.getName());
		return role;
	}

}

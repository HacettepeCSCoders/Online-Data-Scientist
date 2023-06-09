package edu.ods.java.service;

import edu.ods.java.dto.UserDTO;
import edu.ods.java.dto.UserUpdateDTO;
import edu.ods.java.exception.UserNotFoundException;
import edu.ods.java.model.Role;
import edu.ods.java.model.User;
import edu.ods.java.repository.RoleRepository;
import edu.ods.java.repository.UserRepository;
import edu.ods.java.security.UserDetailsAdapter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

	private final UserRepository userRepository;

	private final RoleRepository roleRepository;

	private final PasswordEncoder passwordEncoder;

	public UserDTO createUser(UserDTO userDTO) {

		User user = new User();
		user.setUsername(userDTO.getUsername());
		user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
		Optional<Role> userRoleOpt = roleRepository.findByName("ROLE_USER");
		userRoleOpt.ifPresent((userRole) -> user.setRoles(Set.of(userRoleOpt.get())));
		return mapToDTO(userRepository.save(user));
	}

	public List<UserDTO> getUsersWithRole(List<String> roles) {
		return userRepository.findByRoles_NameIn(roles).stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	public List<UserDTO> getAllUsers() {
		return userRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	public UserDTO getByUsername(String username) {
		return mapToDTO(userRepository.findByUsername(username)
				.orElseThrow(() -> new UserNotFoundException("User could not be found")));
	}

	public List<UserDTO> getAllByUsername(String username) {
		return userRepository.findByUsernameContaining(username).stream().map(this::mapToDTO)
				.collect(Collectors.toList());
	}

	public UserDTO getById(long id) {
		return mapToDTO(
				userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User could not be found")));
	}

	public Page<UserDTO> getAllWithJpaPagination(int pageNumber, int pageSize, String username) {
		Page<User> paged = userRepository.findAllByActiveTrueAndUsernameNot(username,
				PageRequest.of(pageNumber, pageSize));
		return paged.map(this::mapToDTO);
	}

	public UserDTO updateUser(long id, UserUpdateDTO userUpdateDTO) {

		User user = userRepository.findById(id)
				.orElseThrow(() -> new UserNotFoundException("User could not be updated"));

		if (userUpdateDTO.getUsername() != null) {
			user.setUsername(userUpdateDTO.getUsername());
		}
		if (userUpdateDTO.getPassword() != null) {
			user.setPassword(passwordEncoder.encode(userUpdateDTO.getPassword()));
		}
		User updatedUser = userRepository.save(user);
		return mapToDTO(updatedUser);
	}

	public UserDTO removeUser(long id) {
		User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User could not be found"));
		user.setActive(false);
		return mapToDTO(userRepository.save(user));
	}

	public UserDTO setUserActive(long id) {
		User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User could not be found"));
		user.setActive(true);
		return mapToDTO(userRepository.save(user));
	}

	public void deleteUser(long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new UserNotFoundException("User could not be delete"));
		userRepository.delete(user);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UserNotFoundException {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UserNotFoundException("User could not be found"));
		return new UserDetailsAdapter(user);
	}

	public boolean userExists(String email) {
		return userRepository.findByUsername(email).isPresent();
	}

	public boolean isAdmin(String username) {
		Optional<User> user = userRepository.findByUsername(username);
		boolean isAdminRoleExists = false;
		for (Role role : user.get().getRoles()) {
			if (role.getName().equals("ROLE_ADMIN")) {
				isAdminRoleExists = true;
				break;
			}
		}
		return isAdminRoleExists;
	}
	private UserDTO mapToDTO(User user) {
		UserDTO userDTO = new UserDTO();
		userDTO.setUsername(user.getUsername());
		userDTO.setPassword(user.getPassword());
		return userDTO;
	}

	private User mapToEntity(UserDTO userDTO) {
		User user = new User();
		user.setUsername(userDTO.getUsername());
		user.setPassword(userDTO.getPassword());
		return user;
	}

}

package edu.ods.java.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ods.java.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUsername(String username);

	Boolean existsByUsername(String username);

	Page<User> findAllByActiveTrueAndUsernameNot(String username, Pageable pageable);

	List<User> findByUsernameContaining(String username);

	List<User> findByRoles_NameIn(List<String> roles);

}

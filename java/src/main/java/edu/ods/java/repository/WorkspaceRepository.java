package edu.ods.java.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ods.java.model.Workspace;
import jakarta.transaction.Transactional;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

	List<Workspace> findAllByUserId(long userId);

	Optional<Workspace> findByFileName(String fileName);

	Optional<Workspace> findById(long id);

	@Transactional
	void deleteByUserId(long userId);

	Optional<Workspace> findByFileNameAndUserId(String fileName, long userId);

	List<Workspace> findByFileNameContaining(String fileName);

}

package edu.ods.java.service;

import edu.ods.java.dto.WorkspaceDTO;
import edu.ods.java.dto.WorkspaceUpdateDTO;
import edu.ods.java.exception.UserNotFoundException;
import edu.ods.java.exception.WorkspaceNotFoundException;
import edu.ods.java.model.Workspace;
import edu.ods.java.repository.UserRepository;
import edu.ods.java.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

	private final WorkspaceRepository workspaceRepository;

	private final UserRepository userRepository;

	public WorkspaceDTO createWorkspace(WorkspaceDTO workspaceDTO) {
		Workspace workspace = mapToEntity(workspaceDTO);
		return mapToDTO(workspaceRepository.save(workspace));
	}

	public List<WorkspaceDTO> getAllWorkspaces() {
		return workspaceRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	public WorkspaceDTO getById(long id) {
		return mapToDTO(workspaceRepository.findById(id)
				.orElseThrow(() -> new WorkspaceNotFoundException("Workspace could not be found")));
	}

	public WorkspaceDTO getByFileName(String fileName) {
		return mapToDTO(workspaceRepository.findByFileName(fileName)
				.orElseThrow(() -> new WorkspaceNotFoundException("Workspace could not be found")));
	}

	public WorkspaceDTO getByFileNameAndUserId(String fileName, long userId) {
		return mapToDTO(workspaceRepository.findByFileNameAndUserId(fileName, userId)
				.orElseThrow(() -> new WorkspaceNotFoundException("Workspace could not be found")));
	}

	public List<WorkspaceDTO> getAllByFileName(String fileName) {
		return workspaceRepository.findByFileNameContaining(fileName).stream().map(this::mapToDTO)
				.collect(Collectors.toList());
	}

	public List<Workspace> getAllByUserId(long userId) {
		if (!userRepository.existsById(userId)) {
			throw new UserNotFoundException("Not found user with id = " + userId);
		}
		return workspaceRepository.findAllByUserId(userId);
	}

	public WorkspaceDTO updateWorkspace(long id, WorkspaceUpdateDTO workspaceUpdateDTO) {

		Workspace workspace = workspaceRepository.findById(id)
				.orElseThrow(() -> new WorkspaceNotFoundException("Workspace could not be updated"));

		if (workspaceUpdateDTO.getId() != 0) {
			workspace.setId(workspaceUpdateDTO.getId());
		}

		if (workspaceUpdateDTO.getFileName() != null) {
			workspace.setFileName(workspaceUpdateDTO.getFileName());
		}
		if (workspaceUpdateDTO.getUserId() != 0) {
			workspace.setUser(userRepository.findById(workspaceUpdateDTO.getUserId()).get());
		}

		Workspace updatedWorkspace = workspaceRepository.save(workspace);
		return mapToDTO(updatedWorkspace);
	}

	public WorkspaceDTO removeWorkspace(long id) {
		Workspace workspace = workspaceRepository.findById(id)
				.orElseThrow(() -> new WorkspaceNotFoundException("Workspace could not be found"));
		workspace.setActive(false);
		return mapToDTO(workspaceRepository.save(workspace));
	}

	public WorkspaceDTO setWorkspaceActive(long id) {
		Workspace workspace = workspaceRepository.findById(id)
				.orElseThrow(() -> new WorkspaceNotFoundException("Workspace could not be found"));
		workspace.setActive(true);
		return mapToDTO(workspaceRepository.save(workspace));
	}

	public void deleteWorkspace(long id) {
		Workspace workspace = workspaceRepository.findById(id)
				.orElseThrow(() -> new WorkspaceNotFoundException("Workspace could not be delete"));
		workspaceRepository.delete(workspace);
	}

	public boolean workspaceExistsByFileName(String fileName) {
		return workspaceRepository.findByFileName(fileName).isPresent();
	}

	public void deleteAllWorkspacesOfUser(long userId) {
		if (!userRepository.existsById(userId)) {
			throw new UserNotFoundException("Not found user with id = " + userId);
		}
		workspaceRepository.deleteByUserId(userId);
	}

	private WorkspaceDTO mapToDTO(Workspace workspace) {
		WorkspaceDTO workspaceDTO = new WorkspaceDTO();
		workspaceDTO.setId(workspace.getId());
		workspaceDTO.setFileName(workspace.getFileName());
		workspaceDTO.setUserId(workspace.getUser().getId());
		return workspaceDTO;
	}

	private Workspace mapToEntity(WorkspaceDTO workspaceDTO) {
		Workspace workspace = new Workspace();
		workspace.setId(workspaceDTO.getId());
		workspace.setFileName(workspaceDTO.getFileName());
		workspace.setUser(userRepository.findById(workspaceDTO.getUserId()).get());
		return workspace;
	}

}

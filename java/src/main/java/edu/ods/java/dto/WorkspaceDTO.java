package edu.ods.java.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class WorkspaceDTO {

	@NotEmpty
	private long id;

	@NotBlank
	@Size(max = 255, min = 1, message = "Please enter a valid file name")
	private String fileName;

	private long userId;

}

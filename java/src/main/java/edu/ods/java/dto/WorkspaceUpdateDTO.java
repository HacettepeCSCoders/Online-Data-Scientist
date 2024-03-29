package edu.ods.java.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data

public class WorkspaceUpdateDTO {

	private long id;

	@Size(max = 255, min = 1, message = "Please enter a valid file name")
	private String fileName;

	private long userId;

}

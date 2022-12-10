package edu.ods.java.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RoleDTO {

	@NotBlank
	@Size(max = 255, min = 6, message = "Please enter a valid role name")
	private String name;

}

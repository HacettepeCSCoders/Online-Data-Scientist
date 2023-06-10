package edu.ods.java.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserChangePasswordDTO {

	@NotBlank
	@Size(max = 255, min = 3, message = "Please enter a valid username")
	@Email
	private String username;

	@NotBlank
	@Size(max = 255, min = 3, message = "Please enter a valid password")
	private String oldPassword;

	@NotBlank
	@Size(max = 255, min = 3, message = "Please enter a valid password")
	private String newPassword;

}

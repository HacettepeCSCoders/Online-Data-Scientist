package edu.ods.java.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateDTO {

	@Size(max = 255, min = 3, message = "Please enter a valid name")
	@Email
	private String username;

	@Size(max = 255, min = 3, message = "Please enter a valid password")
	private String password;

}

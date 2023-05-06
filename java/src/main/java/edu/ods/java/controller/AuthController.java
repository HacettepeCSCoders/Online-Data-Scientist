package edu.ods.java.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.ods.java.dto.UserDTO;
import edu.ods.java.model.User;
import edu.ods.java.security.JWTRequestModel;
import edu.ods.java.security.JWTResponseModel;
import edu.ods.java.service.AuthService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<User> register(@RequestBody UserDTO request) {
		return ResponseEntity.ok(authService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<JWTResponseModel> login(@RequestBody JWTRequestModel request) throws Exception {
		return ResponseEntity.ok(authService.createToken(request));
	}

}

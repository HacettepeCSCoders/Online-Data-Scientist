package edu.ods.java.security;

import java.io.Serial;
import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JWTRequestModel implements Serializable {

	@Serial
	private static final long serialVersionUID = 2636936156391265891L;

	private String username;

	private String password;

}

package edu.ods.java.security;

import java.io.Serial;
import java.io.Serializable;

public record JWTResponseModel(String access_token, Long id, boolean banned, String name) implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;

}

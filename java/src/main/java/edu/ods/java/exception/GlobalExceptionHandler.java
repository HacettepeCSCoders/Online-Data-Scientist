package edu.ods.java.exception;

import java.util.Date;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<ErrorObject> handleUserNotFoundException(UserNotFoundException ex, WebRequest request) {

		ErrorObject errorObject = new ErrorObject();

		errorObject.setStatusCode(HttpStatus.NOT_FOUND.value());
		errorObject.setMessage(ex.getMessage());
		errorObject.setTimestamp(new Date());

		return new ResponseEntity<>(errorObject, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(RoleNotFoundException.class)
	public ResponseEntity<ErrorObject> handleRoleNotFoundException(RoleNotFoundException ex, WebRequest request) {

		ErrorObject errorObject = new ErrorObject();

		errorObject.setStatusCode(HttpStatus.NOT_FOUND.value());
		errorObject.setMessage(ex.getMessage());
		errorObject.setTimestamp(new Date());

		return new ResponseEntity<>(errorObject, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<?> handleAuthException(HttpServletRequest request, Throwable t) {
		LOGGER.error(t.getMessage(), t);
		var map = new HashMap<>();
		map.put("Error message", "Authentication error occured...");
		return new ResponseEntity<>(map, HttpStatus.UNAUTHORIZED);

	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<?> handleDatabaseException(HttpServletRequest request, Throwable t) {
		LOGGER.error(t.getMessage(), t);
		var map = new HashMap<>();
		map.put("Error message", "DB error occured...");
		return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);

	}

}

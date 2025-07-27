package com.eagletech.ecommerce.backend.infrastructure.web.exceptions;

import org.hibernate.StaleObjectStateException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({ StaleObjectStateException.class, jakarta.persistence.OptimisticLockException.class })
    public ResponseEntity<Object> handleOptimisticLockingFailure(Exception ex, WebRequest request) {
        return new ResponseEntity<>(
                Map.of("message", "Este registro ha sido modificado por otro usuario. Por favor, recargue los datos e intente de nuevo."),
                HttpStatus.CONFLICT);
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<Object> handleCategoryNotFoundException(CategoryNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(
                Map.of("message", ex.getMessage()),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CategoryAlreadyExistsException.class)
    public ResponseEntity<Object> handleCategoryAlreadyExistsException(CategoryAlreadyExistsException ex, WebRequest request) {
        return new ResponseEntity<>(
                Map.of("message", ex.getMessage()),
                HttpStatus.CONFLICT);
    }
}

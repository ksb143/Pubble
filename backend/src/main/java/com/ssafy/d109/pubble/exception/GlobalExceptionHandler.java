package com.ssafy.d109.pubble.exception;

import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.exception.project.ProjectAccessDeniedException;
import com.ssafy.d109.pubble.exception.project.ProjectNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ResponseDto<?> response;

    @ExceptionHandler(ProjectNotFoundException.class)
    public ResponseEntity<ResponseDto<?>> handleProjectNotFoundException(ProjectNotFoundException e) {
        response = new ResponseDto<>(true, e.getMessage(), null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(ProjectAccessDeniedException.class)
    public ResponseEntity<ResponseDto<?>> handleProjectAccessDeniedException(ProjectAccessDeniedException e) {
        response = new ResponseDto<>(true, e.getMessage(), null);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }
}

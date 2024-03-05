package fr.eni.tp.encheres.config;

import fr.eni.tp.encheres.dto.ErrorDto;
import fr.eni.tp.encheres.exception.UserException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(value = {UserException.class})
    @ResponseBody
    public ResponseEntity<ErrorDto> handleUserException(UserException exception) {
        return ResponseEntity
                .status(exception.getStatus())
                .body(ErrorDto.builder().message(exception.getMessage()).build());
    }
}

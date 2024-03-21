package fr.eni.tp.encheres.config;

import fr.eni.tp.encheres.dto.ErrorDto;
import fr.eni.tp.encheres.exception.*;
import org.postgresql.util.PSQLException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserException.class)
    @ResponseBody
    public ResponseEntity<ErrorDto> handleUserException(UserException exception) {
        return ResponseEntity
                .status(exception.getStatus())
                .body(ErrorDto.builder().message(exception.getMessage()).build());
    }

    @ExceptionHandler(SoldItemException.class)
    @ResponseBody
    public ResponseEntity<ErrorDto> handleUserException(SoldItemException exception) {
        return ResponseEntity
                .status(exception.getStatus())
                .body(ErrorDto.builder().message(exception.getMessage()).build());
    }

    @ExceptionHandler(CategoryException.class)
    @ResponseBody
    public ResponseEntity<ErrorDto> handleCategoryException(CategoryException exception) {
        return ResponseEntity
                .status(exception.getStatus())
                .body(ErrorDto.builder().message(exception.getMessage()).build());
    }

    @ExceptionHandler(AuctionException.class)
    @ResponseBody
    public ResponseEntity<ErrorDto> handleAuctionException(AuctionException exception) {
        return ResponseEntity
                .status(exception.getStatus())
                .body(ErrorDto.builder().message(exception.getMessage()).build());
    }

    @ExceptionHandler(JwtException.class)
    @ResponseBody
    public ResponseEntity<ErrorDto> handleUserException(JwtException exception) {
        return ResponseEntity
                .status(exception.getStatus())
                .body(ErrorDto.builder().message(exception.getMessage()).build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationException(MethodArgumentNotValidException exception) {
        List<String> errorMessages = new ArrayList<>();

        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            errorMessages.add(fieldError.getDefaultMessage());
        }

        String errorMessage = String.join("\n", errorMessages);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler(PSQLException.class)
    public ResponseEntity<ErrorDto> handlePSQLException(PSQLException exception) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorDto.builder().message("Constraints violation").build());
    }
}

package fr.eni.tp.encheres.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@Getter
public class UserException extends RuntimeException {

    private final HttpStatus status;

    public UserException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}

package fr.eni.tp.encheres.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class SoldItemException extends RuntimeException {

    private final HttpStatus status;

    public SoldItemException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}

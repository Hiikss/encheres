package fr.eni.tp.encheres.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class AuctionException extends RuntimeException {

    private final HttpStatus status;

    public AuctionException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}

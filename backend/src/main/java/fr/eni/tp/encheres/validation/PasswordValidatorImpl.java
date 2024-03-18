package fr.eni.tp.encheres.validation;

import fr.eni.tp.encheres.exception.UserException;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class PasswordValidatorImpl implements PasswordValidator {

    @Override
    public void validatePassword(char[] password) {
        if(password==null || !String.valueOf(password).matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[#?!@$%^&*-])(?=\\S+$).{8,}$")) {
            throw new UserException(HttpStatus.BAD_REQUEST, "Password must have at least 8 characters including at least 1 lowercase letter, 1 uppercase letter, 1 digit and 1 special character");
        }
    }
}

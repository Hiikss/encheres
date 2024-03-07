package fr.eni.tp.encheres.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<Password, char[]> {

    @Override
    public boolean isValid(char[] chars, ConstraintValidatorContext constraintValidatorContext) {
        return chars != null && String.valueOf(chars).matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[#?!@$%^&*-])(?=\\S+$).{8,}$");
    }
}

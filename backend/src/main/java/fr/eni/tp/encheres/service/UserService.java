package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.CredentialsDto;
import fr.eni.tp.encheres.dto.SignUpDto;
import fr.eni.tp.encheres.dto.UserDto;

public interface UserService {

    UserDto login(CredentialsDto credentialsDto);

    UserDto register(SignUpDto signUpDto);

    UserDto findByPseudo(String login);
}

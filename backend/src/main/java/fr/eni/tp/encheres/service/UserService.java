package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.CredentialsDto;
import fr.eni.tp.encheres.dto.SignUpDto;
import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.UserDto;

public interface UserService {

    AuthenticatedUserDto login(CredentialsDto credentialsDto);

    AuthenticatedUserDto register(SignUpDto signUpDto);

    AuthenticatedUserDto findByPseudo(String login);

    UserDto getUser(Long userId);

    AuthenticatedUserDto updateUser(Long userId, SignUpDto userDto, String authorizationHeader);

    void deleteUser(Long userId, String authorizationHeader);
}

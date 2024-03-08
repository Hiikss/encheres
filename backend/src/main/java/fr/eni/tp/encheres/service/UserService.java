package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.CredentialsDto;
import fr.eni.tp.encheres.dto.SignUpDto;
import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.UserDto;

import java.util.UUID;

public interface UserService {

    AuthenticatedUserDto login(CredentialsDto credentialsDto);

    AuthenticatedUserDto register(SignUpDto signUpDto);

    AuthenticatedUserDto getAuthenticatedUser(UUID userId);

    UserDto getUser(UUID userId);

    AuthenticatedUserDto updateUser(UUID userId, SignUpDto userDto, AuthenticatedUserDto authenticatedUser);

    void deleteUser(UUID userId, AuthenticatedUserDto authenticatedUser);
}

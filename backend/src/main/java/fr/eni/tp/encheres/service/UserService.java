package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.CredentialsDto;
import fr.eni.tp.encheres.dto.RequestUserDto;
import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.ResponseUserDto;

import java.util.UUID;

public interface UserService {

    AuthenticatedUserDto login(CredentialsDto credentialsDto);

    AuthenticatedUserDto register(RequestUserDto requestUserDto);

    AuthenticatedUserDto getAuthenticatedUser(UUID userId);

    ResponseUserDto getUser(UUID userId);

    ResponseUserDto updateUser(UUID userId, RequestUserDto userDto, AuthenticatedUserDto authenticatedUser);

    void deleteUser(UUID userId, AuthenticatedUserDto authenticatedUser);
}

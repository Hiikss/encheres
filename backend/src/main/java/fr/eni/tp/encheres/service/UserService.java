package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.CredentialsDto;
import fr.eni.tp.encheres.dto.RequestUserDto;
import fr.eni.tp.encheres.dto.ResponseUserDto;

public interface UserService {

    AuthenticatedUserDto login(CredentialsDto credentialsDto);

    AuthenticatedUserDto register(RequestUserDto requestUserDto);

    AuthenticatedUserDto getAuthenticatedUser(String pseudo);

    ResponseUserDto getUser(String pseudo);

    ResponseUserDto updateUser(String pseudo, RequestUserDto userDto, AuthenticatedUserDto authenticatedUser);

    void deleteUser(String pseudo, AuthenticatedUserDto authenticatedUser);
}

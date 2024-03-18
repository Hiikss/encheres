package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.CredentialsDto;
import fr.eni.tp.encheres.dto.RequestUserDto;
import fr.eni.tp.encheres.dto.ResponseUserDto;

import java.util.List;

public interface UserService {

    AuthenticatedUserDto login(CredentialsDto credentialsDto);

    AuthenticatedUserDto register(RequestUserDto requestUserDto);

    AuthenticatedUserDto getAuthenticatedUser(String pseudo);

    List<ResponseUserDto> getUsers(int page, int size, String searchFilter);

    long countUsers(String searchFilter);

    ResponseUserDto getUser(String pseudo);

    ResponseUserDto updateUser(String pseudo, RequestUserDto userDto, AuthenticatedUserDto authenticatedUser);

    void deleteUser(String pseudo, AuthenticatedUserDto authenticatedUser);

}

package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.*;

import java.util.List;

public interface UserService {

    AuthenticatedUserDto login(CredentialsDto credentialsDto);

    AuthenticatedUserDto register(UserRequestDto userRequestDto);

    AuthenticatedUserDto getAuthenticatedUser(String pseudo);

    List<UserResponseDto> getUsers(int page, int size, String searchFilter);

    long countUsers(String searchFilter);

    UserResponseDto getUserResponse(String pseudo);

    UserResponseDto updateUser(String pseudo, UserRequestDto userDto, AuthenticatedUserDto authenticatedUser);

    void deleteUser(String pseudo, AuthenticatedUserDto authenticatedUser);

    void partialUpdateUser(PartialUserRequestDto partialUser);
}

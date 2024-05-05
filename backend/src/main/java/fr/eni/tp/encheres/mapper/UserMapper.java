package fr.eni.tp.encheres.mapper;

import fr.eni.tp.encheres.dto.UserRequestDto;
import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.UserResponseDto;
import fr.eni.tp.encheres.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "token", ignore = true)
    AuthenticatedUserDto toAuthenticatedUserDto(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "admin", ignore = true)
    @Mapping(target = "soldItems", ignore = true)
    @Mapping(target = "auctions", ignore = true)
    User toUser(UserRequestDto userRequestDto);

    UserResponseDto toUserDto(User user);

    List<UserResponseDto> toResponseUserDtoList(List<User> uers);
}

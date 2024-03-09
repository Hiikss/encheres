package fr.eni.tp.encheres.mapper;

import fr.eni.tp.encheres.dto.RequestUserDto;
import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.ResponseUserDto;
import fr.eni.tp.encheres.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", source = "userId")
    @Mapping(target = "token", ignore = true)
    AuthenticatedUserDto toAuthenticatedUserDto(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "admin", ignore = true)
    @Mapping(target = "soldItems", ignore = true)
    @Mapping(target = "auctions", ignore = true)
    User toUser(RequestUserDto requestUserDto);

    ResponseUserDto toUserDto(User user);
}

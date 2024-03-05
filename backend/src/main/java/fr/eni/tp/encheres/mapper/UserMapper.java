package fr.eni.tp.encheres.mapper;

import fr.eni.tp.encheres.dto.SignUpDto;
import fr.eni.tp.encheres.dto.UserDto;
import fr.eni.tp.encheres.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(User user);

    @Mapping(target = "password", ignore = true)
    User signUpToUser(SignUpDto signUpDto);
}

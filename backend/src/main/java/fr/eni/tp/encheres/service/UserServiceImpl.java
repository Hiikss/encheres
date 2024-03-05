package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.CredentialsDto;
import fr.eni.tp.encheres.dto.SignUpDto;
import fr.eni.tp.encheres.dto.UserDto;
import fr.eni.tp.encheres.exception.UserException;
import fr.eni.tp.encheres.mapper.UserMapper;
import fr.eni.tp.encheres.model.User;
import fr.eni.tp.encheres.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public UserDto login(CredentialsDto credentialsDto) {
        User user = userRepository.findByLogin(credentialsDto.username())
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "Unknown user"));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()), user.getPassword())) {
            return userMapper.toUserDto(user);
        }
        throw new UserException(HttpStatus.BAD_REQUEST, "Credentials are invalid");
    }

    @Override
    public UserDto register(SignUpDto signUpDto) {
        Optional<User> oUser = userRepository.findByLogin(signUpDto.pseudo());

        if (oUser.isPresent()) {
            throw new UserException(HttpStatus.BAD_REQUEST, "Pseudo already exists");
        }

        User user = userMapper.signUpToUser(signUpDto);

        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(signUpDto.password())));
        User savedUser = userRepository.save(user);

        return userMapper.toUserDto(savedUser);
    }
}

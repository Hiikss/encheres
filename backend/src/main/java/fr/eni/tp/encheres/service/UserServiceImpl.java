package fr.eni.tp.encheres.service;

import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.CredentialsDto;
import fr.eni.tp.encheres.dto.RequestUserDto;
import fr.eni.tp.encheres.dto.ResponseUserDto;
import fr.eni.tp.encheres.exception.UserException;
import fr.eni.tp.encheres.mapper.UserMapper;
import fr.eni.tp.encheres.model.User;
import fr.eni.tp.encheres.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.CharBuffer;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);
    private static final String USER_NOT_FOUND = "User not found";

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    @Override
    public AuthenticatedUserDto login(CredentialsDto credentialsDto) {
        LOGGER.info("[Service] : attempting to login");

        User user = userRepository.findByLogin(credentialsDto.login())
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "Bad credentials"));

        if (user.isActive() && passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()), user.getPassword())) {
            return userMapper.toAuthenticatedUserDto(user);
        }

        throw new UserException(HttpStatus.BAD_REQUEST, "Bad credentials");
    }

    @Override
    public AuthenticatedUserDto register(RequestUserDto requestUserDto) {
        Optional<User> oUser = userRepository.findByPseudo(requestUserDto.getPseudo());

        if (oUser.isPresent()) {
            throw new UserException(HttpStatus.BAD_REQUEST, "Pseudo already exists");
        }

        oUser = userRepository.findByEmail(requestUserDto.getEmail());

        if (oUser.isPresent()) {
            throw new UserException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        User user = userMapper.toUser(requestUserDto);

        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(requestUserDto.getPassword())));
        user.setCredit(100);
        user.setAdmin(false);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        return userMapper.toAuthenticatedUserDto(savedUser);
    }

    @Override
    public AuthenticatedUserDto getAuthenticatedUser(String userPseudo) {
        User user = userRepository.findByPseudo(userPseudo)
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, USER_NOT_FOUND));
        return userMapper.toAuthenticatedUserDto(user);
    }

    @Override
    public ResponseUserDto getUser(String pseudo) {
        User user = userRepository.findByPseudo(pseudo)
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, USER_NOT_FOUND));
        return userMapper.toUserDto(user);
    }

    @Override
    public ResponseUserDto updateUser(String pseudo, RequestUserDto userDto, AuthenticatedUserDto authenticatedUser) {
        if (authenticatedUser.getPseudo().equals(pseudo) || authenticatedUser.isAdmin()) {
            User userToUpdate = userRepository.findByPseudo(pseudo)
                    .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, USER_NOT_FOUND));

            if(!userToUpdate.getPseudo().equals(userDto.getPseudo())) {
                throw new UserException(HttpStatus.BAD_REQUEST, "Pseudo can't be changed");
            }

            Optional<User> oUser = userRepository.findByEmail(userDto.getEmail());

            if (oUser.isPresent() && !oUser.get().getPseudo().equals(userToUpdate.getPseudo())) {
                throw new UserException(HttpStatus.BAD_REQUEST, "Email already exists");
            }

            User updatedUser = userMapper.toUser(userDto);
            updatedUser.setUserId(userToUpdate.getUserId());
            updatedUser.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.getPassword())));

            User savedUser = userRepository.save(updatedUser);

            return userMapper.toUserDto(savedUser);
        }

        throw new UserException(HttpStatus.FORBIDDEN, "Can't update this user");
    }

    @Override
    @Transactional
    public void deleteUser(String pseudo, AuthenticatedUserDto authenticatedUser) {
        if (authenticatedUser.isAdmin() || authenticatedUser.getPseudo().equals(pseudo)) {
            userRepository.deleteByPseudo(pseudo);
            return;
        }

        throw new UserException(HttpStatus.FORBIDDEN, "Can't delete this user");
    }

}

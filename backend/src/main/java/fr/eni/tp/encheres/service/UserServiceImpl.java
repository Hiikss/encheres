package fr.eni.tp.encheres.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import fr.eni.tp.encheres.config.security.AppProperties;
import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.CredentialsDto;
import fr.eni.tp.encheres.dto.SignUpDto;
import fr.eni.tp.encheres.dto.UserDto;
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

    private final AppProperties appProperties;

    @Override
    public AuthenticatedUserDto login(CredentialsDto credentialsDto) {
        LOGGER.info("[Service] : attempting to login");

        User user = userRepository.findByLogin(credentialsDto.login())
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "Bad credentials"));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()), user.getPassword())) {
            return userMapper.toAuthenticatedUserDto(user);
        }

        throw new UserException(HttpStatus.BAD_REQUEST, "Bad credentials");
    }

    @Override
    public AuthenticatedUserDto register(SignUpDto signUpDto) {
        Optional<User> oUser = userRepository.findByPseudo(signUpDto.getPseudo());

        if (oUser.isPresent()) {
            throw new UserException(HttpStatus.BAD_REQUEST, "Pseudo already exists");
        }

        oUser = userRepository.findByEmail(signUpDto.getEmail());

        if (oUser.isPresent()) {
            throw new UserException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        User user = userMapper.signUpToUser(signUpDto);

        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(signUpDto.getPassword())));
        user.setCredit(100);
        user.setAdmin(false);

        User savedUser = userRepository.save(user);

        return userMapper.toAuthenticatedUserDto(savedUser);
    }

    @Override
    public AuthenticatedUserDto findByPseudo(String login) {
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, USER_NOT_FOUND));
        return userMapper.toAuthenticatedUserDto(user);
    }

    @Override
    public UserDto getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, USER_NOT_FOUND));
        return userMapper.toUserDto(user);
    }

    @Override
    public AuthenticatedUserDto updateUser(Long userId, SignUpDto userDto, String authorizationHeader) {
        // User we want to update
        User userToUpdate = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, USER_NOT_FOUND));

        // User doing the request
        User requestUser = getRequestUser(authorizationHeader);

        // User can only update himself
        if (requestUser == userToUpdate) {
            // Check if there is an user except us with the new pseudo
            Optional<User> oUser = userRepository.findByPseudo(userDto.getPseudo());

            if (oUser.isPresent() && !oUser.get().getPseudo().equals(userToUpdate.getPseudo())) {
                throw new UserException(HttpStatus.BAD_REQUEST, "Pseudo already exists");
            }

            // Check if there is an user except us with the new email
            oUser = userRepository.findByEmail(userDto.getEmail());

            if (oUser.isPresent() && !oUser.get().getEmail().equals(userToUpdate.getEmail())) {
                throw new UserException(HttpStatus.BAD_REQUEST, "Email already exists");
            }

            User updatedUser = userMapper.signUpToUser(userDto);
            updatedUser.setUserId(userToUpdate.getUserId());
            updatedUser.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.getPassword())));

            User savedUser = userRepository.save(updatedUser);

            return userMapper.toAuthenticatedUserDto(savedUser);
        }

        throw new UserException(HttpStatus.FORBIDDEN, "Can't update this user");
    }

    @Override
    public void deleteUser(Long userId, String authorizationHeader) {
        User userToDelete = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, USER_NOT_FOUND));

        User requestUser = getRequestUser(authorizationHeader);

        if (requestUser.isAdmin() || userToDelete == requestUser) {
            userRepository.deleteById(userId);
            return;
        }

        throw new UserException(HttpStatus.FORBIDDEN, "Can't delete this user");
    }

    private User getRequestUser(String authorizationHeader) {
        if (authorizationHeader == null) {
            throw new UserException(HttpStatus.FORBIDDEN, "Authorization header missing");
        }

        String[] authElements = authorizationHeader.split(" ");

        if (authElements.length != 2 || !"Bearer".equals(authElements[0])) {
            throw new UserException(HttpStatus.FORBIDDEN, "Invalid authorization header");
        }

        Algorithm algorithm = Algorithm.HMAC256(appProperties.getSecretKey());
        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT decoded = verifier.verify(authElements[1]);

        return userRepository.findByPseudo(decoded.getSubject())
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, USER_NOT_FOUND));
    }
}

package fr.eni.tp.encheres.controller;

import fr.eni.tp.encheres.config.security.UserAuthProvider;
import fr.eni.tp.encheres.dto.CredentialsDto;
import fr.eni.tp.encheres.dto.RefreshTokenRequestDto;
import fr.eni.tp.encheres.dto.UserRequestDto;
import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Validated
public class AuthController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final UserAuthProvider userAuthProvider;

    @PostMapping("/login")
    public ResponseEntity<AuthenticatedUserDto> login(@RequestBody CredentialsDto credentialsDto) {
        LOGGER.info("[Controller] : attempting to login");

        AuthenticatedUserDto user = userService.login(credentialsDto);
        user.setToken(userAuthProvider.createToken(user));
        user.setRefreshToken(userAuthProvider.createRefreshToken(user).getToken());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticatedUserDto> register(@Valid @RequestBody UserRequestDto userRequestDto) {
        AuthenticatedUserDto user = userService.register(userRequestDto);
        user.setToken(userAuthProvider.createToken(user));
        user.setRefreshToken(userAuthProvider.createRefreshToken(user).getToken());
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthenticatedUserDto> renew(@RequestBody RefreshTokenRequestDto refreshToken) {
        AuthenticatedUserDto user = userService.getAuthenticatedUser(refreshToken.getPseudo());
        user.setRefreshToken(userAuthProvider.verifyRefreshToken(refreshToken.getToken(), user).getToken());
        user.setToken(userAuthProvider.createToken(user));
        return ResponseEntity.ok().body(user);
    }

}

package fr.eni.tp.encheres.controller;

import fr.eni.tp.encheres.config.security.UserAuthProvider;
import fr.eni.tp.encheres.dto.AuthenticatedUserDto;
import fr.eni.tp.encheres.dto.SignUpDto;
import fr.eni.tp.encheres.dto.UserDto;
import fr.eni.tp.encheres.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;
    private final UserAuthProvider userAuthProvider;

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUser(@PathVariable UUID userId) {
        return ResponseEntity.ok().body(userService.getUser(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<AuthenticatedUserDto> updateUser(@PathVariable UUID userId, @Valid @RequestBody SignUpDto user, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        AuthenticatedUserDto userDto = userService.updateUser(userId, user, authorizationHeader);
        userDto.setToken(userAuthProvider.createToken(userDto));
        return ResponseEntity.ok().body(userDto);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID userId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        userService.deleteUser(userId, authorizationHeader);
        return ResponseEntity.ok().body("User deleted");
    }
}
